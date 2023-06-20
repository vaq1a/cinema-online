import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'
import { ExtractJwt, Strategy } from 'passport-jwt'
import * as process from 'process'

import { UserModel } from '../../user/user.model'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(@InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: true,
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate({ _id }: Pick<UserModel, '_id'>) {
        return await this.UserModel.findById(_id).exec()
    }
}
