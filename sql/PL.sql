-- Authors: Team 90
-- Course: CS340
-- Description: Coalition Warehouse Database Project
-- Stored Procedures for CUD Operations

-- Delete Premium Keyboard from Products
-- Verify the Reset button works as intended
DROP PROCEDURE IF EXISTS DeletePremiumKeyboard;

DELIMITER //
CREATE PROCEDURE DeletePremiumKeyboard()
BEGIN
    DELETE FROM Products WHERE productName = 'Premium Keyboard 591';
END //
DELIMITER ;
