-- Authors: Team 90
-- Course: CS340
-- Description: Coalition Warehouse Database Project
-- Stored Procedures for CUD Operations

-- Delete Premium Keyboard from Products
-- Verify the Reset button works as intended

-- WAREHOUSE SPs --
DROP PROCEDURE IF EXISTS AddWarehouse;
DELIMITER //
CREATE PROCEDURE AddWarehouse(IN in_warehouseName VARCHAR(255), IN in_warehouseAddr VARCHAR(255))
BEGIN
    INSERT INTO Warehouses(warehouseName, warehouseAddr) VALUES (in_warehouseName, in_warehouseAddr);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateWarehouse;
DELIMITER //
CREATE PROCEDURE UpdateWarehouse(IN in_warehouseID INT, IN in_warehouseName VARCHAR(255), IN in_warehouseAddr VARCHAR(255))
BEGIN
    UPDATE Warehouses SET warehouseName = in_warehouseName, warehouseAddr = in_warehouseAddr WHERE warehouseID = in_warehouseID;
END // 
DELIMITER ;

DROP PROCEDURE IF EXISTS DeleteWarehouse;
DELIMITER //
CREATE PROCEDURE DeleteWarehouse(IN in_warehouseID INT)
BEGIN
    DELETE FROM Warehouses WHERE warehouseID = in_warehouseID;
END //
DELIMITER ;

-- WAREHOUSE-INVENTORY SPs --
DROP PROCEDURE IF EXISTS AddInventory;
DELIMITER //
CREATE PROCEDURE AddInventory(IN in_productID INT, IN in_warehouseID INT, IN in_quantity INT)
BEGIN
    INSERT INTO Inventory(productID, warehouseID, quantity) VALUES (in_productID, in_warehouseID, in_quantity);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdateInventory;
DELIMITER //
CREATE PROCEDURE UpdateInventory(IN in_productID INT, IN in_warehouseID INT, IN in_quantity INT)
BEGIN 
    UPDATE Inventory SET quantity = in_quantity WHERE warehouseID = in_warehouseID AND productID = in_productID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS DeleteInventory;
DELIMITER //
CREATE PROCEDURE DeleteInventory(IN in_productID INT, IN in_warehouseID INT)
BEGIN
    DELETE FROM Inventory WHERE warehouseID = in_warehouseID AND productID = in_productID;
END //
DELIMITER ;

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
    DECLARE _warehouseID INT;
    
    -- Look up the warehouse associated with this sale order
    SELECT warehouseID INTO _warehouseID 
    FROM SalesOrders 
    WHERE saleOrderID = NEW.saleOrderID;
    -- Update the inventory for that specific warehouse + product
    UPDATE Inventory 
    SET quantity = quantity - NEW.quantity 
    WHERE productID = NEW.productID 
      AND warehouseID = _warehouseID;
END //
DELIMITER ;

-- PURCHASES SPs -- (basically the same as sales orders, but with purchases)
DROP PROCEDURE IF EXISTS DeletePurchaseOrder;

DELIMITER //
CREATE PROCEDURE DeletePurchaseOrder(IN in_purchaseOrderID INT)
BEGIN
    DELETE FROM PurchaseOrders WHERE purchaseOrderID = in_purchaseOrderID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS AddPurchaseOrder;

DELIMITER //
CREATE PROCEDURE AddPurchaseOrder(IN in_vendorID INT, IN in_warehouseID INT, IN in_purchaseDate DATE)
BEGIN
    INSERT INTO PurchaseOrders (vendorID, warehouseID, purchaseDate) VALUES (in_vendorID, in_warehouseID, in_purchaseDate);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdatePurchaseOrder;

DELIMITER //
CREATE PROCEDURE UpdatePurchaseOrder(IN in_purchaseOrderID INT, IN in_vendorID INT, IN in_warehouseID INT, IN in_purchaseDate DATE)
BEGIN
    UPDATE PurchaseOrders SET vendorID = in_vendorID, warehouseID = in_warehouseID, purchaseDate = in_purchaseDate WHERE purchaseOrderID = in_purchaseOrderID;
END //
DELIMITER ;

-- PURCHASE ORDER ITEMS SPs -- (basically the same as sales order items, but with purchases)
DROP PROCEDURE IF EXISTS DeletePurchaseOrderItem;

DELIMITER //
CREATE PROCEDURE DeletePurchaseOrderItem(IN in_purchaseOrderItemID INT)
BEGIN
    DELETE FROM PurchaseOrderItems WHERE purchaseOrderItemID = in_purchaseOrderItemID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS AddPurchaseOrderItem;

DELIMITER //
CREATE PROCEDURE AddPurchaseOrderItem(IN in_purchaseOrderID INT, IN in_productID INT, IN in_quantity INT, IN in_purchasePrice DECIMAL(10,2))
BEGIN
    INSERT INTO PurchaseOrderItems (purchaseOrderID, productID, quantity, purchasePrice) VALUES (in_purchaseOrderID, in_productID, in_quantity, in_purchasePrice);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS UpdatePurchaseOrderItem;

DELIMITER //
CREATE PROCEDURE UpdatePurchaseOrderItem(IN in_purchaseOrderItemID INT, IN in_productID INT, IN in_quantity INT, IN in_purchasePrice DECIMAL(10,2))
BEGIN
    UPDATE PurchaseOrderItems SET productID = in_productID, quantity = in_quantity, purchasePrice = in_purchasePrice WHERE purchaseOrderItemID = in_purchaseOrderItemID;
END //
DELIMITER ;

DROP TRIGGER IF EXISTS UpdateInventoryAfterPurchase;

DELIMITER //
CREATE TRIGGER UpdateInventoryAfterPurchase
AFTER INSERT ON PurchaseOrderItems
FOR EACH ROW
BEGIN
    DECLARE _warehouseID INT;
    
    -- Look up the warehouse associated with this purchase order
    SELECT warehouseID INTO _warehouseID 
    FROM PurchaseOrders 
    WHERE purchaseOrderID = NEW.purchaseOrderID;
    -- Update the inventory for that specific warehouse + product
    UPDATE Inventory 
    SET quantity = quantity + NEW.quantity 
    WHERE productID = NEW.productID 
      AND warehouseID = _warehouseID;
END //
DELIMITER ;

