import { applyDecorators, UseGuards } from '@nestjs/common'

import { TypeRole } from '../auth.interface'
import { OnlyAdminGuard } from '../guards/admin.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'

export const Auth = (role: TypeRole = 'user') => {
    console.log('role', role)
    return applyDecorators(
        role === 'admin'
            ? UseGuards(JwtAuthGuard, OnlyAdminGuard)
            : UseGuards(JwtAuthGuard),
    )
}
