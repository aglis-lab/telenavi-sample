import { Request, Response } from "express";
import { Genre } from "../entity/genre";

const genreSource = await Bun.file('assets/genre.json').json()

async function fetch(req: Request, res: Response) {
    const data = await Genre.find();

    return res.send({
        result: data,
    })
}

async function create(req: Request, res: Response) {
    const body = req.body
    const newGenre = new Genre()

    newGenre.label = body.label
    newGenre.key = body.key

    try {
        const createdGenre = await newGenre.save()

        return res.send(createdGenre)
    } catch (error) {
        return res.status(400).send('Genre not created')
    }
}

async function update(req: Request, res: Response) {
    const body = req.body
    const newGenre = await Genre.findOne({
        where: {
            id: Number(req.params.id)
        }
    })

    if (!newGenre) {
        return res.send('no data was updated!')
    }

    newGenre.label = body.label
    newGenre.key = body.key

    try {
        const createdGenre = await newGenre.save()

        return res.send(createdGenre)
    } catch (error) {
        return res.status(400).send('Genre not created')
    }
}

async function deleteGenre(req: Request, res: Response) {
    const newGenre = await Genre.findOne({
        where: {
            id: Number(req.params.id)
        }
    })

    if (!newGenre) {
        return res.status(400).send('no data was deleted!')
    }

    try {
        await newGenre.softRemove()

        return res.send(newGenre)
    } catch (error) {
        return res.send('error when trying to delete genre')
    }
}

const genreController = {
    fetch,
    create,
    update,
    delete: deleteGenre,
}

export default genreController
