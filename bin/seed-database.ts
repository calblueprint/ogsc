/* eslint-disable no-console */
import {
  Absence,
  AbsenceReason,
  AbsenceType,
  Prisma,
  PrismaClient,
  ProfileFieldKey,
  User,
  UserRoleType,
  UserStatus,
} from "@prisma/client";
import Faker from "faker";
import Ora from "ora";
import hashPassword from "../utils/hashPassword";

const NUMBER_USERS = 10;
const prisma = new PrismaClient();

function generateFieldsAcrossTimestamps(
  key: ProfileFieldKey,
  generateValue: () => unknown,
  count = 11
): Prisma.ProfileFieldCreateWithoutUserInput[] {
  return Array(count)
    .fill(null)
    .map(
      (_, index: number) =>
        new Date(
          `2020-${String(index + 1).padStart(2, "0")}-${String(
            Faker.random.number({
              min: 1,
              max: 28,
            })
          ).padStart(2, "0")}T12:00:00+00:00`
        )
    )
    .map(
      (date: Date) =>
        <Prisma.ProfileFieldCreateWithoutUserInput>{
          key,
          value: String(generateValue()),
          createdAt: date,
        }
    );
}

export default async function seedDatabase(): Promise<void> {
  const clearAllMessage = Ora(
    "Cleaning up previous seeded information"
  ).start();
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          endsWith: "@ogsc.dev",
        },
      },
    });
    await prisma.role.deleteMany({
      where: {
        userId: {
          in: users.map((user: User) => user.id),
        },
      },
    });
    await prisma.userInvite.deleteMany({
      where: {
        user_id: {
          in: users.map((user: User) => user.id),
        },
      },
    });
    await prisma.absence.deleteMany({
      where: {
        userId: {
          in: users.map((user: User) => user.id),
        },
      },
    });
    await prisma.profileField.deleteMany({
      where: {
        userId: {
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
        phoneNumber: Faker.phone.phoneNumber("(!##) !##-####"),
        hashedPassword: hashPassword("password"),
        status: UserStatus.Active,
        roles: {
          create: {
            type: UserRoleType.Admin,
          },
        },
      },
    });
    adminCreateMessage.text = "Created the admin user.";
    adminCreateMessage.succeed();
  } catch (err) {
    adminCreateMessage.fail(`Creating the admin user failed\n\n${err.message}`);
  }

  const usersCreateMessage = Ora(`Creating ${NUMBER_USERS} players`).start();
  const mockPlayers: Prisma.UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map(
      (_value: null, index: number): Prisma.UserCreateArgs => {
        return {
          data: {
            email: `player${index}@ogsc.dev`,
            hashedPassword: hashPassword("password"),
            name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
            phoneNumber: Faker.phone.phoneNumber("(!##) !##-####"),
            status: UserStatus.Active,
            roles: {
              create: {
                type: UserRoleType.Player,
              },
            },
            absences: {
              create: Object.values(AbsenceType).flatMap((type: AbsenceType) =>
                Array<Absence | null>(Faker.random.number(3))
                  .fill(null)
                  .map(
                    () =>
                      <Prisma.AbsenceCreateWithoutUsersInput>{
                        type,
                        date: Faker.date.recent(90),
                        reason: Faker.random.arrayElement(
                          Object.values(AbsenceReason)
                        ),
                        description: Faker.lorem.lines(1),
                      }
                  )
              ),
            },
            profileFields: {
              create: [
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.AcademicEngagementScore,
                  () =>
                    JSON.stringify({
                      comment: Faker.lorem.lines(1),
                      value: Faker.random.number(10),
                    })
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.AdvisingScore,
                  () =>
                    JSON.stringify({
                      comment: Faker.lorem.lines(1),
                      value: Faker.random.number(10),
                    })
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.AthleticScore,
                  () =>
                    JSON.stringify({
                      comment: Faker.lorem.lines(1),
                      value: Faker.random.number(10),
                    })
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.BioAboutMe,
                  () => Faker.lorem.lines(2),
                  1
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.BioFavoriteSubject,
                  () => Faker.lorem.lines(2),
                  1
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.BioHobbies,
                  () => Faker.lorem.lines(2),
                  1
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.BioMostDifficultSubject,
                  () => Faker.lorem.lines(1),
                  1
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.BioParents,
                  () => Faker.lorem.sentences(1),
                  1
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.BioSiblings,
                  () => Faker.lorem.sentences(1),
                  1
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.Height,
                  () => Faker.random.float({ min: 45, max: 75 }),
                  5
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.DisciplinaryActions,
                  () => Faker.lorem.lines(2),
                  1
                ),
                ...generateFieldsAcrossTimestamps(ProfileFieldKey.GPA, () =>
                  JSON.stringify({
                    comment: Faker.lorem.lines(1),
                    value: Faker.random.float({
                      min: 2,
                      max: 4,
                      precision: 0.01,
                    }),
                  })
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.HealthAndWellness,
                  () => Faker.lorem.lines(2),
                  1
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.Highlights,
                  () => Faker.internet.url(),
                  1
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.IntroVideo,
                  () => Faker.internet.url(),
                  1
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.MileTime,
                  () =>
                    `${Faker.random.number({
                      min: 4,
                      max: 8,
                    })}:${String(Faker.random.number({ max: 59 })).padStart(
                      2,
                      "0"
                    )}`
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.PacerTest,
                  () => Faker.random.number({ min: 40, max: 100 })
                ),
                ...generateFieldsAcrossTimestamps(
                  ProfileFieldKey.YearOfBirth,
                  () =>
                    Faker.random.number({
                      min: new Date().getFullYear() - 18,
                      max: new Date().getFullYear() - 8,
                    }),
                  1
                ),
                ...generateFieldsAcrossTimestamps(ProfileFieldKey.Pushups, () =>
                  Faker.random.number(100)
                ),
                ...generateFieldsAcrossTimestamps(ProfileFieldKey.Situps, () =>
                  Faker.random.number(100)
                ),
              ],
            },
          },
        };
      }
    );
  try {
    await Promise.all(mockPlayers.map(prisma.user.create));
    usersCreateMessage.text = "Created 10 players.";
    usersCreateMessage.succeed();
  } catch (err) {
    usersCreateMessage.fail(`Creating players failed\n\n${err.message}`);
  }

  const mentorsCreateMessage = Ora(`Creating ${NUMBER_USERS} mentors`).start();
  const mockMentors: Prisma.UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map(
      (_value: null, index: number): Prisma.UserCreateArgs => {
        return {
          data: {
            email: `mentor${index}@ogsc.dev`,
            hashedPassword: hashPassword("password"),
            name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
            phoneNumber: Faker.phone.phoneNumber("(!##) !##-####"),
            status: UserStatus.Active,
            roles: {
              create: {
                type: UserRoleType.Mentor,
                relatedPlayer: {
                  connect: {
                    email: `player${index}@ogsc.dev`,
                  },
                },
              },
            },
          },
        };
      }
    );
  try {
    await Promise.all(mockMentors.map(prisma.user.create));
    mentorsCreateMessage.text = "Created 10 mentors.";
    mentorsCreateMessage.succeed();
  } catch (err) {
    mentorsCreateMessage.fail(`Creating mentors failed\n\n${err.message}`);
  }

  const parentsCreateMessage = Ora(`Creating ${NUMBER_USERS} parents`).start();
  const mockParents: Prisma.UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map(
      (_value: null, index: number): Prisma.UserCreateArgs => {
        return {
          data: {
            email: `parent${index}@ogsc.dev`,
            hashedPassword: hashPassword("password"),
            name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
            phoneNumber: Faker.phone.phoneNumber("(!##) !##-####"),
            status: UserStatus.Active,
            roles: {
              create: {
                type: UserRoleType.Parent,
                relatedPlayer: {
                  connect: {
                    email: `player${index}@ogsc.dev`,
                  },
                },
              },
            },
          },
        };
      }
    );
  try {
    await Promise.all(mockParents.map(prisma.user.create));
    parentsCreateMessage.text = "Created 10 parents.";
    parentsCreateMessage.succeed();
  } catch (err) {
    parentsCreateMessage.fail(`Creating parents failed\n\n${err.message}`);
  }

  const donorsCreateMessage = Ora(`Creating ${NUMBER_USERS} mentors`).start();
  const mockDonors: Prisma.UserCreateArgs[] = Array(NUMBER_USERS)
    .fill(null)
    .map(
      (_value: null, index: number): Prisma.UserCreateArgs => {
        return {
          data: {
            email: `donor${index}@ogsc.dev`,
            hashedPassword: hashPassword("password"),
            name: `${Faker.name.firstName()} ${Faker.name.lastName()}`,
            phoneNumber: Faker.phone.phoneNumber("(!##) !##-####"),
            status: UserStatus.Active,
            roles: {
              create: {
                type: UserRoleType.Donor,
                relatedPlayer: {
                  connect: {
                    email: `player${index}@ogsc.dev`,
                  },
                },
              },
            },
          },
        };
      }
    );
  try {
    await Promise.all(mockDonors.map(prisma.user.create));
    donorsCreateMessage.text = "Created 10 donors.";
    donorsCreateMessage.succeed();
  } catch (err) {
    donorsCreateMessage.fail(`Creating donors failed\n\n${err.message}`);
  }

  process.exit(0);
}

seedDatabase();
