-- CreateTable
CREATE TABLE `password_reset_token` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `token` TEXT NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `password_reset_token_user_id_idx`(`user_id`),
    INDEX `password_reset_token_expires_at_idx`(`expires_at`),
    INDEX `password_reset_token_token_idx`(`token`(255)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `password_reset_token` ADD CONSTRAINT `password_reset_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `person`(`public_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
