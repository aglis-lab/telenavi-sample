import { AppDataSource } from "./data-source"
import { Application } from "./app"
import { Client } from "@elastic/elasticsearch";

AppDataSource.initialize().then(async () => {
    console.log("Initialize Database...")

    // console.log("Initialize Elastic Search...")
    // const elasticClient = new Client({
    //     node: 'http://localhost:9200'
    // })
    // console.log(await elasticClient.info())

    console.log("Try run server")
    new Application().createApp()
}).catch(error => console.log(error))
