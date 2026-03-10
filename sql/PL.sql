-- Authors: Team 90
-- Course: CS340
-- Description: Coalition Warehouse Database Project
-- Stored Procedures for CUD Operations

-- Delete Premium Keyboard from Products
-- Verify the Reset button works as intended

-- WAREHOUSE SPs --
DROP PROCEDURE IF EXISTS sp_add_warehouse;
DELIMITER //
CREATE PROCEDURE sp_add_warehouse(IN in_warehouseName VARCHAR(255), IN in_warehouseAddr VARCHAR(255))
BEGIN
    INSERT INTO Warehouses(warehouseName, warehouseAddr) VALUES (in_warehouseName, in_warehouseAddr);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_warehouse;
DELIMITER //
CREATE PROCEDURE sp_update_warehouse(IN in_warehouseID INT, IN in_warehouseName VARCHAR(255), IN in_warehouseAddr VARCHAR(255))
BEGIN
    UPDATE Warehouses SET warehouseName = in_warehouseName, warehouseAddr = in_warehouseAddr WHERE warehouseID = in_warehouseID;
END // 
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_delete_warehouse;
DELIMITER //
CREATE PROCEDURE sp_delete_warehouse(IN in_warehouseID INT)
BEGIN
    DELETE FROM Warehouses WHERE warehouseID = in_warehouseID;
END //
DELIMITER ;

-- WAREHOUSE-INVENTORY SPs --
DROP PROCEDURE IF EXISTS sp_add_inventory;
DELIMITER //
CREATE PROCEDURE sp_add_inventory(IN in_productID INT, IN in_warehouseID INT, IN in_quantity INT)
BEGIN
    INSERT INTO Inventory(productID, warehouseID, quantity) VALUES (in_productID, in_warehouseID, in_quantity);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_inventory;
DELIMITER //
CREATE PROCEDURE sp_update_inventory(IN in_inventoryID INT, IN in_quantity INT)
BEGIN 
    UPDATE Inventory SET quantity = in_quantity WHERE inventoryID = in_inventoryID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_delete_inventory;
DELIMITER //
CREATE PROCEDURE sp_delete_inventory(IN in_inventoryID INT)
BEGIN
    DELETE FROM Inventory WHERE inventoryID = in_inventoryID;
END //
DELIMITER ;

-- PRODUCTS SPs --
DROP PROCEDURE IF EXISTS sp_delete_product;

DELIMITER //
CREATE PROCEDURE sp_delete_product(IN in_productID INT)
BEGIN
    DELETE FROM Products WHERE productID = in_productID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_add_product;

DELIMITER //
CREATE PROCEDURE sp_add_product(IN in_productName VARCHAR(255), IN in_listCost DECIMAL(10,2))
BEGIN
    INSERT INTO Products (productName, listCost) VALUES (in_productName, in_listCost);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_product;

DELIMITER //
CREATE PROCEDURE sp_update_product(IN in_productID INT, IN in_productName VARCHAR(255), IN in_listCost DECIMAL(10,2))
BEGIN
    UPDATE Products SET productName = in_productName, listCost = in_listCost WHERE productID = in_productID;
END //
DELIMITER ;

-- CUSTOMER SPs --
DROP PROCEDURE IF EXISTS sp_delete_customer;

DELIMITER //
CREATE PROCEDURE sp_delete_customer(IN in_customerID INT)
BEGIN
    DELETE FROM Customers WHERE customerID = in_customerID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_add_customer;

DELIMITER //
CREATE PROCEDURE sp_add_customer(IN in_customerfName VARCHAR(255), IN in_customerlName VARCHAR(255), IN in_customerEmail VARCHAR(255), IN in_customerAddr VARCHAR(255))
BEGIN
    INSERT INTO Customers (customerFN, customerLN, customerEmail, customerAddr) VALUES (in_customerfName, in_customerlName, in_customerEmail, in_customerAddr);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_customer;

