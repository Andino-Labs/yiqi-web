/*
  Warnings:

  - You are about to drop the `Attendance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[eventId,userId]` on the table `Attendee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Attendance" DROP CONSTRAINT "Attendance_userId_fkey";

-- DropIndex
DROP INDEX "Attendee_userId_eventId_key";

-- DropTable
DROP TABLE "Attendance";

-- CreateIndex
CREATE UNIQUE INDEX "Attendee_eventId_userId_key" ON "Attendee"("eventId", "userId");
