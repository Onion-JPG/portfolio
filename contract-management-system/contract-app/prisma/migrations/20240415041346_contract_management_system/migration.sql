-- CreateTable
CREATE TABLE `Account` (
    `userID` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `accountType` ENUM('Admin', 'Manager', 'BasicUser', 'Associate') NOT NULL,
    `isInternal` BOOLEAN NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Account_username_key`(`username`),
    UNIQUE INDEX `Account_email_key`(`email`),
    PRIMARY KEY (`userID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BusinessAssociate` (
    `userID` INTEGER NOT NULL,
    `entityID` INTEGER NOT NULL,

    INDEX `BusinessAssociate_entityID_idx`(`entityID`),
    UNIQUE INDEX `BusinessAssociate_userID_entityID_key`(`userID`, `entityID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExternalEntity` (
    `entityID` INTEGER NOT NULL AUTO_INCREMENT,
    `entityName` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`entityID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserQueue` (
    `userID` INTEGER NOT NULL,
    `docID` INTEGER NOT NULL,
    `queueStatus` ENUM('Draft', 'Review', 'Active', 'Inactive') NOT NULL,

    INDEX `UserQueue_docID_idx`(`docID`),
    UNIQUE INDEX `UserQueue_userID_docID_key`(`userID`, `docID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Document` (
    `docID` INTEGER NOT NULL AUTO_INCREMENT,
    `ownerID` INTEGER NOT NULL,
    `docType` ENUM('Nda', 'WorkingAgreement', 'MasterServiceAgreement') NOT NULL,
    `fileName` VARCHAR(191) NOT NULL,

    INDEX `Document_ownerID_idx`(`ownerID`),
    PRIMARY KEY (`docID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentMetadata` (
    `docID` INTEGER NOT NULL,
    `docName` VARCHAR(191) NOT NULL,
    `companyName` VARCHAR(191) NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `renewalType` BOOLEAN NOT NULL,

    UNIQUE INDEX `DocumentMetadata_docName_key`(`docName`),
    INDEX `DocumentMetadata_docID_idx`(`docID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DocumentHistory` (
    `docID` INTEGER NOT NULL,
    `userID` INTEGER NOT NULL,
    `changeType` ENUM('Deletion', 'Modification', 'Addition', 'Creation') NOT NULL,
    `changeDate` DATETIME(3) NOT NULL,

    INDEX `DocumentHistory_docID_idx`(`docID`),
    INDEX `DocumentHistory_userID_idx`(`userID`),
    UNIQUE INDEX `DocumentHistory_changeDate_key`(`changeDate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Workflows` (
    `workflowID` INTEGER NOT NULL AUTO_INCREMENT,
    `workflowName` VARCHAR(191) NOT NULL,
    `ownerID` INTEGER NOT NULL,
    `workflowStatus` INTEGER NOT NULL,

    INDEX `Workflows_ownerID_idx`(`ownerID`),
    UNIQUE INDEX `Workflows_workflowID_key`(`workflowID`),
    PRIMARY KEY (`workflowID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DocumentToWorkflows` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DocumentToWorkflows_AB_unique`(`A`, `B`),
    INDEX `_DocumentToWorkflows_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
