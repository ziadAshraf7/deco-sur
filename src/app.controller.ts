import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';

@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Get('image')
  getImage(@Query('path') imagePath: string, @Res() res: Response) {
    if (!imagePath) {
      throw new BadRequestException('Image path is required');
    }

    const uploadsDir = path.resolve(process.cwd(), 'uploads');
    const requestedFile = path.resolve(uploadsDir, imagePath);
    const relativePath = path.relative(uploadsDir, requestedFile);

    if (
      relativePath.startsWith('..') ||
      path.isAbsolute(relativePath) ||
      !relativePath ||
      relativePath.includes('\0')
    ) {
      throw new BadRequestException('Invalid image path');
    }

    if (!fs.existsSync(requestedFile) || !fs.statSync(requestedFile).isFile()) {
      throw new NotFoundException('Image not found');
    }

    res.type(path.extname(requestedFile));
    return res.sendFile(requestedFile);
  }
}
