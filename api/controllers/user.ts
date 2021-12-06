import { ApiResponse } from '@elastic/elasticsearch'
import { Request, Response } from 'express'
import { esClient } from '../db/db'
import { USERS_INDEX } from '../utils/constants'
import { createTimestamp } from '../utils/date'
import { IUserPost } from '../utils/interfaces/user'

export const getUser = async (req: Request, res: Response) => {
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

            if (operation === '==') {
                bool.filter.push({ term: { [field]: value } })
            } else if (operation === 'gt' || operation === 'gte' || operation === 'lt' || operation === 'lte') {
                if (!bool.must) bool.must = {}
                if (!bool.must.range) bool.must.range = {}
                if (!bool.must.range[field]) bool.must.range[field] = {}
                bool.must.range[field][operation] = value
            }
        }

    const result: ApiResponse = await esClient.search({
        index: USERS_INDEX,
        ...pagination,
        body: {
            query: {
                bool
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
}

export const postUser = async (req: Request, res: Response) => {
    const body: IUserPost = req.body

    const result: ApiResponse = await esClient.index({
        index: USERS_INDEX,
        body: {
            ...body,
            timestamp: createTimestamp()
        },
        refresh: true
    })

    res.json({
        error: false,
        data: result.body
    })
}

export const putUser = async (req: Request, res: Response) => {
    const id = req.params.id

    const body: any = {
        ...req.body,
        timestamp: createTimestamp()
    }

    const result: ApiResponse = await esClient.update({
        id,
        index: USERS_INDEX,
        body: {
            doc: body
        },
        refresh: true
    })

    res.json({
        error: false,
        data: result.body
    })
}

export const deleteUser = async (req: Request, res: Response) => {
    const ids: string[] | undefined = req.query.ids?.toString().split(',')

    if (!ids || !ids.length) {
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
        },
        refresh: true
    })

    res.json({
        error: false,
        data: result.body
    })
}
