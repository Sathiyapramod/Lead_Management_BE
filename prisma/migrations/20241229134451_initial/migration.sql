-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('KAM', 'lead', 'contact') NOT NULL,
    `time_id` INTEGER NULL,

    UNIQUE INDEX `Users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TimeZones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `timezone` VARCHAR(191) NOT NULL,
    `time_diff` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TimeZones_timezone_key`(`timezone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Managers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mgr_name` VARCHAR(191) NOT NULL,
    `role` ENUM('manager', 'admin') NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Managers_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Leads` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lead_name` VARCHAR(191) NOT NULL,
    `rest_name` VARCHAR(191) NOT NULL,
    `rest_addr1` VARCHAR(191) NOT NULL,
    `rest_addr2` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `mgr_id` INTEGER NOT NULL,
    `lead_status` BOOLEAN NOT NULL,
    `call_freq` ENUM('daily', 'weekly') NOT NULL,
    `last_call_date` DATETIME(3) NULL,
    `orders_placed` INTEGER NULL,
    `orders_done` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Leads_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Contacts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lead_id` INTEGER NOT NULL,
    `cnct_name` VARCHAR(191) NOT NULL,
    `cnct_role` ENUM('owner', 'general_manager', 'procurement', 'sales', 'chef') NOT NULL,
    `cnct_info` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Contacts_phone_idx`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Call_Logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sid` VARCHAR(191) NOT NULL,
    `lead_id` INTEGER NOT NULL,
    `from_id` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `recording_sid` VARCHAR(191) NULL,
    `recording_uri` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Call_Logs_sid_key`(`sid`),
    INDEX `Call_Logs_sid_idx`(`sid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Invoices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lead_id` INTEGER NOT NULL,
    `account_id` INTEGER NULL,
    `invoice_num` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(65, 30) NOT NULL,
    `status` ENUM('Created', 'Sent', 'Paid', 'Overdue') NOT NULL,
    `due_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccPerf` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lead_id` INTEGER NOT NULL,
    `revenue` INTEGER NOT NULL,
    `growth_rate` INTEGER NOT NULL,
    `score` ENUM('one', 'two', 'three', 'four', 'five') NOT NULL,
    `last_review` DATETIME(3) NOT NULL,
    `next_review` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AccOpps` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `lead_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `status` ENUM('new', 'won', 'lost') NOT NULL,
    `close_date` DATETIME(3) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Users` ADD CONSTRAINT `Users_time_id_fkey` FOREIGN KEY (`time_id`) REFERENCES `TimeZones`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Leads` ADD CONSTRAINT `Leads_mgr_id_fkey` FOREIGN KEY (`mgr_id`) REFERENCES `Managers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Contacts` ADD CONSTRAINT `Contacts_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Call_Logs` ADD CONSTRAINT `Call_Logs_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoices` ADD CONSTRAINT `Invoices_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccPerf` ADD CONSTRAINT `AccPerf_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AccOpps` ADD CONSTRAINT `AccOpps_lead_id_fkey` FOREIGN KEY (`lead_id`) REFERENCES `Leads`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
