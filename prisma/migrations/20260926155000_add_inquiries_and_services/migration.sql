-- CreateTable
CREATE TABLE `services` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type` ENUM('FLOORING', 'PAINTING', 'GYPSUM', 'CEILINGS', 'WALLS', 'LIGHTING', 'WOODWORK_JOINERY', 'KITCHENS', 'BATHROOMS', 'METAL_WORK', 'GLASS_WORK', 'FULL_INTERIOR_RENOVATION') NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `excerpt` VARCHAR(500) NULL,
    `description` TEXT NOT NULL,
    `image_url` TEXT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `services_type_key`(`type`),
    UNIQUE INDEX `services_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

