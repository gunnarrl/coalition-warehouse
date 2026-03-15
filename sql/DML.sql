-- Authors: Team 90 (Daniel Slay, Gunnar Larsen)
-- Course: CS340
-- Description: Coalition Warehouse Database Project DML queries
-- Queries match the SPs in PL.sql and the SELECT queries in app.js

-- Customers --
INSERT INTO Customers (customerFN, customerLN, customerEmail, customerAddr) VALUES
(:customerFN_Input, :customerLN_Input, :customerEmail_Input, :customerAddr_Input);

-- Read All Customers --
SELECT * FROM Customers;

-- Update --
UPDATE Customers SET customerFN = :customerFN_Input, customerLN = :customerLN_Input, customerEmail = :customerEmail_Input, customerAddr = :customerAddr_Input
WHERE customerID = :customerID_from_update_form;

-- Delete --
DELETE FROM Customers WHERE customerID = :customerID_selected_from_browse_customer_page;

-- Products --
-- Create --
INSERT INTO Products (productName, listCost) VALUES
(:productName_Input, :listCost_Input);

-- Read All Products--
SELECT * FROM Products;

-- Update --
UPDATE Products SET productName = :productName_Input, listCost = :listCost_Input WHERE productID = :productID_from_update_form;

-- Delete --
DELETE FROM Products WHERE productID = :productID_selected_from_browse_product_page;

-- Vendors --
-- Create --
INSERT INTO Vendors (vendorName, vendorAddr, vendorEmail) VALUES
(:vendorName_Input, :vendorAddr_Input, :vendorEmail_Input);

-- Read All Vendors --
SELECT * FROM Vendors;

-- Update --
UPDATE Vendors SET vendorName = :vendorName_Input, vendorAddr = :vendorAddr_Input, vendorEmail = :vendorEmail_Input
WHERE vendorID = :vendorID_from_update_form;

-- Delete --
DELETE FROM Vendors WHERE vendorID = :vendorID_selected_from_browse_vendor_page;

-- Warehouses --
-- Create --
INSERT INTO Warehouses (warehouseName, warehouseAddr) VALUES
(:warehouseName_Input, :warehouseAddr_Input);

-- Read All Warehouses --
SELECT Warehouses.warehouseID, Warehouses.warehouseName, Warehouses.warehouseAddr,
COALESCE(SUM(Inventory.quantity * Products.listCost), 0) AS totalInventoryCost
FROM Warehouses
LEFT JOIN Inventory ON Warehouses.warehouseID = Inventory.warehouseID
LEFT JOIN Products ON Inventory.productID = Products.productID
GROUP BY Warehouses.warehouseID;

-- Update Warehouse --
UPDATE Warehouses SET warehouseName = :warehouseName_Input, warehouseAddr = :warehouseAddr_Input
WHERE warehouseID = :warehouseID_from_update_form;

-- Delete Warehouse --
DELETE FROM Warehouses WHERE warehouseID = :warehouseID_selected_from_browse_warehouse_page;

-- PurchaseOrders --
-- Create Purchase Order --
INSERT INTO PurchaseOrders (vendorID, warehouseID, purchaseDate) VALUES
(:vendorID_Input, :warehouseID_Input, :purchaseDate_Input);

-- Read All Purchase Orders and Calculate Cost of Purchase --
SELECT PurchaseOrders.purchaseOrderID, PurchaseOrders.purchaseDate, Warehouses.warehouseID, Warehouses.warehouseName, Vendors.vendorID, Vendors.vendorName,
SUM(PurchaseOrderItems.quantity * PurchaseOrderItems.purchasePrice) AS costOfPurchase
FROM PurchaseOrders
JOIN Warehouses ON PurchaseOrders.warehouseID = Warehouses.warehouseID
JOIN Vendors ON PurchaseOrders.vendorID = Vendors.vendorID
LEFT JOIN PurchaseOrderItems ON PurchaseOrders.purchaseOrderID = PurchaseOrderItems.purchaseOrderID
GROUP BY PurchaseOrders.purchaseOrderID;

-- Update Purchase Order --
UPDATE PurchaseOrders SET vendorID = :vendorID_Input, warehouseID = :warehouseID_Input, purchaseDate = :purchaseDate_Input
WHERE purchaseOrderID = :purchaseOrderID_from_update_form;

-- Delete Purchase Order --
DELETE FROM PurchaseOrders WHERE purchaseOrderID = :purchaseOrderID_selected_from_browse_purchaseOrder_page;

-- PurchaseOrderItems --
-- Read All Purchase Order Items --
SELECT PurchaseOrderItems.purchaseOrderItemID, PurchaseOrderItems.purchaseOrderID, PurchaseOrderItems.productID, PurchaseOrderItems.quantity,
PurchaseOrderItems.purchasePrice, Products.productName, PurchaseOrders.warehouseID
FROM PurchaseOrderItems
JOIN Products ON PurchaseOrderItems.productID = Products.productID
JOIN PurchaseOrders ON PurchaseOrderItems.purchaseOrderID = PurchaseOrders.purchaseOrderID;

