/* Authors: Team 90 (Daniel Slay, Gunnar Larsen)
   Course: CS340
   Description: Coalition Warehouse Database Project
*/
-- RESET DATABASE BUTTON --
-- -----------------------------------------------------------------------------
-- DROP TABLES --
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `Products`;
DROP TABLE IF EXISTS `Vendors`;
DROP TABLE IF EXISTS `Warehouses`;
DROP TABLE IF EXISTS `Customers`;
DROP TABLE IF EXISTS `SalesOrders`;
DROP TABLE IF EXISTS `PurchaseOrders`;
DROP TABLE IF EXISTS `Inventory`;
DROP TABLE IF EXISTS `VendorProducts`;
DROP TABLE IF EXISTS `PurchaseOrderItems`;
DROP TABLE IF EXISTS `SalesOrderItems`;


-- CREATE TABLES --
-- ENTITY TABLES
-- ----------------------------------------------------------------------------
-- Create table [Products]: Records product information stocked by Coalition Warehouse LLC 
CREATE TABLE `Products` (
 `productID` 		int(11) AUTO_INCREMENT UNIQUE NOT NULL,
 `productName`  	varchar(255) NOT NULL,
 `listCost` 		decimal(10,2) NOT NULL,
 PRIMARY KEY (`productID`)
 );
 
 -- Create table [Vendors]: Records the vendors Coalition Warehouse LLC gets products from
 CREATE TABLE `Vendors` (
  `vendorID`		int(11) AUTO_INCREMENT UNIQUE NOT NULL,
  `vendorName`		varchar(255) NOT NULL,
  `vendorAddr`		varchar(255),
  `vendorEmail` 	varchar(255),
PRIMARY KEY (`vendorID`)
); 

-- Create table [Warehouses]: Records the warehouses owned by Coalition Warehouse LLC
CREATE TABLE `Warehouses` (
 `warehouseID`		int(11) AUTO_INCREMENT UNIQUE NOT NULL,
 `warehouseName`	varchar(255) NOT NULL,
 `warehouseAddr`	varchar(255),
PRIMARY KEY (`warehouseID`)
);

-- Create table [Customers]: Records personal and contact information of customers of Coalition Warehouse LLC
CREATE TABLE `Customers` (
 `customerID`		int(11) AUTO_INCREMENT UNIQUE NOT NULL,
 `customerLN`		varchar(255) NOT NULL,
 `customerFN`		varchar(255) NOT NULL,
 `customerAddr`		varchar(255) NOT NULL,
 `customerEmail`	varchar(255),
PRIMARY KEY (`customerID`)
);
-- -----------------------------------------------------------------------------------

-- TRANSACTION TABLES 
-- -----------------------------------------------------------------------------------
-- Create table [SalesOrders]: Records individual sales by Coalition Warehouse LLC to customers
CREATE TABLE `SalesOrders` (
 `saleOrderID`		int(11) AUTO_INCREMENT UNIQUE NOT NULL,
 `customerID` 		int(11) NULL,
 `warehouseID`		int(11) NULL,
 `saleDate`			DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
PRIMARY KEY (`saleOrderID`),
CONSTRAINT FK_SalesOrders_customerID FOREIGN KEY (`customerID`) 
REFERENCES `Customers` (`customerID`)
ON DELETE CASCADE,
CONSTRAINT FK_SalesOrders_warehouseID FOREIGN KEY (`warehouseID`) 
REFERENCES `Warehouses` (`warehouseID`)
ON DELETE SET NULL
);

-- Create table [PurchaseOrders]: Records purchases from vendors by Coalition Warehouse LLC to restock inventory
CREATE TABLE `PurchaseOrders` (
 `purchaseOrderID`	int(11) AUTO_INCREMENT UNIQUE NOT NULL,
 `vendorID`			int(11) NULL,
 `warehouseID`		int(11) NULL,
 `purchaseDate`		DATE DEFAULT CURRENT_TIMESTAMP NOT NULL,
PRIMARY KEY (`purchaseOrderID`),
CONSTRAINT FK_PurchaseOrders_vendorID FOREIGN KEY (`vendorID`)
REFERENCES `Vendors` (`vendorID`)
ON DELETE SET NULL,
CONSTRAINT FK_PurchaseOrders_warehouseID FOREIGN KEY (`warehouseID`)
REFERENCES `Warehouses` (`warehouseID`)
ON DELETE SET NULL
);
-- -------------------------------------------------------------------

