import { db } from "@/server/db";

async function migrateExperienceColumn() {
  try {
    // Step 1: Add a new column 'newExperience' as a string to the User table
    await db.$executeRaw`ALTER TABLE "User" ADD COLUMN "newExperience" TEXT;`;

    // Step 2: Copy data from 'experience' (BIGINT) to 'newExperience' (TEXT) in the User table
    await db.$executeRaw`UPDATE "User" SET "newExperience" = CAST("experience" AS TEXT);`;

    // Step 3: Drop the 'experience' column in the User table
    await db.$executeRaw`ALTER TABLE "User" DROP COLUMN "experience";`;

    // Step 4: Rename 'newExperience' to 'experience' in the User table
    await db.$executeRaw`ALTER TABLE "User" RENAME COLUMN "newExperience" TO "experience";`;

    console.log("User table migration completed successfully!");

    // Step 5: Add a new column 'newExperience' as a string to the Sword table
    await db.$executeRaw`ALTER TABLE "Sword" ADD COLUMN "newExperience" TEXT;`;

    // Step 6: Copy data from 'experience' (BIGINT) to 'newExperience' (TEXT) in the Sword table
    await db.$executeRaw`UPDATE "Sword" SET "newExperience" = CAST("experience" AS TEXT);`;

    // Step 7: Drop the 'experience' column in the Sword table
    await db.$executeRaw`ALTER TABLE "Sword" DROP COLUMN "experience";`;

    // Step 8: Rename 'newExperience' to 'experience' in the Sword table
    await db.$executeRaw`ALTER TABLE "Sword" RENAME COLUMN "newExperience" TO "experience";`;

    console.log("Sword table migration completed successfully!");

  } catch (error) {
    console.error("Error during migration:", error);
  }
}

void migrateExperienceColumn();
