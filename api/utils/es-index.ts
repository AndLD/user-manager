import { ApiResponse } from '@elastic/elasticsearch'
import { esClient } from '../db/db'
import { USERS_INDEX } from './constants'

const createIndex = async () =>
    await esClient.indices.create({
        index: USERS_INDEX,
        body: {
            mappings: {
                properties: {
                    name: { type: 'keyword', ignore_above: 60 },
                    surname: { type: 'keyword', ignore_above: 60 },
                    birthday: { type: 'date', format: 'dd.MM.yyyy' },
                    phone: { type: 'keyword' },
                    email: { type: 'keyword' },
                    timestamp: { type: 'date', format: 'dd.MM.yyyy HH:mm' }
                }
            }
        }
    })

export async function checkIndexExisting() {
    const result: ApiResponse = await esClient.indices.exists({ index: USERS_INDEX })
    if (result.statusCode === 404) await createIndex()
}
