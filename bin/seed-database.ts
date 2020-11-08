/* eslint-disable no-console */
import { PrismaClient, User, UserCreateArgs } from "@prisma/client";
import Faker from "faker";
import Ora from "ora";
import hashPassword from "../utils/hashPassword";

const NUMBER_USERS = 10;

export default async function seedDatabase(): Promise<void> {
  const prisma = new PrismaClient();
  const clearAllMessage = Ora("Cleaning up previous seeded information");
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          endsWith: "@ogsc.dev",
        },
      },
    });
    await prisma.player.deleteMany({
      where: {
        user_id: {
          in: users.map((user: User) => user.id),
        },
      },
    });
    await prisma.user.deleteMany({
      where: {
        email: {
          endsWith: "@ogsc.dev",
        },
      },
    });
    clearAllMessage.text = "Cleaned up previous seeded information";
    clearAllMessage.succeed();
  } catch (err) {
    clearAllMessage.fail(
      `Could not clean up previous seeded information\n\n${err.message}`
    );
    process.exit(1);
  }

  const adminCreateMessage = Ora(`Creating admin user`).start();
  try {
    await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@ogsc.dev",
        hashedPassword: hashPassword("password"),
        isAdmin: true,
      },
    });
    adminCreateMessage.text = "Created the admin user.";
    adminCreateMessage.succeed();
  } catch (err) {
    adminCreateMessage.fail(`Creating the admin user failed\n\n${err.message}`);
  }

  const usersCreateMessage = Ora(`Creating ${NUMBER_USERS} players`).start();
  const mockPlayers: UserCreateArgs[] = Array(NUMBER_USERS)
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
    await Promise.all(mockPlayers.map(prisma.user.create));
    usersCreateMessage.text = "Created 10 players.";
    usersCreateMessage.succeed();
  } catch (err) {
    usersCreateMessage.fail(`Creating players failed\n\n${err.message}`);
  }

  const mentorsCreateMessage = Ora(`Creating ${NUMBER_USERS} mentors`).start();
  const mockMentors: UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map((_value: null, index: number) => {
      return {
        data: {
          email: `mentor${index}@ogsc.dev`,
          hashedPassword: hashPassword("password"),
          name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
          viewerPermissions: {
            create: {
              viewee: {
                connect: {
                  email: `player${index}@ogsc.dev`,
                },
              },
            },
          },
        },
      };
    });
  try {
    await Promise.all(mockMentors.map(prisma.user.create));
    mentorsCreateMessage.text = "Created 10 mentors.";
    mentorsCreateMessage.succeed();
  } catch (err) {
    mentorsCreateMessage.fail(`Creating mentors failed\n\n${err.message}`);
  }

  process.exit(0);
}

seedDatabase();
