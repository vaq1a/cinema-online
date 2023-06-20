import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'
import { TypegooseModule } from 'nestjs-typegoose'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { getMongoDbConfig } from './config/mongo.config'
import { GenreModule } from './genre/genre.module'
import { UserModule } from './user/user.module'
import { FileModule } from './file/file.module';

dotenv.config()
const ENV = process.env.NODE_ENV

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: `.env.${ENV}`,
        }),
        TypegooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getMongoDbConfig,
        }),
        AuthModule,
        UserModule,
        GenreModule,
        FileModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
