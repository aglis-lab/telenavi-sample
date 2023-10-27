import { Request, Response } from "express";

const genreSource = await Bun.file('assets/genre.json').json()

function fetch(req: Request, res: Response) {
    return res.send(genreSource)
}

const genreController = {
    fetch,
}

export default genreController
