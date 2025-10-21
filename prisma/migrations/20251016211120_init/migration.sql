-- CreateTable
CREATE TABLE `person` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `document` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `person_public_id_key`(`public_id`),
    UNIQUE INDEX `person_email_key`(`email`),
    UNIQUE INDEX `person_document_key`(`document`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donor` (
    `public_id` VARCHAR(191) NOT NULL,
    `document_type` ENUM('CPF', 'CNPJ') NOT NULL,

    PRIMARY KEY (`public_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_member` (
    `public_id` VARCHAR(191) NOT NULL,
    `member_code` VARCHAR(191) NULL,
    `role` ENUM('ORG_ADMIN', 'AUDITOR', 'VOLUNTEER') NULL,
    `organization_id` VARCHAR(191) NULL,

    UNIQUE INDEX `organization_member_member_code_key`(`member_code`),
    PRIMARY KEY (`public_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `website` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `cnpj` VARCHAR(191) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `organization_public_id_key`(`public_id`),
    UNIQUE INDEX `organization_email_key`(`email`),
    UNIQUE INDEX `organization_cnpj_key`(`cnpj`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `donor_id` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `payment_method` ENUM('PIX', 'TRANSFER', 'CREDIT', 'DEBIT') NOT NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'FAILED') NOT NULL,

    UNIQUE INDEX `donation_public_id_key`(`public_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `organizationId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `goalAmount` DECIMAL(18, 4) NOT NULL,
    `collectedAmount` DECIMAL(18, 4) NOT NULL,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `status` ENUM('ACTIVE', 'PAUSED', 'FINISHED', 'CANCELLED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `project_public_id_key`(`public_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `allocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `donation_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `amount_allocated` DECIMAL(10, 2) NOT NULL,
    `allocation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `allocation_public_id_key`(`public_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `status` ENUM('PAID', 'PENDING', 'CANCELLED') NOT NULL,
    `payment_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `expense_public_id_key`(`public_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blockchain_transaction` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `hash` VARCHAR(191) NOT NULL,
    `type` ENUM('DONATION', 'ALLOCATION') NOT NULL,
    `block_number` INTEGER NOT NULL,
    `network` VARCHAR(191) NOT NULL,
    `timestamp` DATETIME(3) NOT NULL,
    `value` DECIMAL(10, 2) NOT NULL,
    `donation_id` VARCHAR(191) NULL,
    `allocation_id` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'FAILED') NOT NULL,

    UNIQUE INDEX `blockchain_transaction_public_id_key`(`public_id`),
    UNIQUE INDEX `blockchain_transaction_hash_key`(`hash`),
    UNIQUE INDEX `blockchain_transaction_donation_id_key`(`donation_id`),
    UNIQUE INDEX `blockchain_transaction_allocation_id_key`(`allocation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blockchain_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `level` ENUM('INFO', 'ERROR', 'WARN') NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entityType` VARCHAR(191) NOT NULL,
    `entityId` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metadata` JSON NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entity_type` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NOT NULL,
    `old_status` VARCHAR(191) NULL,
    `new_status` VARCHAR(191) NOT NULL,
    `changed_by_id` VARCHAR(191) NULL,
    `changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `session` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `revoked` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `session_token_key`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `donor` ADD CONSTRAINT `donor_public_id_fkey` FOREIGN KEY (`public_id`) REFERENCES `person`(`public_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_member` ADD CONSTRAINT `organization_member_public_id_fkey` FOREIGN KEY (`public_id`) REFERENCES `person`(`public_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_member` ADD CONSTRAINT `organization_member_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation` ADD CONSTRAINT `donation_donor_id_fkey` FOREIGN KEY (`donor_id`) REFERENCES `donor`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation` ADD CONSTRAINT `donation_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocation` ADD CONSTRAINT `allocation_donation_id_fkey` FOREIGN KEY (`donation_id`) REFERENCES `donation`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocation` ADD CONSTRAINT `allocation_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocation` ADD CONSTRAINT `allocation_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense` ADD CONSTRAINT `expense_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blockchain_transaction` ADD CONSTRAINT `blockchain_transaction_donation_id_fkey` FOREIGN KEY (`donation_id`) REFERENCES `donation`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blockchain_transaction` ADD CONSTRAINT `blockchain_transaction_allocation_id_fkey` FOREIGN KEY (`allocation_id`) REFERENCES `allocation`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `blockchain_log` ADD CONSTRAINT `blockchain_log_transaction_id_fkey` FOREIGN KEY (`transaction_id`) REFERENCES `blockchain_transaction`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `audit_log` ADD CONSTRAINT `audit_log_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `organization_member`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `status_history` ADD CONSTRAINT `status_history_changed_by_id_fkey` FOREIGN KEY (`changed_by_id`) REFERENCES `organization_member`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `session` ADD CONSTRAINT `session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `person`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
