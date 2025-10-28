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
    `role` ENUM('DONOR', 'ORG_MEMBER', 'ADMIN') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `person_public_id_key`(`public_id`),
    UNIQUE INDEX `person_email_key`(`email`),
    UNIQUE INDEX `person_document_key`(`document`),
    INDEX `person_email_idx`(`email`),
    INDEX `person_document_idx`(`document`),
    INDEX `person_status_role_idx`(`status`, `role`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `donor` (
    `public_id` VARCHAR(191) NOT NULL,
    `document_type` ENUM('CPF', 'CNPJ') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `donor_public_id_key`(`public_id`),
    PRIMARY KEY (`public_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_member` (
    `public_id` VARCHAR(191) NOT NULL,
    `member_code` VARCHAR(191) NULL,
    `role` ENUM('ORG_ADMIN', 'AUDITOR', 'VOLUNTEER') NULL,
    `status` ENUM('ACTIVE', 'TERMINATED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `organization_id` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `organization_member_public_id_key`(`public_id`),
    UNIQUE INDEX `organization_member_member_code_key`(`member_code`),
    INDEX `organization_member_member_code_idx`(`member_code`),
    INDEX `organization_member_organization_id_idx`(`organization_id`),
    INDEX `organization_member_status_idx`(`status`),
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
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `verified_at` DATETIME(3) NULL,
    `verified_by` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `organization_public_id_key`(`public_id`),
    UNIQUE INDEX `organization_email_key`(`email`),
    UNIQUE INDEX `organization_cnpj_key`(`cnpj`),
    INDEX `organization_email_idx`(`email`),
    INDEX `organization_cnpj_idx`(`cnpj`),
    INDEX `organization_status_verified_idx`(`status`, `verified`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `organization_membership` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `member_id` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `role` ENUM('ORG_ADMIN', 'AUDITOR', 'VOLUNTEER') NOT NULL,
    `status` ENUM('ACTIVE', 'TERMINATED', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    `hired_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `terminated_at` DATETIME(3) NULL,
    `hired_by_id` VARCHAR(191) NOT NULL,
    `terminated_by_id` VARCHAR(191) NULL,
    `termination_reason` TEXT NULL,
    `notes` TEXT NULL,

    UNIQUE INDEX `organization_membership_public_id_key`(`public_id`),
    INDEX `organization_membership_member_id_idx`(`member_id`),
    INDEX `organization_membership_organization_id_idx`(`organization_id`),
    INDEX `organization_membership_status_idx`(`status`),
    INDEX `organization_membership_member_id_organization_id_idx`(`member_id`, `organization_id`),
    UNIQUE INDEX `organization_membership_member_id_organization_id_hired_at_key`(`member_id`, `organization_id`, `hired_at`),
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
    `status` ENUM('PENDING', 'CONFIRMED', 'FAILED', 'CANCELLED', 'REFUNDED') NOT NULL DEFAULT 'PENDING',
    `confirmed_at` DATETIME(3) NULL,
    `cancelled_at` DATETIME(3) NULL,
    `cancelled_by` VARCHAR(191) NULL,
    `cancellation_reason` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `donation_public_id_key`(`public_id`),
    INDEX `donation_donor_id_idx`(`donor_id`),
    INDEX `donation_organization_id_idx`(`organization_id`),
    INDEX `donation_status_idx`(`status`),
    INDEX `donation_date_idx`(`date`),
    INDEX `donation_donor_id_status_idx`(`donor_id`, `status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `organization_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `goal_amount` DECIMAL(18, 4) NOT NULL,
    `collected_amount` DECIMAL(18, 4) NOT NULL DEFAULT 0,
    `start_date` DATETIME(3) NOT NULL,
    `end_date` DATETIME(3) NULL,
    `status` ENUM('DRAFT', 'ACTIVE', 'PAUSED', 'FINISHED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `project_public_id_key`(`public_id`),
    INDEX `project_organization_id_idx`(`organization_id`),
    INDEX `project_status_idx`(`status`),
    INDEX `project_organization_id_status_idx`(`organization_id`, `status`),
    INDEX `project_start_date_end_date_idx`(`start_date`, `end_date`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `allocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `donation_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `amount_allocated` DECIMAL(18, 4) NOT NULL,
    `allocation_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `organizationId` VARCHAR(191) NULL,

    UNIQUE INDEX `allocation_public_id_key`(`public_id`),
    INDEX `allocation_donation_id_idx`(`donation_id`),
    INDEX `allocation_project_id_idx`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `expense` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `public_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `allocation_id` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `value` DECIMAL(18, 4) NOT NULL,
    `category` ENUM('INFRASTRUCTURE', 'SUPPLIES', 'SERVICES', 'PERSONNEL', 'MARKETING', 'ADMINISTRATIVE', 'OTHER') NOT NULL DEFAULT 'OTHER',
    `status` ENUM('PENDING', 'APPROVED', 'PAID', 'REJECTED', 'CANCELLED') NOT NULL DEFAULT 'PENDING',
    `payment_date` DATETIME(3) NULL,
    `receipt_url` VARCHAR(191) NULL,
    `invoice_number` VARCHAR(191) NULL,
    `created_by` VARCHAR(191) NULL,
    `approved_by` VARCHAR(191) NULL,
    `approved_at` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `expense_public_id_key`(`public_id`),
    INDEX `expense_project_id_idx`(`project_id`),
    INDEX `expense_allocation_id_idx`(`allocation_id`),
    INDEX `expense_status_idx`(`status`),
    INDEX `expense_category_idx`(`category`),
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
    `gas_used` DECIMAL(18, 8) NULL,
    `gas_price` DECIMAL(18, 8) NULL,
    `from_address` VARCHAR(191) NULL,
    `to_address` VARCHAR(191) NULL,
    `confirmations` INTEGER NOT NULL DEFAULT 0,
    `donation_id` VARCHAR(191) NULL,
    `allocation_id` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'CONFIRMED', 'FAILED') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `blockchain_transaction_public_id_key`(`public_id`),
    UNIQUE INDEX `blockchain_transaction_hash_key`(`hash`),
    UNIQUE INDEX `blockchain_transaction_donation_id_key`(`donation_id`),
    UNIQUE INDEX `blockchain_transaction_allocation_id_key`(`allocation_id`),
    INDEX `blockchain_transaction_hash_idx`(`hash`),
    INDEX `blockchain_transaction_type_status_idx`(`type`, `status`),
    INDEX `blockchain_transaction_block_number_idx`(`block_number`),
    INDEX `blockchain_transaction_network_idx`(`network`),
    INDEX `blockchain_transaction_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blockchain_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transaction_id` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `level` ENUM('INFO', 'ERROR', 'WARN') NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `blockchain_log_transaction_id_idx`(`transaction_id`),
    INDEX `blockchain_log_level_idx`(`level`),
    INDEX `blockchain_log_timestamp_idx`(`timestamp`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `audit_log` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `member_id` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `entity_type` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` VARCHAR(191) NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metadata` JSON NULL,

    INDEX `audit_log_member_id_idx`(`member_id`),
    INDEX `audit_log_entity_type_entity_id_idx`(`entity_type`, `entity_id`),
    INDEX `audit_log_timestamp_idx`(`timestamp`),
    INDEX `audit_log_action_idx`(`action`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `status_history` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entity_type` VARCHAR(191) NOT NULL,
    `entity_id` VARCHAR(191) NOT NULL,
    `old_status` VARCHAR(191) NULL,
    `new_status` VARCHAR(191) NOT NULL,
    `reason` TEXT NULL,
    `changed_by_id` VARCHAR(191) NULL,
    `changed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `metadata` JSON NULL,

    INDEX `status_history_entity_type_entity_id_idx`(`entity_type`, `entity_id`),
    INDEX `status_history_changed_at_idx`(`changed_at`),
    INDEX `status_history_changed_by_id_idx`(`changed_by_id`),
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
    `revoked_at` DATETIME(3) NULL,
    `ip_address` VARCHAR(191) NULL,
    `user_agent` TEXT NULL,

    UNIQUE INDEX `session_token_key`(`token`),
    INDEX `session_user_id_idx`(`user_id`),
    INDEX `session_expires_at_idx`(`expires_at`),
    INDEX `session_token_revoked_idx`(`token`, `revoked`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `donor` ADD CONSTRAINT `donor_public_id_fkey` FOREIGN KEY (`public_id`) REFERENCES `person`(`public_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_member` ADD CONSTRAINT `organization_member_public_id_fkey` FOREIGN KEY (`public_id`) REFERENCES `person`(`public_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_member` ADD CONSTRAINT `organization_member_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_membership` ADD CONSTRAINT `organization_membership_member_id_fkey` FOREIGN KEY (`member_id`) REFERENCES `organization_member`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `organization_membership` ADD CONSTRAINT `organization_membership_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation` ADD CONSTRAINT `donation_donor_id_fkey` FOREIGN KEY (`donor_id`) REFERENCES `donor`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `donation` ADD CONSTRAINT `donation_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_organization_id_fkey` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocation` ADD CONSTRAINT `allocation_donation_id_fkey` FOREIGN KEY (`donation_id`) REFERENCES `donation`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocation` ADD CONSTRAINT `allocation_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `allocation` ADD CONSTRAINT `allocation_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense` ADD CONSTRAINT `expense_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `expense` ADD CONSTRAINT `expense_allocation_id_fkey` FOREIGN KEY (`allocation_id`) REFERENCES `allocation`(`public_id`) ON DELETE SET NULL ON UPDATE CASCADE;

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
