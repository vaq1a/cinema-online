import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'

import { GenreIdsDto } from './dto/genreIds.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieModel } from './movie.model'

@Injectable()
export class MovieService {
    private readonly logger = new Logger('MovieService')

    constructor(
        @InjectModel(MovieModel) private readonly MovieModel: ModelType<MovieModel>,
    ) {}

    async getAll(searchTerm?: string) {
        let options = {}

        if (searchTerm) {
            options = {
                $or: [
                    {
                        tite: new RegExp(searchTerm, 'i'),
                    },
                ],
            }
        }

        return await this.MovieModel.find(options)
            .select('-updateAt -__v')
            .sort({
                createAt: 'desc',
            }).populate('actors genres')
            .exec()
    }

    async bySlug(slug: string) {
        const doc = await this.MovieModel.findOne({ slug }).populate('actors genres').exec()

        if (!doc) {
            throw new NotFoundException('Movie not found')
        }

        return doc
    }

    async byActor(actorId: Types.ObjectId) {
        const docs = await this.MovieModel.find({ actors: actorId }).exec()

        if (!docs) {
            throw new NotFoundException('Movies not found')
        }

        return docs
    }

    async byGenres({ genreIds }) {
        this.logger.log(`genreIds ${genreIds}`)
        const doc = await this.MovieModel.find({ genres: { $in: genreIds } }).exec()

        if (!doc) {
            throw new NotFoundException('Movies not found')
        }

        return doc
    }

    async getMostPopular() {
        return await this.MovieModel.find({ countOpened: { $gt: 0 } }).sort({ countOpened: -1 }).populate('genres').exec()
    }

    async updateCountOpened(slug: string) {
        const updateDoc = await this.MovieModel.findOneAndUpdate({ slug }, {
            $inc: { countOpened: 1 },
        }, {
            new: true,
        },
        ).exec()

        if (!updateDoc) {
            throw new NotFoundException('Movie not found')
        }

        return updateDoc
    }

    async updateRating(id: Types.ObjectId, newRating: number) {
        return await this.MovieModel.findByIdAndUpdate(id, {
            rating: newRating,
        }, {
            new: true,
        }).exec()
    }

    // Admin place
    async byId(_id: string) {
        const doc = await this.MovieModel.findById(_id)

        if (!doc) {
            throw new NotFoundException('Movie not found')
        }

        return doc
    }

    async create() {
        const defaultValue: UpdateMovieDto = {
            bigPoster: '',
            actors: [],
            genres: [],
            poster: '',
            title: '',
            videoUrl: '',
            slug: '',
        }

        const movie = await this.MovieModel.create(defaultValue)

        return movie._id
    }

    async update(_id: string, dto: UpdateMovieDto) {
        // Telegram notification

        return await this.MovieModel.findByIdAndUpdate(_id, dto, {
            new: true,
        }).exec()
    }

    async delete(id: string) {
        return await this.MovieModel.findByIdAndDelete(id).exec()
    }
}
