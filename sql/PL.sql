-- Authors: Team 90
-- Course: CS340
-- Description: Coalition Warehouse Database Project
-- Stored Procedures for CUD Operations

-- Delete Premium Keyboard from Products
-- Verify the Reset button works as intended

-- PRODUCTS SPs --
DROP PROCEDURE IF EXISTS DeleteProduct;

DELIMITER //
CREATE PROCEDURE DeleteProduct(IN in_productID INT)
BEGIN
    DELETE FROM Products WHERE productID = in_productID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS AddProduct;

DELIMITER //
CREATE PROCEDURE AddProduct(IN in_productName VARCHAR(255), IN in_listCost DECIMAL(10,2))
BEGIN
    INSERT INTO Products (productName, listCost) VALUES (in_productName, in_listCost);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateProduct;

DELIMITER //
CREATE PROCEDURE UpdateProduct(IN in_productID INT, IN in_productName VARCHAR(255), IN in_listCost DECIMAL(10,2))
BEGIN
    UPDATE Products SET productName = in_productName, listCost = in_listCost WHERE productID = in_productID;
END //
DELIMITER ;

-- CUSTOMER SPs --
DROP PROCEDURE IF EXISTS DeleteCustomer;

DELIMITER //
CREATE PROCEDURE DeleteCustomer(IN in_customerID INT)
BEGIN
    DELETE FROM Customers WHERE customerID = in_customerID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS AddCustomer;

DELIMITER //
CREATE PROCEDURE AddCustomer(IN in_customerfName VARCHAR(255), IN in_customerlName VARCHAR(255), IN in_customerEmail VARCHAR(255), IN in_customerAddr VARCHAR(255))
BEGIN
    INSERT INTO Customers (customerFN, customerLN, customerEmail, customerAddr) VALUES (in_customerfName, in_customerlName, in_customerEmail, in_customerAddr);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateCustomer;

DELIMITER //
CREATE PROCEDURE UpdateCustomer(IN in_customerID INT, IN in_customerfName VARCHAR(255), IN in_customerlName VARCHAR(255), IN in_customerEmail VARCHAR(255), IN in_customerAddr VARCHAR(255))
BEGIN
    UPDATE Customers SET customerFN = in_customerfName, customerLN = in_customerlName, customerEmail = in_customerEmail, customerAddr = in_customerAddr WHERE customerID = in_customerID;
END //
DELIMITER ;
