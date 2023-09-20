import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'

import { MovieService } from '../movie/movie.service'
import { CreateGenreDto } from './dto/createGenre.dto'
import { ICollection } from './genre.interface'
import { GenreModel } from './genre.model'

@Injectable()
export class GenreService {
    private readonly logger = new Logger('GenreService')

    constructor(
        @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
        private readonly movieService: MovieService,
    ) {}

    async bySlug(slug: string) {
        this.logger.log(`slug ${slug}`)
        const doc = await this.GenreModel.findOne({ slug }).exec()

        if (!doc) {
            throw new NotFoundException('Genre not found')
        }

        return doc
    }

    async getAll(searchTerm?: string) {
        let options = {}

        if (searchTerm) {
            options = {
                $or: [
                    {
                        name: new RegExp(searchTerm, 'i'),
                    },
                    {
                        slug: new RegExp(searchTerm, 'i'),
                    },
                    {
                        description: new RegExp(searchTerm, 'i'),
                    },
                ],
            }
        }

        return await this.GenreModel.find(options)
            .select('-updateAt -__v')
            .sort({
                createAt: 'desc',
            })
            .exec()
    }

    async getCollections() {
        const genres = await this.getAll()

        const collections = await Promise.all(genres.map(async genre => {
            const movieByGenre = await this.movieService.byGenres({ genreIds: genre._id })

            const result: ICollection = {
                _id: String(genre._id),
                image: movieByGenre[0].bigPoster,
                slug: genre.slug,
                title: genre.name,
            }

            return result
        }))

        return collections
    }

    // Admin place
    async byId(_id: string) {
        const genre = await this.GenreModel.findById(_id)

        if (!genre) {
            throw new NotFoundException('Genre not found')
        }

        return genre
    }

    async update(_id: string, dto: CreateGenreDto) {
        return await this.GenreModel.findByIdAndUpdate(_id, dto, {
            new: true,
        }).exec()
    }

    async create() {
        const defaultValue: CreateGenreDto = {
            name: 'Horror',
            slug: 'horror',
            description: 'Test description for horror',
            icon: '',
        }

        const genre = await this.GenreModel.create(defaultValue)

        return genre._id
    }

    async delete(id: string) {
        return await this.GenreModel.findByIdAndDelete(id).exec()
    }
}
