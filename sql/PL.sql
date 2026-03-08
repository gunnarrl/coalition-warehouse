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

-- SALES ORDER SPs --
DROP PROCEDURE IF EXISTS DeleteSalesOrder;

DELIMITER //
CREATE PROCEDURE DeleteSalesOrder(IN in_saleOrderID INT)
BEGIN
    DELETE FROM SalesOrders WHERE saleOrderID = in_saleOrderID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS AddSalesOrder;

DELIMITER //
CREATE PROCEDURE AddSalesOrder(IN in_customerID INT, IN in_warehouseID INT, IN in_saleDate DATE)
BEGIN
    INSERT INTO SalesOrders (customerID, warehouseID, saleDate) VALUES (in_customerID, in_warehouseID, in_saleDate);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateSalesOrder;

DELIMITER //
CREATE PROCEDURE UpdateSalesOrder(IN in_saleOrderID INT, IN in_customerID INT, IN in_warehouseID INT, IN in_saleDate DATE)
BEGIN
    UPDATE SalesOrders SET customerID = in_customerID, warehouseID = in_warehouseID, saleDate = in_saleDate WHERE saleOrderID = in_saleOrderID;
END //
DELIMITER ;

-- SALES ORDER ITEMS SPs --
DROP PROCEDURE IF EXISTS DeleteSalesOrderItem;

DELIMITER //
CREATE PROCEDURE DeleteSalesOrderItem(IN in_saleOrderItemID INT)
BEGIN
    DELETE FROM SalesOrderItems WHERE saleOrderItemID = in_saleOrderItemID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS AddSalesOrderItem;

DELIMITER //
CREATE PROCEDURE AddSalesOrderItem(IN in_saleOrderID INT, IN in_productID INT, IN in_quantity INT, IN in_salePrice DECIMAL(10,2))
BEGIN
    INSERT INTO SalesOrderItems (saleOrderID, productID, quantity, salePrice) VALUES (in_saleOrderID, in_productID, in_quantity, in_salePrice);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateSalesOrderItem;

DELIMITER //
CREATE PROCEDURE UpdateSalesOrderItem(IN in_saleOrderItemID INT, IN in_productID INT, IN in_quantity INT, IN in_salePrice DECIMAL(10,2))
BEGIN
    UPDATE SalesOrderItems SET productID = in_productID, quantity = in_quantity, salePrice = in_salePrice WHERE saleOrderItemID = in_saleOrderItemID;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS UpdateInventoryAfterSale;

DELIMITER //
CREATE TRIGGER UpdateInventoryAfterSale
AFTER INSERT ON SalesOrderItems
FOR EACH ROW
BEGIN
    DECLARE v_warehouseID INT;
    
    -- Look up the warehouse associated with this sale order
    SELECT warehouseID INTO v_warehouseID 
    FROM SalesOrders 
    WHERE saleOrderID = NEW.saleOrderID;
    -- Update the inventory for that specific warehouse + product
    UPDATE Inventory 
    SET quantity = quantity - NEW.quantity 
    WHERE productID = NEW.productID 
      AND warehouseID = v_warehouseID;
END //
DELIMITER ;

