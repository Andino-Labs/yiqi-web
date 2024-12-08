/*
  Warnings:

  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
ALTER TYPE "JobType" ADD VALUE 'SEND_USER_MESSAGE';

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_formId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_senderUserId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- AlterTable
ALTER TABLE "QueueJob" ADD COLUMN     "notificationType" "NotificationType";

-- DropTable
DROP TABLE "Notification";
