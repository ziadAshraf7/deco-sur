/*
  Warnings:

  - Made the column `hero_image_url` on table `projects` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `projects` MODIFY `hero_image_url` TEXT NOT NULL;
