/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `audit_log` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `status_history` will be added. If there are existing duplicate values, this will fail.
  - The required column `public_id` was added to the `audit_log` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `public_id` was added to the `status_history` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `audit_log` ADD COLUMN `public_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `status_history` ADD COLUMN `public_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `audit_log_public_id_key` ON `audit_log`(`public_id`);

-- CreateIndex
CREATE UNIQUE INDEX `status_history_public_id_key` ON `status_history`(`public_id`);
