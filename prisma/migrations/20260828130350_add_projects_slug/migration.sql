/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `projects` ADD COLUMN `slug` VARCHAR(255) NOT NULL DEFAULT 'slug';

-- CreateIndex
CREATE UNIQUE INDEX `projects_slug_key` ON `projects`(`slug`);
