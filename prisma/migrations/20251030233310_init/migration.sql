-- DropIndex
DROP INDEX `session_token_key` ON `session`;

-- DropIndex
DROP INDEX `session_token_revoked_idx` ON `session`;

-- AlterTable
ALTER TABLE `session` MODIFY `token` TEXT NOT NULL;

-- CreateIndex
CREATE INDEX `session_token_revoked_idx` ON `session`(`token`(255), `revoked`);
