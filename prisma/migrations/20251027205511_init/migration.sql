-- AddForeignKey
ALTER TABLE `organization_membership` ADD CONSTRAINT `organization_membership_hired_by_id_fkey` FOREIGN KEY (`hired_by_id`) REFERENCES `organization_member`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_membership` ADD CONSTRAINT `organization_membership_terminated_by_id_fkey` FOREIGN KEY (`terminated_by_id`) REFERENCES `organization_member`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;
