import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'

import { IdValidationPipe } from '../../pipes/id.validation.pipe'
import { Auth } from '../auth/decorators/auth.decorator'
import { CreateGenreDto } from './dto/createGenre.dto'
import { GenreService } from './genre.service'

@Controller('genres')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}

    @Get('by-slug/:slug')
    async bySlug(@Param('slug') slug: string) {
        return await this.genreService.bySlug(slug)
    }

    @Get('/collections')
    async getCollections() {
        return await this.genreService.getCollections()
    }

    @Get()
    async getAll(
    @Query('searchTerm') searchTerm?: string,
    ) {
        return await this.genreService.getAll(searchTerm)
    }

    @Get(':id')
    @Auth('admin')
    async get(
    @Param('id', IdValidationPipe) id: string,
    ) {
        return await this.genreService.byId(id)
    }

    @UsePipes(new ValidationPipe())
    @Post()
    @HttpCode(200)
    @Auth('admin')
    async create(
    ) {
        return await this.genreService.create()
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async update(
    @Param('id', IdValidationPipe) id: string,
        @Body() dto: CreateGenreDto,
    ) {
        return await this.genreService.update(id, dto)
    }

    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async delete(
    @Param('id', IdValidationPipe) id: string,
    ) {
        return await this.genreService.delete(id)
    }
}
