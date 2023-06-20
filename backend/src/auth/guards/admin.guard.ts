import { CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { InjectModel } from 'nestjs-typegoose'

import { UserModel } from '../../user/user.model'

export class OnlyAdminGuard implements CanActivate {
    constructor(private readonly reflector: Reflector, @InjectModel(UserModel) private readonly UserModel: ModelType<UserModel>) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<{user: UserModel}>()
        const currentUserId = request.user._id

        const user: any = await this.UserModel.findById(currentUserId)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (!user.isAdmin) {
            throw new ForbiddenException('You have no rights')
        }

        return user.isAdmin
    }
}
