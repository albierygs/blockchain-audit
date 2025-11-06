-- AlterTable
ALTER TABLE `person` ADD COLUMN `birth_date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `city` VARCHAR(191) NOT NULL DEFAULT 'Salvador',
    ADD COLUMN `state` ENUM('AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO') NOT NULL DEFAULT 'BA';
