/*
  Warnings:

  - Added the required column `role` to the `person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `person` ADD COLUMN `role` ENUM('DONOR', 'ORG_MEMBER', 'ADMIN') NOT NULL;
