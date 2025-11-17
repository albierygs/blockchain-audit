/*
  Warnings:

  - Made the column `organizationId` on table `allocation` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `allocation` DROP FOREIGN KEY `allocation_organizationId_fkey`;

-- DropIndex
DROP INDEX `allocation_organizationId_fkey` ON `allocation`;

-- AlterTable
ALTER TABLE `allocation` MODIFY `organizationId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `allocation` ADD CONSTRAINT `allocation_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
