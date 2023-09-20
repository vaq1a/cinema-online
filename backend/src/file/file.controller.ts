import {
    Controller,
    HttpCode, Logger,
    Post,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

import { Auth } from '../auth/decorators/auth.decorator'
import { FileService } from './file.service'

@Controller('files')
export class FileController {
    private readonly logger = new Logger('FileService')

    constructor(private readonly fileService: FileService) {
    }

    @Post()
    @HttpCode(200)
    @Auth('admin')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Query('folder') folder?: string) {
        this.logger.log('start uploadFile')
        return await this.fileService.saveFiles([file], folder)
    }
}