-- INTERSECTION TABLES
-- -------------------------------------------------------------------
-- Create table [Inventory]: Records the quantity of a specific product stored at a specific warehouse
CREATE TABLE `Inventory` (
 `inventoryID`		int(11) AUTO_INCREMENT UNIQUE NOT NULL,
 `productID`		int(11) NOT NULL,
 `warehouseID`		int(11) NOT NULL,
 `quantity`			int(11) NOT NULL, 
PRIMARY KEY (`inventoryID`),
CONSTRAINT FK_Inventory_productID FOREIGN KEY (`productID`)
REFERENCES `Products` (`productID`)
ON DELETE CASCADE,
CONSTRAINT FK_Inventory_warehouseID FOREIGN KEY (`warehouseID`)
REFERENCES `Warehouses` (`warehouseID`)
ON DELETE CASCADE,
CONSTRAINT Inventory_Details UNIQUE (`productID`, `warehouseID`)
);

-- Create table [VendorProducts]: Records which products are supplied by which vendors and the associated wholesale cost 
CREATE TABLE `VendorProducts` (
 `vendorProductID`	int(11) AUTO_INCREMENT UNIQUE NOT NULL,
 `vendorID`			int(11) NOT NULL,
 `productID`		int(11) NOT NULL,
 `priceFromVendor`	decimal(10,2) NOT NULL,
PRIMARY KEY (`vendorProductID`),
CONSTRAINT FK_Vendor_Products_vendorID FOREIGN KEY (`vendorID`)
REFERENCES `Vendors` (`vendorID`)
ON DELETE CASCADE,
CONSTRAINT FK_Vendor_Products_productID FOREIGN KEY (`productID`)
REFERENCES `Products` (`productID`)
ON DELETE CASCADE
);

-- Create table [PurchaseOrderItems]: Records specific items and quantities included in a restocking order from vendors
CREATE TABLE `PurchaseOrderItems` (
 `purchaseOrderItemID`	int(11) AUTO_INCREMENT UNIQUE NOT NULL,
 `purchaseOrderID`		int(11) NOT NULL, 
 `productID`			int(11) NOT NULL,
 `quantity`				int(11) NOT NULL,
 `purchasePrice`		decimal(10,2) NOT NULL,
PRIMARY KEY (`purchaseOrderItemID`),
CONSTRAINT FK_Purchase_Order_Items_purchaseOrderID FOREIGN KEY (`purchaseOrderID`)
REFERENCES `PurchaseOrders` (`purchaseOrderID`),
CONSTRAINT FK_Purchase_Order_Items_productID FOREIGN KEY (`productID`)
REFERENCES `Products` (`productID`)
);

-- Create table [SalesOrderItems]: Records specific items and quantities included in a sales order
CREATE TABLE `SalesOrderItems` (
 `saleOrderItemID`	int(11) AUTO_INCREMENT UNIQUE NOT NULL,
 `saleOrderID`		int(11) NOT NULL,
 `productID`		int(11) NULL,
 `quantity`			int(11) NOT NULL,
 `salePrice`		decimal(10,2) NOT NULL,
PRIMARY KEY (`saleOrderItemID`),
CONSTRAINT FK_Sales_Order_Items_saleOrderID FOREIGN KEY (`saleOrderID`)
REFERENCES `SalesOrders` (`saleOrderID`)
ON DELETE CASCADE,
CONSTRAINT FK_Sales_Order_Items_productID FOREIGN KEY (`productID`)
REFERENCES `Products` (`productID`)
ON DELETE SET NULL
);
-- ------------------------------------------------------------------------------
-- INSERT DATA
-- WAREHOUSES --
INSERT INTO Warehouses (warehouseID, warehouseName, warehouseAddr) VALUES 
(1, 'North Distribution', '123 Frozen Lane, Anchorage, AK'),
(2, 'South Fulfillment', '456 Sunny Blvd, Miami, FL'),
(3, 'East Coast Hub', '789 Metro Way, New York, NY'),
(4, 'West Coast Depot', '101 Tech Drive, San Francisco, CA');

