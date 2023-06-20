import { Module } from '@nestjs/common'
import { ServeStaticModule } from '@nestjs/serve-static'
import { path } from 'app-root-path'
import { TypegooseModule } from 'nestjs-typegoose'

import { UserModel } from '../user/user.model'
import { FileController } from './file.controller'
import { FileService } from './file.service'

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
        ServeStaticModule.forRoot({
            rootPath: `${path}/uploads`,
            serveRoot: '/uploads',
        }),
    ],
    providers: [FileService],
    controllers: [FileController],
})
export class FileModule {}
