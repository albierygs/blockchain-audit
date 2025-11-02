/*
  Warnings:

  - A unique constraint covering the columns `[token]` on the table `password_reset_token` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `password_reset_token_token_idx` ON `password_reset_token`;

-- AlterTable
ALTER TABLE `password_reset_token` MODIFY `token` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `password_reset_token_token_key` ON `password_reset_token`(`token`);
