import { Injectable, OnModuleInit, Logger, INestApplication } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    await this.$connect();
    await this.cleanDatabase();
  }

  async cleanDatabase() {
    try {
      await this.user.deleteMany();
      console.log('Database cleaned');
    } catch (error) {
      console.error('Error cleaning database:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
