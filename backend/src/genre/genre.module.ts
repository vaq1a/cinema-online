import { Module } from '@nestjs/common'
import { TypegooseModule } from 'nestjs-typegoose'

import { UserModel } from '../user/user.model'
import { GenreController } from './genre.controller'
import { GenreModel } from './genre.model'
import { GenreService } from './genre.service'
import {MovieModule} from "../movie/movie.module";

@Module({
    imports: [
        TypegooseModule.forFeature([
            {
                typegooseClass: UserModel,
                schemaOptions: {
                    collection: 'User',
                },
            },
        ]),
        TypegooseModule.forFeature([
            {
                typegooseClass: GenreModel,
                schemaOptions: {
                    collection: 'Genre',
                },
            },
        ]),
        MovieModule,
    ],
    providers: [GenreService],
    controllers: [GenreController],
})
export class GenreModule {}
