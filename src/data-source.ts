import "reflect-metadata"

import { DataSource } from "typeorm"
import { Movie } from "./entity/movie"
import { Genre } from "./entity/genre"

export const AppDataSource = new DataSource({
    type: 'mysql',
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    port: Number(process.env.PORT),
    synchronize: true,
    logging: false,
    entities: [Movie, Genre],
    migrations: [],
    subscribers: [],
})
