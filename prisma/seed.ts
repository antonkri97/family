import type { Gender } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "anton.kri97@gmail.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("12345678", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const generatePerson = generatePersonForUser(user.id);

  const firstFather = await generatePerson({
    firstName: "Владимир",
    secondName: "Кривохижин",
    thirdName: "Владимирович",
    gender: "MALE",
  });
  const firstMother = await generatePerson({
    firstName: "Марина",
    secondName: "Иванова",
    thirdName: "Петровна",
    gender: "FEMALE",
    spouseId: firstFather.id,
  });
  const firstSon = await generatePerson({
    firstName: "Антон",
    secondName: "Кривохижин",
    thirdName: "Владимирович",
    fatherId: firstFather.id,
    motherId: firstMother.id,
    gender: "MALE",
  });

  const firstSonWife = await generatePerson({
    firstName: "Екатерина",
    secondName: "Олина",
    thirdName: "Владимировна",
    gender: "FEMALE",
    spouseId: firstSon.id,
  });

  await generatePerson({
    firstName: "Григорий",
    secondName: "Кривохижин",
    thirdName: "Антонович",
    gender: "MALE",
    fatherId: firstSon.id,
    motherId: firstSonWife.id,
  });

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

function generatePersonForUser(userId: string) {
  return async (data: {
    firstName: string;
    secondName: string;
    thirdName: string;
    gender: Gender;
    fatherId?: string;
    motherId?: string;
    spouseId?: string;
  }) => {
    const {
      firstName,
      secondName,
      thirdName,
      gender,
      fatherId,
      motherId,
      spouseId,
    } = data;

    const person = await prisma.person.create({
      data: {
        firstName,
        secondName,
        thirdName,
        gender,
        user: {
          connect: { id: userId },
        },
        ...(fatherId
          ? {
              father: {
                connect: { id: fatherId },
              },
            }
          : {}),
        ...(motherId
          ? {
              mother: {
                connect: { id: motherId },
              },
            }
          : {}),
        ...(spouseId
          ? {
              [gender === "MALE" ? "wife" : "husband"]: {
                connect: { id: spouseId },
              },
            }
          : {}),
      },
    });

    if (spouseId) {
      prisma.person.update({
        where: { id: spouseId },
        data: {
          [person.gender === "MALE" ? "husband" : "wife"]: {
            connect: { id: person.spouseId },
          },
        },
      });
    }

    return person;
  };
}
