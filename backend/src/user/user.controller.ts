import { Body, Controller, Delete, Get, HttpCode, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common'

import { IdValidationPipe } from '../../pipes/id.validation.pipe'
import { Auth } from '../auth/decorators/auth.decorator'
import { User } from './decorators/user.decorator'
import { UpdateUserDto } from './dto/updateUser.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('profile')
    @Auth()
    async getProfile(@User('_id') _id: string) {
        return await this.userService.byId(_id)
    }

    @UsePipes(new ValidationPipe())
    @Put('profile')
    @HttpCode(200)
    @Auth()
    async updateProfile(
    @User('_id') _id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return await this.userService.updateProfile(_id, dto)
    }

    @Get('count')
    @Auth('admin')
    async getCountUsers() {
        return await this.userService.getCount()
    }

    @Get()
    @Auth()
    async getUsers(
    @Query('searchTerm') searchTerm?: string,
    ) {
        return await this.userService.getAll(searchTerm)
    }

    @Get(':id')
    @Auth('admin')
    async getUser(
    @Param('id', IdValidationPipe) id: string,
    ) {
        return await this.userService.byId(id)
    }

    @UsePipes(new ValidationPipe())
    @Put(':id')
    @HttpCode(200)
    @Auth('admin')
    async updateUser(
    @Param('id', IdValidationPipe) id: string,
        @Body() dto: UpdateUserDto,
    ) {
        return await this.userService.updateProfile(id, dto)
    }

    @Delete(':id')
    @HttpCode(200)
    @Auth('admin')
    async deleteUser(
    @Param('id', IdValidationPipe) id: string,
    ) {
        return await this.userService.delete(id)
    }
}
