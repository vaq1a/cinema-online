import { Module } from '@nestjs/common';
import { ActorService } from './actor.service';
import { ActorController } from './actor.controller';
import {TypegooseModule} from "nestjs-typegoose";
import {ActorModel} from "./actor.model";
import {UserModel} from "../user/user.model";

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
        typegooseClass: ActorModel,
        schemaOptions: {
          collection: 'Actor',
        },
      },
    ]),
  ],
  providers: [ActorService],
  controllers: [ActorController]
})
export class ActorModule {}
