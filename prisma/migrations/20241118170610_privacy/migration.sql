-- CreateEnum
CREATE TYPE "PrivacySetting" AS ENUM ('hideEmail', 'hidePhoneNumber', 'hideLinkedIn', 'hideTwitter', 'hideWebsite');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "privacySettings" "PrivacySetting"[] DEFAULT ARRAY[]::"PrivacySetting"[];
