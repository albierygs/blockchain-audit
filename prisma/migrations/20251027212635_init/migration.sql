-- DropForeignKey
ALTER TABLE `organization_membership` DROP FOREIGN KEY `organization_membership_hired_by_id_fkey`;

-- DropForeignKey
ALTER TABLE `organization_membership` DROP FOREIGN KEY `organization_membership_terminated_by_id_fkey`;

-- DropIndex
DROP INDEX `organization_membership_hired_by_id_fkey` ON `organization_membership`;

-- DropIndex
DROP INDEX `organization_membership_terminated_by_id_fkey` ON `organization_membership`;

-- AddForeignKey
ALTER TABLE `organization_membership` ADD CONSTRAINT `organization_membership_hired_by_id_fkey` FOREIGN KEY (`hired_by_id`) REFERENCES `person`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_membership` ADD CONSTRAINT `organization_membership_terminated_by_id_fkey` FOREIGN KEY (`terminated_by_id`) REFERENCES `person`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;
