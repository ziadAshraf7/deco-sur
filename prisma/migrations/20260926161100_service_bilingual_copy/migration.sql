-- AlterTable
ALTER TABLE `services`
  ADD COLUMN `title_en` VARCHAR(255) NULL,
  ADD COLUMN `title_fr` VARCHAR(255) NULL,
  ADD COLUMN `excerpt_en` VARCHAR(500) NULL,
  ADD COLUMN `excerpt_fr` VARCHAR(500) NULL,
  ADD COLUMN `description_en` TEXT NULL,
  ADD COLUMN `description_fr` TEXT NULL;

UPDATE `services`
SET
  `title_en` = `title`,
  `title_fr` = '',
  `excerpt_en` = `excerpt`,
  `description_en` = `description`,
  `description_fr` = '';

ALTER TABLE `services`
  MODIFY `title_en` VARCHAR(255) NOT NULL,
  MODIFY `title_fr` VARCHAR(255) NOT NULL,
  MODIFY `description_en` TEXT NOT NULL,
  MODIFY `description_fr` TEXT NOT NULL;

ALTER TABLE `services`
  DROP COLUMN `title`,
  DROP COLUMN `excerpt`,
  DROP COLUMN `description`;
