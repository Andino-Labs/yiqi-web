/*
  Warnings:

  - Added the required column `category` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('GENERAL', 'VIP', 'BACKSTAGE');

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "category" "TicketCategory" NOT NULL,
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "TicketOfferings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "TicketCategory" NOT NULL,
    "description" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "limit" INTEGER NOT NULL,
    "ticketsPerPurchase" INTEGER NOT NULL DEFAULT 1,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "TicketOfferings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TicketOfferings" ADD CONSTRAINT "TicketOfferings_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
