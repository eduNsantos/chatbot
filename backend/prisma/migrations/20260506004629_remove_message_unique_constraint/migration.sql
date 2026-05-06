-- DropForeignKey
ALTER TABLE `Message` DROP FOREIGN KEY `Message_contactId_fkey`;

-- DropIndex
DROP INDEX `Message_contactId_sessionId_messageId_key` ON `Message`;
