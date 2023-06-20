import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { genSalt, hash } from 'bcryptjs'
import { InjectModel } from 'nestjs-typegoose'

import { UpdateUserDto } from './dto/updateUser.dto'
import { UserModel } from './user.model'

@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>,
    ) {}

    async byId(_id: string) {
        const user = await this.UserModel.findById(_id)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        return user
    }

    async updateProfile(_id: string, dto: UpdateUserDto) {
        const user = await this.byId(_id)
        const isSameUser = await this.UserModel.findOne({ email: dto.email })

        if (isSameUser && String(_id) !== String(isSameUser._id)) {
            throw new NotFoundException('Email busy')
        }

        if (dto.password) {
            const salt = await genSalt(10)
            user.password = await hash(dto.password, salt)
        }

        user.email = dto.email

        if (dto.isAdmin ?? dto.isAdmin === false) {
            user.isAdmin = dto.isAdmin
        }

        return await user.save()
    }

    async getCount() {
        return await this.UserModel.count().exec()
    }

    async getAll(searchTerm?: string) {
        let options = {}

        if (searchTerm) {
            options = {
                $or: [
                    {
                        email: new RegExp(searchTerm, 'i'),
                    },
                ],
            }
        }

        return await this.UserModel.find(options).select('-password -updatedAt -__v').sort({
            createAt: 'desc',
        }).exec()
    }

    async delete(id: string) {
        return await this.UserModel.findByIdAndDelete(id).exec()
    }
}
