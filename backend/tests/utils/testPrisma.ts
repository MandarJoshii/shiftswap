import { PrismaClient } from "../../src/generated/prisma";

const testPrisma = new PrismaClient({
  datasources: {
    db: { url: process.env.TEST_DATABASE_URL },
  },
});

export default testPrisma;