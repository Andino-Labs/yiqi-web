/*
  Warnings:

  - You are about to drop the column `stripeAccountId` on the `Organization` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Organization" DROP COLUMN "stripeAccountId",
ADD COLUMN     "billingInfo" JSONB;
