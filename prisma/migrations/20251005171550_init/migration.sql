/*
  Warnings:

  - You are about to drop the column `publicId` on the `donor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[public_id]` on the table `Donor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `public_id` to the `Donor` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Donor_publicId_key` ON `donor`;

-- AlterTable
ALTER TABLE `donor` DROP COLUMN `publicId`,
    ADD COLUMN `public_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Donor_public_id_key` ON `Donor`(`public_id`);
