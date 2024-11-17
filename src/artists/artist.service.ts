import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';

@Injectable()
export class ArtistService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllArtists() {
    return this.prisma.artist.findMany({
      include: {
        albums: true,
        tracks: true,
      },
    });
  }

  async getArtistById(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        albums: true,
        tracks: true,
      },
    });

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    return artist;
  }

  async createArtist(createArtistDto: CreateArtistDto) {
    const newArtist = await this.prisma.artist.create({
      data: {
        name: createArtistDto.name,
        grammy: createArtistDto.grammy,
      },
    });
    return newArtist;
  }

  async updateArtist(id: string, updateArtistDto: CreateArtistDto) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    const updatedArtist = await this.prisma.artist.update({
      where: { id },
      data: {
        name: updateArtistDto.name,
        grammy: updateArtistDto.grammy,
      },
    });

    return updatedArtist;
  }

  async deleteArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });

    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.track.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.album.updateMany({
      where: { artistId: id },
      data: { artistId: null },
    });

    await this.prisma.artist.delete({ where: { id } });
    return true;
  }
}
