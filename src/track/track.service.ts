import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrackDto } from './dto/create-track.dto';

@Injectable()
export class TrackService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllTracks() {
    return this.prisma.track.findMany({
      include: {
        album: true,
        artist: true,
      },
    });
  }

  async getTrackById(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
      include: {
        album: true,
        artist: true,
      },
    });

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    return track;
  }

  async createTrack(createTrackDto: CreateTrackDto) {
    const { name, duration, albumId, artistId } = createTrackDto;

    const newTrack = await this.prisma.track.create({
      data: {
        title: name,
        duration,
        albumId: albumId || null,
        artistId: artistId || null,
      },
    });

    return newTrack;
  }

  async updateTrack(id: string, updateTrackDto: CreateTrackDto) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    const updatedTrack = await this.prisma.track.update({
      where: { id },
      data: {
        title: updateTrackDto.name,
        duration: updateTrackDto.duration as number,
        albumId: updateTrackDto.albumId || null,
        artistId: updateTrackDto.artistId || null,
      },
    });    

    return updatedTrack;
  }

  async deleteTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) {
      throw new HttpException('Track not found', HttpStatus.NOT_FOUND);
    }

    await this.prisma.track.delete({ where: { id } });
    return true;
  }
}
