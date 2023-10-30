import { AppDataSource } from "./data-source"
import { Application } from "./app"
import { config } from "dotenv";

config()

AppDataSource.initialize().then(async () => {
    console.log("Initialize Database...")

    console.log("Try run server")
    new Application().createApp()
}).catch(error => console.log(error))
