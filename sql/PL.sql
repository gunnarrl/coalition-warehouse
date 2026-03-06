-- Authors: Team 90
-- Course: CS340
-- Description: Coalition Warehouse Database Project
-- Stored Procedures for CUD Operations

-- Delete Premium Keyboard from Products
-- Verify the Reset button works as intended

-- PRODUCTS SPs --
DROP PROCEDURE IF EXISTS DeleteProduct;

DELIMITER //
CREATE PROCEDURE DeleteProduct(IN p_productID INT)
BEGIN
    DELETE FROM Products WHERE productID = p_productID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS AddProduct;

DELIMITER //
CREATE PROCEDURE AddProduct(IN p_productName VARCHAR(255), IN p_listCost DECIMAL(10,2))
BEGIN
    INSERT INTO Products (productName, listCost) VALUES (p_productName, p_listCost);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateProduct;

DELIMITER //
CREATE PROCEDURE UpdateProduct(IN p_productID INT, IN p_productName VARCHAR(255), IN p_listCost DECIMAL(10,2))
BEGIN
    UPDATE Products SET productName = p_productName, listCost = p_listCost WHERE productID = p_productID;
END //
DELIMITER ;

-- CUSTOMER SPs --
DROP PROCEDURE IF EXISTS DeleteCustomer;

DELIMITER //
CREATE PROCEDURE DeleteCustomer(IN p_customerID INT)
BEGIN
    DELETE FROM Customers WHERE customerID = p_customerID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS AddCustomer;

DELIMITER //
CREATE PROCEDURE AddCustomer(IN p_customerfName VARCHAR(255), IN p_customerlName VARCHAR(255), IN p_customerEmail VARCHAR(255), IN p_customerAddr VARCHAR(255))
BEGIN
    INSERT INTO Customers (customerfName, customerlName, customerEmail, customerAddr) VALUES (p_customerfName, p_customerlName, p_customerEmail, p_customerAddr);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateCustomer;

DELIMITER //
CREATE PROCEDURE UpdateCustomer(IN p_customerID INT, IN p_customerfName VARCHAR(255), IN p_customerlName VARCHAR(255), IN p_customerEmail VARCHAR(255), IN p_customerAddr VARCHAR(255))
BEGIN
    UPDATE Customers SET customerfName = p_customerfName, customerlName = p_customerlName, customerEmail = p_customerEmail, customerAddr = p_customerAddr WHERE customerID = p_customerID;
END //
DELIMITER ;
