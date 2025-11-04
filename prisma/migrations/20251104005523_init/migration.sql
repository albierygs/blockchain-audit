-- AlterTable
ALTER TABLE `expense` ADD COLUMN `supplier_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `supplier` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `contact_email` VARCHAR(191) NULL,
    `contact_phone` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `supplier_public_id_key`(`public_id`),
    UNIQUE INDEX `supplier_document_key`(`document`),
    INDEX `supplier_organization_id_idx`(`organization_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `beneficiary` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `contact_info` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `beneficiary_public_id_key`(`public_id`),
    INDEX `beneficiary_organization_id_idx`(`organization_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `volunteer_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `volunteer_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NULL,
    `date` DATETIME(3) NOT NULL,
    `hours_worked` DECIMAL(5, 2) NOT NULL,
    `description` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `approved_by_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `volunteer_log_public_id_key`(`public_id`),
    INDEX `volunteer_log_volunteer_id_idx`(`volunteer_id`),
    INDEX `volunteer_log_project_id_idx`(`project_id`),
    INDEX `volunteer_log_approved_by_id_idx`(`approved_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `delivery` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `beneficiary_id` VARCHAR(191) NOT NULL,
    `expense_id` VARCHAR(191) NULL,
    `item_description` VARCHAR(191) NOT NULL,
    `quantity` INTEGER NOT NULL,
    `delivery_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `delivery_public_id_key`(`public_id`),
    INDEX `delivery_project_id_idx`(`project_id`),
    INDEX `delivery_beneficiary_id_idx`(`beneficiary_id`),
    INDEX `delivery_expense_id_idx`(`expense_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `attachment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `entity_type` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NOT NULL,
    `file_name` VARCHAR(191) NOT NULL,
    `file_url` VARCHAR(191) NOT NULL,
    `uploaded_by_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `attachment_public_id_key`(`public_id`),
    INDEX `attachment_entity_id_entity_type_idx`(`entity_id`, `entity_type`),
    INDEX `attachment_uploaded_by_id_idx`(`uploaded_by_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `digital_certificate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `donation_id` VARCHAR(191) NOT NULL,
    `donor_id` VARCHAR(191) NOT NULL,
    `type` ENUM('CERTIFICATE', 'NFT') NOT NULL,
    `mint_hash` VARCHAR(191) NULL,
    `token_id` VARCHAR(191) NULL,
    `metadata_url` VARCHAR(191) NOT NULL,
    `issued_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `digital_certificate_public_id_key`(`public_id`),
    UNIQUE INDEX `digital_certificate_donation_id_key`(`donation_id`),
    INDEX `digital_certificate_donor_id_idx`(`donor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `supplier` ADD CONSTRAINT `supplier_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `beneficiary` ADD CONSTRAINT `beneficiary_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense` ADD CONSTRAINT `expense_supplier_id_fkey` FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `volunteer_log` ADD CONSTRAINT `volunteer_log_volunteer_id_fkey` FOREIGN KEY (`volunteer_id`) REFERENCES `organization_member`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `volunteer_log` ADD CONSTRAINT `volunteer_log_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `volunteer_log` ADD CONSTRAINT `volunteer_log_approved_by_id_fkey` FOREIGN KEY (`approved_by_id`) REFERENCES `organization_member`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_beneficiary_id_fkey` FOREIGN KEY (`beneficiary_id`) REFERENCES `beneficiary`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `delivery` ADD CONSTRAINT `delivery_expense_id_fkey` FOREIGN KEY (`expense_id`) REFERENCES `expense`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `attachment` ADD CONSTRAINT `attachment_uploaded_by_id_fkey` FOREIGN KEY (`uploaded_by_id`) REFERENCES `organization_member`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digital_certificate` ADD CONSTRAINT `digital_certificate_donation_id_fkey` FOREIGN KEY (`donation_id`) REFERENCES `donation`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `digital_certificate` ADD CONSTRAINT `digital_certificate_donor_id_fkey` FOREIGN KEY (`donor_id`) REFERENCES `donor`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
