-- CreateTable
CREATE TABLE `user` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `name` VARCHAR(20) NOT NULL,
    `password` VARCHAR(60) NOT NULL,
    `description` VARCHAR(100) NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `withdrawal` TINYINT NOT NULL DEFAULT 0,
    `emotion` VARCHAR(20) NULL,

    UNIQUE INDEX `user_id_key`(`id`),
    UNIQUE INDEX `user_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emailAuthentication` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(40) NOT NULL,
    `CertiNumber` INTEGER NOT NULL,

    UNIQUE INDEX `emailAuthentication_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diary` (
    `PK_diary` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NOT NULL,
    `emotion` VARCHAR(191) NOT NULL,
    `img` VARCHAR(200) NULL,
    `content` VARCHAR(1000) NOT NULL,
    `scope` VARCHAR(10) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(40) NOT NULL,
    `subTitle` VARCHAR(40) NULL,

    UNIQUE INDEX `diary_PK_diary_key`(`PK_diary`),
    INDEX `diary_userId_fkey`(`userId`),
    PRIMARY KEY (`PK_diary`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `message` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `text` VARCHAR(200) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `room` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `message_id_key`(`id`),
    INDEX `message_userId_fkey`(`userId`),
    INDEX `message_room_fkey`(`room`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chatRoom` (
    `id` VARCHAR(191) NOT NULL,
    `userIdFst` VARCHAR(191) NOT NULL,
    `userIdSnd` VARCHAR(191) NOT NULL,
    `latest` DATETIME(3) NOT NULL,

    UNIQUE INDEX `chatRoom_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `standByFriend` (
    `id` VARCHAR(191) NOT NULL,
    `requester` VARCHAR(191) NOT NULL,
    `respondent` VARCHAR(40) NOT NULL,
    `relationship` TINYINT NOT NULL DEFAULT 0,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `standByFriend_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `friend` (
    `id` VARCHAR(191) NOT NULL,
    `friendId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(40) NOT NULL,

    UNIQUE INDEX `friend_id_key`(`id`),
    INDEX `friend_friendId_fkey`(`friendId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `refreshToken` (
    `id` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(500) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `refreshToken_id_key`(`id`),
    INDEX `refreshToken_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `emotionData` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `emotion` VARCHAR(20) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `emotionData_id_key`(`id`),
    INDEX `emotionData_userId_fkey`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sim` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `currentPost` INTEGER NOT NULL,
    `one` INTEGER NOT NULL,
    `two` INTEGER NOT NULL,
    `three` INTEGER NOT NULL,

    UNIQUE INDEX `sim_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `diary` ADD CONSTRAINT `diary_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_room_fkey` FOREIGN KEY (`room`) REFERENCES `chatRoom`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `friend` ADD CONSTRAINT `friend_friendId_fkey` FOREIGN KEY (`friendId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refreshToken` ADD CONSTRAINT `refreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `emotionData` ADD CONSTRAINT `emotionData_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
