/*
  Warnings:

  - You are about to drop the column `allocation_id` on the `expense` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `expense` DROP FOREIGN KEY `expense_allocation_id_fkey`;

-- DropIndex
DROP INDEX `expense_allocation_id_idx` ON `expense`;

-- AlterTable
ALTER TABLE `expense` DROP COLUMN `allocation_id`;
