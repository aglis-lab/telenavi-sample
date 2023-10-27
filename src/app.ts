import express from "express";
import { urlencoded } from "body-parser";
import movieController from "./controller/movie";
import { upload } from "./controller/upload";
import genreController from "./controller/genre";
import morgan from "morgan";
import cors from "cors";

export class Application {
    app: express.Express

    constructor() { }

    createApp(): express.Express {
        this.app = express()

        this.initMiddleware()
        this.initRoutes()
        this.listening()

        return this.app
    }

    initMiddleware() {
        this.app.use(cors())
        this.app.use(morgan('tiny'))
        this.app.use(urlencoded({ extended: false }))
        this.app.use('/assets', express.static('assets'))
    }

    initRoutes() {
        this.app.use('/movies', this.initMovies(express.Router()))
        this.app.use('/genres', this.initGenres(express.Router()))
        this.app.use('*', (req, res) => res.status(400).send('404'))
    }

    initMovies(route: express.Router) {
        route.get('/', movieController.fetch)
        route.get('/search', movieController.advancedSearch)
        route.post('/', upload.single('movie_image'), movieController.create)
        route.get('/:id', movieController.get)
        route.put('/:id', upload.single('movie_image'), movieController.update)
        route.delete('/:id', movieController.delete)

        return route
    }

    initGenres(route: express.Router) {
        route.get('/', genreController.fetch)

        return route
    }

    listening() {
        this.app.listen(8000, () => {
            console.log(`Listening at port 8000`)
        })
    }
}
