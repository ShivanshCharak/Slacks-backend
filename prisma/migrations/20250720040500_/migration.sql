/*
  Warnings:

  - You are about to drop the column `memberId` on the `Channel` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Moderator]` on the table `Organization` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Moderator` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Membership" DROP CONSTRAINT "Membership_checkpoint_fkey";

-- AlterTable
ALTER TABLE "Channel" DROP COLUMN "memberId";

-- AlterTable
ALTER TABLE "Membership" ALTER COLUMN "checkpoint" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "Moderator" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Organization_Moderator_key" ON "Organization"("Moderator");

-- AddForeignKey
ALTER TABLE "Organization" ADD CONSTRAINT "Organization_Moderator_fkey" FOREIGN KEY ("Moderator") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_checkpoint_fkey" FOREIGN KEY ("checkpoint") REFERENCES "Message"("id") ON DELETE SET NULL ON UPDATE CASCADE;
