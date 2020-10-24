/* eslint-disable no-console */
import { PrismaClient, UserCreateArgs } from "@prisma/client";
import Faker from "faker";
import Ora from "ora";
import hashPassword from "../utils/hashPassword";

const NUMBER_USERS = 10;

export default async function seedDatabase(): Promise<void> {
  const prisma = new PrismaClient();

  const usersCreateMessage = Ora("Creating users").start();

  const mockUsers: UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map(() => {
      const firstName = Faker.name.firstName();
      const lastName = Faker.name.lastName();
      const email = Faker.internet.email(firstName, lastName);
      const password = Faker.internet.password();

      return {
        data: {
          email,
          hashedPassword: hashPassword(password),
          name: `${firstName} ${lastName}`,
        },
      };
    });
  try {
    await Promise.all(mockUsers.map(prisma.user.create));
  } catch (err) {
    usersCreateMessage.fail(`Creating users failed\n\n${err.message}`);
    process.exit(1);
  }
  usersCreateMessage.succeed();
  process.exit(0);
}

seedDatabase();
