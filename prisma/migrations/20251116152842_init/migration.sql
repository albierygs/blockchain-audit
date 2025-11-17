/*
  Warnings:

  - Made the column `changed_by_id` on table `status_history` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `status_history` DROP FOREIGN KEY `status_history_changed_by_id_fkey`;

-- AlterTable
ALTER TABLE `status_history` MODIFY `changed_by_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `status_history` ADD CONSTRAINT `status_history_changed_by_id_fkey` FOREIGN KEY (`changed_by_id`) REFERENCES `person`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
