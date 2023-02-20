/*
  Warnings:

  - The primary key for the `Friend` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `followerId` on the `Friend` table. All the data in the column will be lost.
  - You are about to drop the column `followingId` on the `Friend` table. All the data in the column will be lost.
  - Added the required column `content` to the `DiaryAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `DiaryAnswer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FK_followerId` to the `Friend` table without a default value. This is not possible if the table is not empty.
  - Added the required column `FK_followingId` to the `Friend` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Friend` DROP FOREIGN KEY `Friend_followerId_fkey`;

-- DropForeignKey
ALTER TABLE `Friend` DROP FOREIGN KEY `Friend_followingId_fkey`;

-- AlterTable
ALTER TABLE `DiaryAnswer` ADD COLUMN `content` VARCHAR(600) NOT NULL,
    ADD COLUMN `createAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updateAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Friend` DROP PRIMARY KEY,
    DROP COLUMN `followerId`,
    DROP COLUMN `followingId`,
    ADD COLUMN `FK_followerId` INTEGER NOT NULL,
    ADD COLUMN `FK_followingId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`FK_followerId`, `FK_followingId`);

-- CreateIndex
CREATE INDEX `Friend_followingId_fkey` ON `Friend`(`FK_followingId`);

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_FK_followerId_fkey` FOREIGN KEY (`FK_followerId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Friend` ADD CONSTRAINT `Friend_FK_followingId_fkey` FOREIGN KEY (`FK_followingId`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
