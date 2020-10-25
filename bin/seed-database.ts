/* eslint-disable no-console */
import { PrismaClient, UserCreateArgs } from "@prisma/client";
import Faker from "faker";
import Ora from "ora";
import hashPassword from "../utils/hashPassword";

const NUMBER_USERS = 10;

export default async function seedDatabase(): Promise<void> {
  const prisma = new PrismaClient();

  const usersCreateMessage = Ora(`Creating ${NUMBER_USERS} players`).start();

  const mockUsers: UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map((_value: null, index: number) => {
      return {
        data: {
          email: `player${index}@ogsc.dev`,
          hashedPassword: hashPassword("password"),
          name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
          player: {
            create: {
              bio: Faker.lorem.sentences(2),
              academicEngagementScore: Faker.random.number(10),
              academicEngagementComments: Faker.lorem.lines(2),
              advisingScore: Faker.random.number(10),
              advisingComments: Faker.lorem.lines(2),
              athleticScore: Faker.random.number(10),
              athleticComments: Faker.lorem.lines(2),
              gpa: Faker.random.float({
                max: 4,
                precision: 0.01,
              }),
              disciplinaryActions: Faker.lorem.lines(2),
              schoolAbsences: Faker.lorem.lines(2),
              advisingAbsences: Faker.lorem.lines(2),
              athleticAbsences: Faker.lorem.lines(2),
              bmi: Faker.random.float({ min: 18, max: 30, precision: 0.1 }),
              healthAndWellness: Faker.lorem.lines(2),
              beepTest: Faker.lorem.sentence(),
              mileTime: `${Faker.random.number({
                min: 4,
                max: 8,
              })}:${Faker.random.number({ max: 60 })}`,
              highlights: Faker.internet.url(),
            },
          },
        },
      };
    });
  try {
    await Promise.all(mockUsers.map(prisma.user.create));
  } catch (err) {
    usersCreateMessage.fail(`Creating users failed\n\n${err.message}`);
    process.exit(1);
  }
  usersCreateMessage.text = "Created 10 players.";
  usersCreateMessage.succeed();
  process.exit(0);
}

seedDatabase();
