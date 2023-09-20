import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'

import { ActorModel } from './actor.model'
import { ActorDto } from './dto/actor.dto'

@Injectable()
export class ActorService {
    constructor(
        @InjectModel(ActorModel) private readonly ActorModel: ModelType<ActorModel>,
    ) {}

    async bySlug(slug: string) {
        const doc = await this.ActorModel.findOne({ slug }).exec()

        if (!doc) {
            throw new NotFoundException('Actor not found')
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
                ],
            }
        }

        // Agreggation
        return await this.ActorModel.aggregate().match(options).lookup({
            from: 'Movie',
            localField: '_id',
            foreignField: 'actors',
            as: 'movies',
        }).addFields({
            countMovies: {
                $size: '$movies',
            },
        }).project({
            __v: 0,
            updatedAt: 0,
            movies: 0,
        }).sort({
            createAt: -1,
        }).exec()
    }

    // Admin place
    async byId(_id: string) {
        const actor = await this.ActorModel.findById(_id)

        if (!actor) {
            throw new NotFoundException('Actor not found')
        }

        return actor
    }

    async update(_id: string, dto: ActorDto) {
        return await this.ActorModel.findByIdAndUpdate(_id, dto, {
            new: true,
        }).exec()
    }

    async create() {
        const defaultValue: ActorDto = {
            name: 'John Wick',
            slug: 'john-wick',
            photo: '/uploads/movies/john-wick-small.jpg',
        }

        const genre = await this.ActorModel.create(defaultValue)

        return genre._id
    }

    async delete(id: string) {
        return await this.ActorModel.findByIdAndDelete(id).exec()
    }
}
