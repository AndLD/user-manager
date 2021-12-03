import logger from './utils/logger'
import { app, Router } from './express-setup'
import { Request, Response } from 'express'
import { IUser, IUserPost, IUserPut } from './utils/interfaces/user'
import esClient from './db/db'
import { ApiResponse } from '@elastic/elasticsearch'
import { validate } from 'simple-express-validation'
import { PostUserSchema, PutUserSchema } from './validation/user'
import { createTimestamp } from './utils/date'
import { USERS_INDEX } from './utils/constants'
import { checkIndexExisting } from './utils/es-index'

const userRouter = Router()
app.use('/user', userRouter)

userRouter.get('/', async (req: Request, res: Response) => {
    const pagination: {
        from: number
        size: number
    } = {
        from: (((req.query.page || 1) as number) - 1) * (((req.query.results || 10) as number) * 1),
        size: (req.query.results || 10) as number
    }

    // Валидация параметров пагинации
    if (pagination && pagination.from <= 0 && pagination.size <= 0) {
        res.status(400).json({
            error: true,
            data: {
                paginationError: {
                    msg: 'current page or size of results per one page incorrectly specified'
                }
            }
        })
    }

    const filters = (req.query.filters as string)?.split(';').map((elem: string) => elem?.split(','))

    const bool: {
        filter: { term: { [x: string]: string } }[]
        must?: {
            range?: {
                [x: string]: { gte?: string; lte?: string; gt?: string; lt?: string }
            }
        }
    } = {
        filter: []
    }

    if (filters)
        for (const filter of filters) {
            const [field, operation, value] = filter

            function setRangeProperty() {
                if (!bool.must) bool.must = {}
                if (!bool.must.range) bool.must.range = {}
                bool.must.range[field] = { [operation]: value }
            }

            if (operation === '==') {
                bool.filter.push({ term: { [field]: value } })
            } else if ('>' || '<' || '>=' || '<=') {
                setRangeProperty()
            }
        }

    const result: ApiResponse = await esClient.search({
        index: USERS_INDEX,
        ...pagination,
        body: {
            query: {
                bool
                // : {
                //     filter: [{ term: { name: 'Dn' } }],
                //     must: {
                //         range: { birthday: { gte: '10.04.2001', lte: '16.04.2001' } }
                //     }
                // }
            }
        }
    })

    const users = result.body

    res.json({
        error: false,
        meta: {
            pagination: { ...pagination, total: users.hits.total.value },
            filters
        },
        data: users.hits.hits.map((elem: any) => ({
            id: elem._id,
            ...elem._source
        }))
    })
})

userRouter.post('/', validate(PostUserSchema), async (req: Request, res: Response) => {
    const body: IUserPost = req.body

    const result: ApiResponse = await esClient.index({
        index: USERS_INDEX,
        body: {
            ...body,
            timestamp: createTimestamp()
        }
    })

    res.json({
        error: false,
        data: result.body
    })
})

userRouter.put('/:id', validate(PutUserSchema), async (req: Request, res: Response) => {
    const id = req.params.id

    const body: IUserPut = req.body

    const result: ApiResponse = await esClient.update({
        id,
        index: USERS_INDEX,
        body: {
            doc: body
        }
    })

    res.json({
        error: false,
        data: result.body
    })
})

userRouter.delete('/', async (req: Request, res: Response) => {
    const ids: string[] | undefined = req.query.ids?.toString().split(',')

    if (!ids) {
        res.sendStatus(400)
        return
    }

    const result: ApiResponse = await esClient.deleteByQuery({
        index: USERS_INDEX,
        body: {
            query: {
                terms: {
                    _id: ids
                }
            }
        }
    })

    res.json({
        error: false,
        data: result.body
    })
})

async function start() {
    const { body: err }: ApiResponse = await esClient.ping()

    logger.info(err ? 'Elasticsearch successfully connected!' : 'Elasticsearch has not connected!')
    await checkIndexExisting()

    const port = process.env.PORT || 8080

    await app.listen(port, () => {
        logger.info(`Server has been started on http://localhost:${port}`)
    })
}

start()
