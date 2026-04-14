import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL_UNPOOLED!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@1234", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@dashboard.ro" },
    update: {},
    create: {
      email: "admin@dashboard.ro",
      name: "Administrator",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ User admin creat:", admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
