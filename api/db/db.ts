import { Client } from '@elastic/elasticsearch'

export const esClient = new Client({
    node: process.env.DB_HOST || 'http://localhost:9200'
})
