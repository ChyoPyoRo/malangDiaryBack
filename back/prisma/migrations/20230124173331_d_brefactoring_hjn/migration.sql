/*
  Warnings:

  - You are about to alter the column `userId` on the `message` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `refreshToken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `standByFriend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `standByFriend` table. All the data in the column will be lost.
  - The primary key for the `user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `user` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `diary` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emotionData` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `friend` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sim` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[PK_standByFriend]` on the table `standByFriend` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `PK_standByFriend` to the `standByFriend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `diary` DROP FOREIGN KEY `diary_userId_fkey`;

-- DropForeignKey
ALTER TABLE `emotionData` DROP FOREIGN KEY `emotionData_userId_fkey`;

-- DropForeignKey
ALTER TABLE `friend` DROP FOREIGN KEY `friend_friendId_fkey`;

-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `message_userId_fkey`;

-- DropForeignKey
ALTER TABLE `refreshToken` DROP FOREIGN KEY `refreshToken_userId_fkey`;

-- DropIndex
DROP INDEX `standByFriend_id_key` ON `standByFriend`;

-- AlterTable
ALTER TABLE `message` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `refreshToken` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `standByFriend` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD COLUMN `PK_standByFriend` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`PK_standByFriend`);

-- AlterTable
ALTER TABLE `user` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `diary`;

-- DropTable
DROP TABLE `emotionData`;

-- DropTable
DROP TABLE `friend`;

-- DropTable
DROP TABLE `sim`;

-- CreateTable
CREATE TABLE `Diary` (
    `PK_diary` INTEGER NOT NULL AUTO_INCREMENT,
    `emotion` VARCHAR(191) NOT NULL,
    `img` VARCHAR(200) NULL,
    `content` VARCHAR(1000) NOT NULL,
    `scope` VARCHAR(10) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL,
    `title` VARCHAR(40) NOT NULL,
    `subTitle` VARCHAR(40) NULL,
    `userName` VARCHAR(191) NOT NULL,
    `FK_userId` INTEGER NOT NULL,

    UNIQUE INDEX `Diary_PK_diary_key`(`PK_diary`),
    INDEX `diary_userId_fkey`(`FK_userId`),
    PRIMARY KEY (`PK_diary`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diaryEmotion` (
    `Excited` DOUBLE NOT NULL,
    `Comfort` DOUBLE NOT NULL,
    `Confidence` DOUBLE NOT NULL,
    `thanks` DOUBLE NOT NULL,
    `Sadness` DOUBLE NOT NULL,
    `Anger` DOUBLE NOT NULL,
    `Anxiety` DOUBLE NOT NULL,
    `hurt` DOUBLE NOT NULL,
    `FK_diaryId` INTEGER NOT NULL,

    UNIQUE INDEX `diaryEmotion_FK_diaryId_key`(`FK_diaryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Friend` (
    `followerId` INTEGER NOT NULL,
    `followingId` INTEGER NOT NULL,

    INDEX `Friend_followingId_fkey`(`followingId`),
    PRIMARY KEY (`followerId`, `followingId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EmotionData` (
    `emotion` VARCHAR(20) NOT NULL,
    `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `PK_emotionData` INTEGER NOT NULL AUTO_INCREMENT,
    `FK_userId` INTEGER NOT NULL,

    UNIQUE INDEX `EmotionData_PK_emotionData_key`(`PK_emotionData`),
    INDEX `emotionData_userId_fkey`(`FK_userId`),
    PRIMARY KEY (`PK_emotionData`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiaryAnswer` (
    `PK_diaryAnswer` INTEGER NOT NULL AUTO_INCREMENT,
    `FK_questionNumber` INTEGER NOT NULL,
    `FK_userId` INTEGER NOT NULL,

    UNIQUE INDEX `DiaryAnswer_PK_diaryAnswer_key`(`PK_diaryAnswer`),
    INDEX `diaryAnswer_FK_questionNumber_fkey`(`FK_questionNumber`),
    INDEX `diaryAnswer_FK_userId_fkey`(`FK_userId`),
    PRIMARY KEY (`PK_diaryAnswer`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiaryQuestion` (
    `PK_diaryQuestion` INTEGER NOT NULL AUTO_INCREMENT,
    `question` VARCHAR(80) NOT NULL,

    UNIQUE INDEX `DiaryQuestion_PK_diaryQuestion_key`(`PK_diaryQuestion`),
    PRIMARY KEY (`PK_diaryQuestion`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `standByFriend_PK_standByFriend_key` ON `standByFriend`(`PK_standByFriend`);

-- AddForeignKey
ALTER TABLE `Diary` ADD CONSTRAINT `Diary_FK_userId_fkey` FOREIGN KEY (`FK_userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `diaryEmotion` ADD CONSTRAINT `diaryEmotion_FK_diaryId_fkey` FOREIGN KEY (`FK_diaryId`) REFERENCES `Diary`(`PK_diary`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `message` ADD CONSTRAINT `message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `refreshToken` ADD CONSTRAINT `refreshToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EmotionData` ADD CONSTRAINT `EmotionData_FK_userId_fkey` FOREIGN KEY (`FK_userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiaryAnswer` ADD CONSTRAINT `DiaryAnswer_FK_questionNumber_fkey` FOREIGN KEY (`FK_questionNumber`) REFERENCES `DiaryQuestion`(`PK_diaryQuestion`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiaryAnswer` ADD CONSTRAINT `DiaryAnswer_FK_userId_fkey` FOREIGN KEY (`FK_userId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
