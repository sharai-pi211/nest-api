import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';

@Controller('favs')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async getAllFavorites() {
    return await this.favoritesService.getAllFavorites();
  }

  @Post('track/:id')
  @HttpCode(201)
  async addTrackToFavorites(@Param('id') id: string) {
    return await this.favoritesService.addTrackToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  async removeTrackFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeTrackFromFavorites(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  async addAlbumToFavorites(@Param('id') id: string) {
    return await this.favoritesService.addAlbumToFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  async removeAlbumFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeAlbumFromFavorites(id);
  }

  @Post('artist/:id')
  @HttpCode(201)
  async addArtistToFavorites(@Param('id') id: string) {
    return await this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  async removeArtistFromFavorites(@Param('id') id: string) {
    return await this.favoritesService.removeArtistFromFavorites(id);
  }
}
