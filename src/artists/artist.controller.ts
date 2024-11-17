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
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { validate as isUUID } from 'uuid';

@Controller('artist')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  async getAllArtists() {
    return await this.artistService.getAllArtists();
  }

  @Get(':id')
  async getArtistById(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artistId format', HttpStatus.BAD_REQUEST);
    }

    return await this.artistService.getArtistById(id);
  }

  @Post()
  @HttpCode(201)
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    return await this.artistService.createArtist(createArtistDto);
  }

  @Put(':id')
  @HttpCode(200)
  async updateArtist(@Param('id') id: string, @Body() updateArtistDto: CreateArtistDto) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artistId format', HttpStatus.BAD_REQUEST);
    }

    return await this.artistService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteArtist(@Param('id') id: string) {
    if (!isUUID(id)) {
      throw new HttpException('Invalid artistId format', HttpStatus.BAD_REQUEST);
    }

    return await this.artistService.deleteArtist(id);
  }
}