-- Create Purchase Order Item --
INSERT INTO PurchaseOrderItems (purchaseOrderID, productID, quantity, purchasePrice) VALUES
(:purchaseOrderID_Input, :productID_Input, :quantity_Input, :purchasePrice_Input);

-- Update Purchase Order Item --
UPDATE PurchaseOrderItems SET productID = :productID_Input, quantity = :quantity_Input, purchasePrice = :purchasePrice_Input
WHERE purchaseOrderItemID = :purchaseOrderItemID_from_update_form;

-- Delete Purchase Order Item --
DELETE FROM PurchaseOrderItems WHERE purchaseOrderItemID = :purchaseOrderItemID_selected;

-- SalesOrders --
-- Create Sales Order --
INSERT INTO SalesOrders (customerID, warehouseID, saleDate) VALUES
(:customerID_Input, :warehouseID_Input, :saleDate_Input);

-- Read All Sales Orders and Calculate Cost of Sale --
SELECT SalesOrders.saleOrderID, SalesOrders.saleDate, Warehouses.warehouseID, Warehouses.warehouseName, Customers.customerID, Customers.customerLN, Customers.customerFN, Customers.customerAddr, Customers.customerEmail,
SUM(SalesOrderItems.quantity * SalesOrderItems.salePrice) AS costOfSale
FROM SalesOrders
JOIN Customers ON SalesOrders.customerID = Customers.customerID
JOIN Warehouses ON SalesOrders.warehouseID = Warehouses.warehouseID
LEFT JOIN SalesOrderItems ON SalesOrders.saleOrderID = SalesOrderItems.saleOrderID
GROUP BY SalesOrders.saleOrderID;

-- Update Sales Order --
UPDATE SalesOrders SET customerID = :customerID_Input, warehouseID = :warehouseID_Input, saleDate = :saleDate_Input
WHERE saleOrderID = :saleOrderID_from_update_form;

-- Delete Sales Order --
DELETE FROM SalesOrders WHERE saleOrderID = :saleOrderID_selected_from_browse_salesorders_page;

-- SalesOrderItems --
-- Read All Sales Order Items --
SELECT SalesOrderItems.saleOrderItemID, SalesOrderItems.saleOrderID, SalesOrderItems.productID, SalesOrderItems.quantity,
SalesOrderItems.salePrice, Products.productName, SalesOrders.warehouseID
FROM SalesOrderItems
JOIN Products ON SalesOrderItems.productID = Products.productID
JOIN SalesOrders ON SalesOrderItems.saleOrderID = SalesOrders.saleOrderID;

-- Create Sales Order Item --
INSERT INTO SalesOrderItems (saleOrderID, productID, quantity, salePrice) VALUES
(:saleOrderID_Input, :productID_Input, :quantity_Input, :salePrice_Input);

-- Update Sales Order Item --
UPDATE SalesOrderItems SET productID = :productID_Input, quantity = :quantity_Input, salePrice = :salePrice_Input
WHERE saleOrderItemID = :saleOrderItemID_from_update_form;

-- Delete Sales Order Item --
DELETE FROM SalesOrderItems WHERE saleOrderItemID = :saleOrderItemID_selected;

-- VendorProducts (Catalog) --
-- Read All Vendor Catalog Items --
SELECT VendorProducts.vendorProductID, Vendors.vendorID, Vendors.vendorName, Products.productID, Products.productName, VendorProducts.costFromVendor
FROM VendorProducts
JOIN Vendors ON VendorProducts.vendorID = Vendors.vendorID
JOIN Products on VendorProducts.productID = Products.productID;

-- Create Vendor Catalog Item --
INSERT INTO VendorProducts (vendorID, productID, costFromVendor) VALUES
(:vendorID_Input, :productID_Input, :costFromVendor_Input);

-- Update Vendor Catalog Item --
UPDATE VendorProducts SET vendorID = :vendorID_Input, productID = :productID_Input, costFromVendor = :costFromVendor_Input
WHERE vendorProductID = :vendorProductID_from_update_form;

-- Delete Vendor Catalog Item --
DELETE FROM VendorProducts WHERE vendorProductID = :vendorProductID_selected;

-- Inventory --
-- Read All Inventory Items --
SELECT Warehouses.warehouseID, Products.productID, Inventory.inventoryID, Products.productName, Inventory.quantity, Products.listCost
FROM Inventory
JOIN Products ON Inventory.productID = Products.productID
JOIN Warehouses ON Inventory.warehouseID = Warehouses.warehouseID;

-- Create Inventory Item --
INSERT INTO Inventory (productID, warehouseID, quantity) VALUES
(:productID_Input, :warehouseID_Input, :quantity_Input);

-- Update Inventory Item --
UPDATE Inventory SET quantity = :quantity_Input
WHERE inventoryID = :inventoryID_from_update_form;

-- Delete Inventory Item --
DELETE FROM Inventory WHERE inventoryID = :inventoryID_selected;

-- Reset Database --
CALL sp_load_coalitiondb();
