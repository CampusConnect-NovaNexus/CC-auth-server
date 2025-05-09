/*
  Warnings:

  - You are about to drop the `SocialMedia` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SocialMedia" DROP CONSTRAINT "SocialMedia_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "XLink" TEXT,
ADD COLUMN     "codeforcesLink" TEXT,
ADD COLUMN     "githubLink" TEXT,
ADD COLUMN     "instaLink" TEXT,
ADD COLUMN     "leetcodeLink" TEXT,
ADD COLUMN     "youtubeLink" TEXT;

-- DropTable
DROP TABLE "SocialMedia";
