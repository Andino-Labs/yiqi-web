/*
  Warnings:

  - A unique constraint covering the columns `[organizationId,userId]` on the table `OrganizationContact` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "OrganizationContact_organizationId_userId_key" ON "OrganizationContact"("organizationId", "userId");
