import { Client } from "@elastic/elasticsearch";

export const elasticClient = new Client({
    node: 'http://localhost:9200'
})
