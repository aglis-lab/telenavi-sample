import { FindManyOptions, Like } from "typeorm";
import { Movie } from "../entity/movie";
import { Response, Request } from "express";
import { elasticClient } from "../elasticsearch";
import { Genre } from "../entity/genre";

async function get(req: Request, res: Response) {
    const id = req.params.id
    const data = await Movie.findOne({
        where: {
            id: Number(id),
        }
    })
    if (!data) {
        return res.status(400).send('No movie was found!')
    }

    return res.send(data)
}

async function fetch(req: Request, res: Response) {
    const limit = Number(req.query.limit ?? 10)
    const page = Number(req.query.page ?? 1)
    const offset = (page - 1) * limit;

    let genre = req.query.genre as string | undefined
    let search = req.query.search as string | undefined
    let orderBy = req.query.order_by as string | undefined
    let order = req.query.order
    if (order !== 'asc' && order !== 'desc') {
        order = 'asc'
    }

    if (!orderBy) {
        orderBy = 'createdAt'
    }

    if (search === '') {
        search = undefined
    }

    if (search) {
        search = `%${search}%`
    }

    if (genre === '') {
        genre = undefined
    }

    if (genre) {
        genre = `%${genre}%`
    }

    const options: FindManyOptions = {
        skip: offset ?? 0,
        take: limit,
        order: {
            [orderBy]: order
        },
        where: {
            title: search ? Like(search) : undefined,
            genres: genre ? Like(genre) : undefined
        }
    }

    const count = await Movie.count(options)
    const data = await Movie.find(options)
    const genresSource = (await Genre.find()).map((item) => item.key)
    for (const item of data) {
        item.genres = (item.genres as string).split(',').filter((item) => genresSource.includes(item)).join(',')
    }

    return res.send({
        result: data,
        pagination: {
            limit, page, count,
        }
    })
}

async function create(req: Request, res: Response) {
    if (!req.file) {
        return res.status(400).send('please input the file')
    }

    const body = req.body;
    const newMovie = new Movie()

    newMovie.title = body.title
    newMovie.director = body.director
    newMovie.summary = body.summary
    newMovie.genres = body.genres
    newMovie.image_url = req.file.path

    try {
        const createdMovie = await newMovie.save()

        await elasticClient.create({
            index: 'movies',
            id: String(createdMovie.id),
            body: {
                title: body.title,
                summary: body.summary,
                director: body.director,
                image_url: req.file.path,
                genres: (body.genres as string).replaceAll(',', ' ')
            }
        })

        return res.send(newMovie)
    } catch (error: any) {
        console.log(error)
        return res.send('Movie not created')
    }
}

async function update(req: Request, res: Response) {
    const body = req.body;
    const newMovie = await Movie.findOne({
        where: {
            id: Number(req.params.id)
        }
    })

    if (!newMovie) {
        return res.send('no data was updated!')
    }

    if (req.file) {
        newMovie.image_url = req.file.path
    }

    newMovie.title = body.title
    newMovie.director = body.director
    newMovie.summary = body.summary
    newMovie.genres = body.genres

    try {
        await newMovie.save()

        await elasticClient.update({
            index: 'movies',
            id: String(newMovie.id),
            body: {
                doc: {
                    title: newMovie.title,
                    summary: newMovie.summary,
                    director: newMovie.director,
                    image_url: newMovie.image_url,
                    genres: (body.genres as string).replaceAll(',', ' ')
                }
            }
        })

        return res.send(newMovie)
    } catch (error) {
        console.log(error)
        return res.send('Movie not updated')
    }
}

async function deleteMovie(req: Request, res: Response) {
    const newMovie = await Movie.findOne({
        where: {
            id: Number(req.params.id)
        }
    })

    if (!newMovie) {
        return res.status(400).send('no data was deleted!')
    }

    try {
        await newMovie.softRemove()

        await elasticClient.delete({
            index: 'movies',
            id: String(newMovie.id)
        })

        return res.send(newMovie)
    } catch (error) {
        return res.send('error when trying to delete Movie')
    }
}

async function advancedSearch(req: Request, res: Response) {
    const limit = Number(req.query.limit ?? 10)
    const page = Number(req.query.page ?? 1)
    const offset = (page - 1) * limit;

    let genre = req.query.genre as string | undefined
    let search = req.query.search as string | undefined
    let orderBy = req.query.order_by as string | undefined
    let order = req.query.order
    if (order !== 'asc' && order !== 'desc') {
        order = 'asc'
    }

    if (!orderBy) {
        orderBy = 'createdAt'
    }

    if (search === '') {
        search = undefined
    }

    if (search) {
        search = `%${search}%`
    }

    if (genre === '') {
        genre = undefined
    }

    if (genre) {
        genre = genre.replaceAll(',', ' ')
    }

    const filters = []
    if (search) {
        filters.push({
            multi_match: {
                query: search,
                fields: ['title', 'summary', 'director']
            },
        })
    }

    if (genre) {
        filters.push({
            match: {
                genre: genre,
            }
        })
    }
    const option = {
        bool: {
            should: filters.length > 0 ? filters : undefined
        }
    }

    try {
        const data = await elasticClient.search({
            index: 'movies',
            body: {
                query: option
            },
            size: limit,
            from: offset,
        })

        const count = data.body.hits.total.value
        const result = (data.body.hits.hits as any[]).map((item) => {
            return {
                ...item._source,
                id: item._id,
                genres: item._source.genres.replaceAll(' ', ',')
            }
        })

        return res.send({
            result: result,
            pagination: {
                limit, page, count,
            }
        })
    } catch (error) {
        console.log(error)
        return res.send({
            result: [],
            pagination: {
                limit, page, count: 0
            }
        })
    }
}

const controller = {
    fetch,
    create,
    update,
    delete: deleteMovie,
    advancedSearch,
    get
}

export default controller