DELIMITER //
CREATE PROCEDURE sp_update_customer(IN in_customerID INT, IN in_customerfName VARCHAR(255), IN in_customerlName VARCHAR(255), IN in_customerEmail VARCHAR(255), IN in_customerAddr VARCHAR(255))
BEGIN
    UPDATE Customers SET customerFN = in_customerfName, customerLN = in_customerlName, customerEmail = in_customerEmail, customerAddr = in_customerAddr WHERE customerID = in_customerID;
END //
DELIMITER ;

-- SALES ORDER SPs --
DROP PROCEDURE IF EXISTS sp_delete_sales_order;

DELIMITER //
CREATE PROCEDURE sp_delete_sales_order(IN in_saleOrderID INT)
BEGIN
    DELETE FROM SalesOrders WHERE saleOrderID = in_saleOrderID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_add_sales_order;

DELIMITER //
CREATE PROCEDURE sp_add_sales_order(IN in_customerID INT, IN in_warehouseID INT, IN in_saleDate DATE)
BEGIN
    INSERT INTO SalesOrders (customerID, warehouseID, saleDate) VALUES (in_customerID, in_warehouseID, in_saleDate);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_sales_order;

DELIMITER //
CREATE PROCEDURE sp_update_sales_order(IN in_saleOrderID INT, IN in_customerID INT, IN in_warehouseID INT, IN in_saleDate DATE)
BEGIN
    UPDATE SalesOrders SET customerID = in_customerID, warehouseID = in_warehouseID, saleDate = in_saleDate WHERE saleOrderID = in_saleOrderID;
END //
DELIMITER ;

-- SALES ORDER ITEMS SPs --
DROP PROCEDURE IF EXISTS sp_delete_sales_orderItem;

DELIMITER //
CREATE PROCEDURE sp_delete_sales_orderItem(IN in_saleOrderItemID INT)
BEGIN
    DELETE FROM SalesOrderItems WHERE saleOrderItemID = in_saleOrderItemID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_add_sales_orderItem;

DELIMITER //
CREATE PROCEDURE sp_add_sales_orderItem(IN in_saleOrderID INT, IN in_productID INT, IN in_quantity INT, IN in_salePrice DECIMAL(10,2))
BEGIN
    INSERT INTO SalesOrderItems (saleOrderID, productID, quantity, salePrice) VALUES (in_saleOrderID, in_productID, in_quantity, in_salePrice);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_sales_orderItem;

DELIMITER //
CREATE PROCEDURE sp_update_sales_orderItem(IN in_saleOrderItemID INT, IN in_productID INT, IN in_quantity INT, IN in_salePrice DECIMAL(10,2))
BEGIN
    UPDATE SalesOrderItems SET productID = in_productID, quantity = in_quantity, salePrice = in_salePrice WHERE saleOrderItemID = in_saleOrderItemID;
END //
DELIMITER ;

-- PURCHASES SPs -- (basically the same as sales orders, but with purchases)
DROP PROCEDURE IF EXISTS sp_delete_purchase_order;

DELIMITER //
CREATE PROCEDURE sp_delete_purchase_order(IN in_purchaseOrderID INT)
BEGIN
    DELETE FROM PurchaseOrders WHERE purchaseOrderID = in_purchaseOrderID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_add_purchase_order;

DELIMITER //
CREATE PROCEDURE sp_add_purchase_order(IN in_vendorID INT, IN in_warehouseID INT, IN in_purchaseDate DATE)
BEGIN
    INSERT INTO PurchaseOrders (vendorID, warehouseID, purchaseDate) VALUES (in_vendorID, in_warehouseID, in_purchaseDate);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_purchase_order;

DELIMITER //
CREATE PROCEDURE sp_update_purchase_order(IN in_purchaseOrderID INT, IN in_vendorID INT, IN in_warehouseID INT, IN in_purchaseDate DATE)
BEGIN
    UPDATE PurchaseOrders SET vendorID = in_vendorID, warehouseID = in_warehouseID, purchaseDate = in_purchaseDate WHERE purchaseOrderID = in_purchaseOrderID;
