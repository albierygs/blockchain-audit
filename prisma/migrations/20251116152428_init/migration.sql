-- DropForeignKey
ALTER TABLE `status_history` DROP FOREIGN KEY `status_history_changed_by_id_fkey`;

-- AddForeignKey
ALTER TABLE `status_history` ADD CONSTRAINT `status_history_changed_by_id_fkey` FOREIGN KEY (`changed_by_id`) REFERENCES `person`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;
