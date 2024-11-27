-- CreateEnum
CREATE TYPE "EventTypes" AS ENUM ('ONLINE', 'IN_PERSON');

-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "type" "EventTypes" NOT NULL DEFAULT 'IN_PERSON';
