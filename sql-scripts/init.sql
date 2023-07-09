CREATE DATABASE IF NOT EXISTS identity_reconciliation;
USE identity_reconciliation;

CREATE TABLE contacts (
    id INT NOT NULL AUTO_INCREMENT,
    phoneNumber VARCHAR(10) NOT NULL,
    email VARCHAR(255) NOT NULL,
    linkedId INT,
    linkPrecedence ENUM('primary', 'secondary') NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME,
    PRIMARY KEY (id),
    FOREIGN KEY (linkedId) REFERENCES contacts(id)
);
