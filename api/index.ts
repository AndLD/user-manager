import logger from './utils/logger'
import { app } from './express-setup'
import { esClient } from './db/db'
import { ApiResponse } from '@elastic/elasticsearch'
import { checkIndexExisting } from './utils/es-index'
import { userRouter } from './routers/user'

app.use('/user', userRouter)

async function start() {
    const {
        body: { err }
    }: ApiResponse = await esClient.ping()

    if (err) {
        logger.error('Elasticsearch has not connected!')
        return
    } else logger.info('Elasticsearch successfully connected!')

    await checkIndexExisting()

    const port = process.env.PORT || 8080

    await app.listen(port, () => {
        logger.info(`Server has been started on port ${port}`)
    })
}

start()
