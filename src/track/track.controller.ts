import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { validate as isUUID } from 'uuid';

@Controller('track')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  async getAllTracks() {
    return await this.trackService.getAllTracks();
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid trackId format', HttpStatus.BAD_REQUEST);
    }

    return await this.trackService.getTrackById(id);
  }

  @Post()
  @HttpCode(201)
  async createTrack(@Body() createTrackDto: CreateTrackDto) {
    return await this.trackService.createTrack(createTrackDto);
  }

  @Put(':id')
  @HttpCode(200)
  async updateTrack(@Param('id') id: string, @Body() updateTrackDto: CreateTrackDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid trackId format', HttpStatus.BAD_REQUEST);
    }

    return await this.trackService.updateTrack(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteTrack(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid trackId format', HttpStatus.BAD_REQUEST);
    }

    return await this.trackService.deleteTrack(id);
  }
}