END //
DELIMITER ;

-- PURCHASE ORDER ITEMS SPs -- (basically the same as sales order items, but with purchases)
DROP PROCEDURE IF EXISTS sp_delete_purchase_orderItem;

DELIMITER //
CREATE PROCEDURE sp_delete_purchase_orderItem(IN in_purchaseOrderItemID INT)
BEGIN
    DELETE FROM PurchaseOrderItems WHERE purchaseOrderItemID = in_purchaseOrderItemID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_add_purchase_orderItem;

DELIMITER //
CREATE PROCEDURE sp_add_purchase_orderItem(IN in_purchaseOrderID INT, IN in_productID INT, IN in_quantity INT, IN in_purchasePrice DECIMAL(10,2))
BEGIN
    INSERT INTO PurchaseOrderItems (purchaseOrderID, productID, quantity, purchasePrice) VALUES (in_purchaseOrderID, in_productID, in_quantity, in_purchasePrice);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_purchase_orderItem;

DELIMITER //
CREATE PROCEDURE sp_update_purchase_orderItem(IN in_purchaseOrderItemID INT, IN in_productID INT, IN in_quantity INT, IN in_purchasePrice DECIMAL(10,2))
BEGIN
    UPDATE PurchaseOrderItems SET productID = in_productID, quantity = in_quantity, purchasePrice = in_purchasePrice WHERE purchaseOrderItemID = in_purchaseOrderItemID;
END //
DELIMITER ;

-- VENDOR SPs --
DROP PROCEDURE IF EXISTS sp_add_vendor;

DELIMITER //
CREATE PROCEDURE sp_add_vendor(IN in_vendorName VARCHAR(255), IN in_vendorAddr VARCHAR(255), IN in_vendorEmail VARCHAR(255))
BEGIN
    INSERT INTO Vendors (vendorName, vendorAddr, vendorEmail) VALUES (in_vendorName, in_vendorAddr, in_vendorEmail);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_vendor;

DELIMITER //
CREATE PROCEDURE sp_update_vendor(IN in_vendorID INT, IN in_vendorName VARCHAR(255), IN in_vendorAddr VARCHAR(255), IN in_vendorEmail VARCHAR(255))
BEGIN
    UPDATE Vendors SET vendorName = in_vendorName, vendorAddr = in_vendorAddr, vendorEmail = in_vendorEmail WHERE vendorID = in_vendorID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_delete_vendor;

DELIMITER //
CREATE PROCEDURE sp_delete_vendor(IN in_vendorID INT)
BEGIN
    DELETE FROM Vendors WHERE vendorID = in_vendorID;
END //
DELIMITER ;

-- CATALOG (VendorProducts) SPs --

DROP PROCEDURE IF EXISTS sp_add_vendorProduct;

DELIMITER //
CREATE PROCEDURE sp_add_vendorProduct(IN in_vendorID INT, IN in_productID INT, IN in_costFromVendor DECIMAL(10,2))
BEGIN
    INSERT INTO VendorProducts (vendorID, productID, costFromVendor) VALUES (in_vendorID, in_productID, in_costFromVendor);
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_update_vendorProduct;

DELIMITER //
CREATE PROCEDURE sp_update_vendorProduct(IN in_vendorProductID INT, IN in_vendorID INT, IN in_productID INT, IN in_costFromVendor DECIMAL(10,2))
BEGIN
    UPDATE VendorProducts SET vendorID = in_vendorID, productID = in_productID, costFromVendor = in_costFromVendor WHERE vendorProductID = in_vendorProductID;
END //
DELIMITER ;

DROP PROCEDURE IF EXISTS sp_delete_vendorProduct;

DELIMITER //
CREATE PROCEDURE sp_delete_vendorProduct(IN in_vendorProductID INT)
BEGIN
    DELETE FROM VendorProducts WHERE vendorProductID = in_vendorProductID;
END //
DELIMITER ;
