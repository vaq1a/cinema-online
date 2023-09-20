import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode, Logger,
    Param,
    Post,
    Put,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common'
import { Types } from 'mongoose'

import { IdValidationPipe } from '../../pipes/id.validation.pipe'
import { Auth } from '../auth/decorators/auth.decorator'
import { GenreIdsDto } from './dto/genreIds.dto'
import { UpdateMovieDto } from './dto/update-movie.dto'
import { MovieService } from './movie.service'

@Controller('movies')
export class MovieController {
    private readonly logger = new Logger('MovieController')

    constructor(private readonly movieService: MovieService) {}

    @Get('by-slug/:slug')
    async bySlug(@Param('slug') slug: string) {
        return await this.movieService.bySlug(slug)
    }

    @Get('by-actor/:actorId')
    async byActor(@Param('actorId', IdValidationPipe) actorId: Types.ObjectId) {
        return await this.movieService.byActor(actorId)
    }

    @UsePipes(new ValidationPipe())
    @Post('by-genres')
    @HttpCode(200)
    async byGenres(@Body() dto: GenreIdsDto) {
        this.logger.log(`genreIds ${dto}`)
        return await this.movieService.byGenres(dto)
    }

    @Get()
    async getAll(
    @Query('searchTerm') searchTerm?: string,
    ) {
        return await this.movieService.getAll(searchTerm)
    }

    @Get('most-popular')
    async getMostPopular() {
        return await this.movieService.getMostPopular()
    }

    @Put('update-count-opened')
    @HttpCode(200)
    async updateCountOpened(
    @Body('slug') slug: string,
    ) {
        return await this.movieService.updateCountOpened(slug)
    }

    // Admin place
    @Get(':id')
    @Auth('admin')
    async get(
    @Param('id', IdValidationPipe) id: string,
    ) {
        return await this.movieService.byId(id)
    }

    @UsePipes(new ValidationPipe())
    @Post()
    @HttpCode(200)
    @Auth('admin')
    async create(
    ) {
        return await this.movieService.create()
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async update(
    @Param('id', IdValidationPipe) id: string,
        @Body() dto: UpdateMovieDto,
    ) {
        return await this.movieService.update(id, dto)
    }

    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async delete(
    @Param('id', IdValidationPipe) id: string,
    ) {
        return await this.movieService.delete(id)
    }
}
