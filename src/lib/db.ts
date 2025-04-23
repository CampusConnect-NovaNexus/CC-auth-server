import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

export class Database {
  private static prisma: PrismaClient | null = null;

  public static getClient(): PrismaClient {
    if (!Database.prisma) {
      Database.prisma = new PrismaClient({
        datasourceUrl: process.env.DATABASE_URL,
      }).$extends(withAccelerate()) as unknown as PrismaClient;
    }
    return Database.prisma;
  }

  public static async disconnect(): Promise<void> {
    if (Database.prisma) {
      await Database.prisma.$disconnect();
      Database.prisma = null;
    }
  }
}
