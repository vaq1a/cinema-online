import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'

import { CreateGenreDto } from './dto/createGenre.dto'
import { GenreModel } from './genre.model'

@Injectable()
export class GenreService {
    private readonly logger = new Logger('GenreService')

    constructor(
        @InjectModel(GenreModel) private readonly GenreModel: ModelType<GenreModel>,
    ) {}

    async bySlug(slug: string) {
        this.logger.log(`slug ${slug}`)
        return await this.GenreModel.findOne({ slug }).exec()
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

        const collections = genres

        // TODO: write
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
            name: '',
            slug: 'test',
            description: '',
            icon: '',
        }

        const genre = await this.GenreModel.create(defaultValue)

        return genre._id
    }

    async delete(id: string) {
        return await this.GenreModel.findByIdAndDelete(id).exec()
    }
}