-- VENDORS --
INSERT INTO Vendors (vendorID, vendorName, vendorAddr, vendorEmail) VALUES 
(1, 'Martin GmbH', '602 Road 93, Dublin, Ireland', 'sales@martingmbh.com'),
(2, 'King Group', '429 Road 86, Munich, Germany', 'sales@kinggroup.com'),
(3, 'Nelson Group', '344 Street 70, Singapore, Singapore', 'sales@nelsongroup.com'),
(4, 'White Ltd', '542 Strasse 81, Seoul, South Korea', 'sales@whiteltd.com'),
(5, 'Carter Group', '829 Ave 19, Amsterdam, Netherlands', 'sales@cartergroup.com');

-- PRODUCTS --
INSERT INTO Products (productID, productName, listCost) VALUES 
(1, 'Premium Keyboard 591', 299.89),
(2, 'Plastic Drawer 653', 297.88),
(3, 'Steel Desk 473', 441.74),
(4, 'Ergonomic Mouse 654', 220.62);

-- CUSTOMERS --
INSERT INTO Customers (customerID, customerLN, customerFN, customerAddr, customerEmail) VALUES 
(1, 'Hernandez', 'Anna', '213 Park Rd, Los Angeles, CA', 'anna.hernandez1@example.com'),
(2, 'White', 'Brenda', '493 Elm St, Houston, TX', 'brenda.white2@example.com'),
(3, 'Campbell', 'Amanda', '229 Pine St, Philadelphia, PA', 'amanda.campbell3@example.com'),
(4, 'Martin', 'Betty', '389 Lakeview Dr, San Jose, CA', 'betty.martin4@example.com');

-- SALES ORDERS --
INSERT INTO SalesOrders (saleOrderID, customerID, warehouseID, saleDate) VALUES 
(1, 1, 4, '2024-12-05'),
(2, 3, 3, '2024-05-20'),
(3, 2, 1, '2024-12-12'),
(4, 4, 2, '2024-02-08');

-- PURCHASE ORDERS --
INSERT INTO PurchaseOrders (purchaseOrderID, vendorID, warehouseID, purchaseDate) VALUES 
(1, 4, 1, '2023-11-19'),
(2, 1, 3, '2024-09-12'),
(3, 3, 4, '2024-05-12'),
(4, 2, 1, '2023-07-31');

-- INVENTORY --
INSERT INTO Inventory (inventoryID, productID, warehouseID, quantity) VALUES 
(1, 1, 2, 414),
(2, 2, 3, 334),
(3, 3, 1, 189),
(4, 4, 4, 445);

-- VENDOR PRODUCTS --
INSERT INTO VendorProducts (vendorProductID, vendorID, productID, priceFromVendor) VALUES 
(1, 4, 1, 96.75),
(2, 3, 2, 60.62),
(3, 2, 3, 84.09),
(4, 1, 4, 9.9);

-- PURCHASE ORDER ITEMS --
INSERT INTO PurchaseOrderItems (purchaseOrderItemID, purchaseOrderID, productID, quantity, purchasePrice) VALUES 
(1, 1, 4, 98, 9.90),
(2, 2, 3, 71, 84.09),
(3, 3, 2, 92, 60.62),
(4, 4, 1, 45, 96.75);

-- SALES ORDER ITEMS --
INSERT INTO SalesOrderItems (saleOrderItemID, saleOrderID, productID, quantity, salePrice) VALUES 
(1, 1, 4, 4, 250.00),
(2, 4, 3, 5, 450.00),
(3, 3, 2, 5, 310.00),
(4, 2, 1, 2, 320.00);

SET FOREIGN_KEY_CHECKS=1;
