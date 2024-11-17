import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFavorites() {
    const favorites = await this.prisma.favorites.findUnique({
      where: { userId: 'default_user_id' },
      include: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });

    if (!favorites) {
      throw new HttpException('Favorites not found', HttpStatus.NOT_FOUND);
    }

    return {
      artists: favorites.artists,
      albums: favorites.albums,
      tracks: favorites.tracks,
    };
  }

  async addTrackToFavorites(trackId: string) {
    const track = await this.prisma.track.findUnique({ where: { id: trackId } });
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    await this.prisma.favorites.update({
      where: { userId: 'default_user_id' },
      data: {
        tracks: { connect: { id: trackId } },
      },
    });

    return { message: 'Track added to favorites' };
  }

  async removeTrackFromFavorites(trackId: string) {
    const track = await this.prisma.track.findUnique({ where: { id: trackId } });
    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.favorites.update({
      where: { userId: 'default_user_id' }, 
      data: {
        tracks: { disconnect: { id: trackId } },
      },
    });
  }

  async addAlbumToFavorites(albumId: string) {
    const album = await this.prisma.album.findUnique({ where: { id: albumId } });
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    await this.prisma.favorites.update({
      where: { userId: 'default_user_id' },
      data: {
        albums: { connect: { id: albumId } },
      },
    });

    return { message: 'Album added to favorites' };
  }

  async removeAlbumFromFavorites(albumId: string) {
    const album = await this.prisma.album.findUnique({ where: { id: albumId } });
    if (!album) {
      throw new HttpException('Album not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.favorites.update({
      where: { userId: 'default_user_id' }, 
      data: {
        albums: { disconnect: { id: albumId } },
      },
    });
  }

  async addArtistToFavorites(artistId: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id: artistId } });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.UNPROCESSABLE_ENTITY);
    }

    await this.prisma.favorites.update({
      where: { userId: 'default_user_id' }, // Используем userId
      data: {
        artists: { connect: { id: artistId } },
      },
    });

    return { message: 'Artist added to favorites' };
  }

  async removeArtistFromFavorites(artistId: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id: artistId } });
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.favorites.update({
      where: { userId: 'default_user_id' }, 
      data: {
        artists: { disconnect: { id: artistId } },
      },
    });
  }
}
