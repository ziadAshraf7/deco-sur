-- AlterTable
ALTER TABLE `project_before_after` MODIFY `project_id` BIGINT NULL;

-- RenameIndex
ALTER TABLE `project_before_after` RENAME INDEX `project_before_after_project_id_fkey` TO `project_before_after_project_id_idx`;
