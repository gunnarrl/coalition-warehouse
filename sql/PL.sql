-- Authors: Team 90
-- Course: CS340
-- Description: Coalition Warehouse Database Project
-- Stored Procedures for CUD Operations

-- Delete Premium Keyboard from Products
-- Verify the Reset button works as intended
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
