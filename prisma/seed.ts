import prisma from "../lib/prisma";
import translations from "./072323-embeddings_laozi.json";
import "dotenv/config";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("process.env.OPENAI_API_KEY is not defined. Please set it.");
}

if (!process.env.POSTGRES_URL) {
  throw new Error("process.env.POSTGRES_URL is not defined. Please set it.");
}

async function main() {
  try {
    const data = await prisma.document.findFirst({
      where: {
        translator: "A.C. Graham",
      },
    });
    if (data) {
      console.log("DB already seeded!");
      return;
    }
  } catch (error) {
    console.error('Error checking if "A.C. Graham" exists in the database.');
    throw error;
  }
  for (const record of translations as any[]) {
    const { embedding, name, date, text } = record;

    const doc = await prisma.document.create({
      data: {
        translator: name,
        date,
        text,
      },
    });

    await prisma.$executeRaw`
        UPDATE document
        SET embedding = ${embedding}::vector
        WHERE id = ${doc.id}
    `;

    console.log(`Added ${doc.translator} ${doc.date}`);
  }

  console.log("DB seeded successfully!");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
