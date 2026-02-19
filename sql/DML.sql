-- Customers --
-- Create --
INSERT INTO Customers (customerLN, customerFN, customerAddr, customerEmail) VALUES
(:customerLN_Input, :customerFN_Input, :customerAddr_Input, :customerEmail_Input);

-- Read All Customers--
SELECT * FROM Customers;

-- Read Customer Specific Details --
SELECT customerID, customerLN, customerFN, customerAddr, customerEmail
FROM Customers
WHERE customerID = :customerID_selected_from_browse_customer_page;

-- Update --
UPDATE Customers SET customerLN = :customerLN_Input, customerFN = :customerFN_Input, customerAddr = :customerAddr_Input, customerEmail = :customerEmail_Input
WHERE customerID = :customerID_from_update_form;

-- Delete --
DELETE FROM Customers WHERE customerID = :customerID_selected_from_browse_customer_page;

-- Products --
-- Create --
INSERT INTO Products (productName, listCost) VALUES
(:productName_Input, :listCost_Input);

-- Read All Products--
SELECT * FROM Products;

-- Read Product Specific Details --
SELECT productID, productName, listCost
FROM Products
WHERE productID = :productID_selected_from_browse_product_page;

-- Update --
UPDATE Products SET productName = :productName_Input, listCost = :listCost_Input WHERE productID= :productID_from_update_form;

-- Delete --
DELETE FROM Products WHERE productID = :productID_selected_from_browse_product_page;

-- Vendors --
-- Create --
INSERT INTO Vendors (vendorName, vendorAddr, vendorEmail) VALUES
(:vendorName_Input, :vendorAddr_Input, :vendorEmail_Input);

-- Read All Vendors --
SELECT * FROM Vendors;

-- Read Vendor Specific Details --
SELECT vendorID, vendorAddr, vendorEmail
FROM Vendors
WHERE vendorID = :vendorID_selected_from_browse_vendor_page;

-- Update --
UPDATE Vendors SET vendorName = :vendorNameInput, vendorAddr = :vendorAddr, vendorEmail = :vendorEmail 
WHERE vendorID= :vendorID_from_update_form;

-- Delete--
DELETE FROM Vendors WHERE vendorID= :vendorID_selected_from_browse_vendor_page;

-- Warehouses--
-- Create --
INSERT INTO Warehouses (warehouseName, warehouseAddr) VALUES
(:warehouseName_Input, :warehouseAddr_Input);

-- Read All Warehouses --
SELECT * FROM Warehouses;

-- Update Warehouse --
UPDATE Warehouses SET warehouseName = :warehouseName_Input, warehouseAddr = :warehouseAddr_Input
WHERE warehouseID = :warehouseID_from_update_form;

-- Delete Warehouse --
DELETE FROM Warehouses WHERE warehouseID = :warehouseID_selected_from_browse_warehouse_page;

-- PurchaseOrders --
-- Create Purchase Order & Add Inventory on Hand --
INSERT INTO PurchaseOrders (vendorID, warehouseID, purchaseDate) VALUES
(:vendorID_Input, :warehouseID_Input, :purchaseDate_Input);
INSERT INTO PurchaseOrderItems (purchaseOrderID, productID, quantity, purchasePrice)
SELECT :purchaseOrderID_Input, :productID_Input, :quantity_Input, (VendorProducts.costFromVendor * :quantity_Input)
FROM VendorProducts 
WHERE VendorProducts.productID = :productID_Input;
UPDATE Inventory SET quantity = quantity + :quantity_Input
WHERE warehouseID = :warehouseID_Input AND productID = :productID_Input;

-- Read All Purchase Orders--
SELECT PurchaseOrders.purchaseOrderID, Vendors.vendorName, Warehouses.warehouseName, PurchaseOrders.purchaseDate
FROM PurchaseOrders
JOIN Vendors ON PurchaseOrders.vendorID = Vendors.vendorID
JOIN Warehouses ON PurchaseOrders.warehouseID = Warehouses.warehouseID;

-- Read Purchase Order Specific Details--
SELECT PurchaseOrders.purchaseOrderID, Vendors.vendorName, Warehouses.warehouseName, PurchaseOrders.purchaseDate, Products.productName, PurchaseOrderItems.quantity, PurchaseOrderItems.purchasePrice
FROM PurchaseOrders
JOIN Vendors ON PurchaseOrders.vendorID = Vendors.vendorID
JOIN Warehouses ON PurchaseOrders.warehouseID = Warehouses.warehouseID
LEFT JOIN PurchaseOrderItems ON PurchaseOrders.purchaseOrderID = PurchaseOrderItems.purchaseOrderID 
LEFT JOIN Products ON PurchaseOrderItems.productID = Products.productID
WHERE PurchaseOrders.purchaseOrderID= :purchaseOrderID_selected_from_browse_purchaseOrder_page;

-- Update Purchase Order --
UPDATE PurchaseOrders SET vendorID = :vendorID_Input, warehouseID = :warehouseID_Input, purchaseDate = :purchaseDate_Input
WHERE purchaseOrderID = :purchaseOrderID_from_update_form;

-- Delete Purchase Order --
DELETE FROM PurchaseOrders WHERE purchaseOrderID= :purchaseOrderID_selected_from_browse_purchaseOrder_page;

-- Add a specific product and amount to an existing order --
INSERT INTO PurchaseOrderItems (purchaseOrderID, productID, quantity, purchasePrice) VALUES
(:purchaseOrderID_Input, :productID_Input, :quantity_Input, :purchasePrice_Input);

-- Update a specific item in a purchase order --
UPDATE PurchaseOrderItems SET productID = :productID_Input, quantity = :quantity_Input, purchasePrice = :purchasePrice_Input
WHERE purchaseOrderItemID = :purchaseOrderItemID_from_update_form;

-- Delete a specific product/amount from an existing order --
DELETE FROM PurchaseOrderItems WHERE purchaseOrderID = :purchaseOrderID_selected AND productID = :productID_selected;

-- Add Item to Purchase Order --
INSERT INTO PurchaseOrderItems (purchaseOrderID, productID, quantity, purchasePrice)
SELECT :purchaseOrderID_Input, :productID_Input, :quantity_Input, (VendorProducts.costFromVendor * :quantity_Input)
FROM VendorProducts 
WHERE VendorProducts.productID = :productID_Input;

-- SalesOrders --
-- Create Sales Order & Subtract Inventory on Hand --
INSERT INTO SalesOrders (customerID, warehouseID, saleDate) VALUES
(:customerID_Input, :warehouseID_Input, :saleDate_Input);
INSERT INTO SalesOrderItems (saleOrderID, productID, quantity, salePrice)
SELECT :saleOrderID_Input, :productID_Input, :quantity_Input, (Products.listCost * :quantity_Input)
FROM Products
WHERE Products.productID = :productID_Input;
UPDATE Inventory SET quantity = quantity - :quantity_Input
WHERE warehouseID = :warehouseID_Input AND productID = :productID_Input;


-- Read All Sales Orders --
SELECT SalesOrders.saleOrderID, SalesOrders.saleDate,  Warehouses.warehouseName, Customers.customerLN, Customers.customerFN, Customers.customerAddr, Customers.customerEmail,
Products.productName, SalesOrderItems.quantity, SalesOrderItems.salePrice
FROM SalesOrders
JOIN Customers ON SalesOrders.customerID = Customers.customerID
JOIN Warehouses ON SalesOrders.warehouseID = Warehouses.warehouseID
JOIN SalesOrderItems ON SalesOrders.saleOrderID = SalesOrderItems.saleOrderID
JOIN Products ON SalesOrderItems.productID = Products.productID;

-- Read Specific Sales Order Details --
SELECT SalesOrders.saleOrderID, SalesOrders.saleDate, Warehouses.warehouseName, Customers.customerLN, Customers.customerFN, Customers.customerAddr, Customers.customerEmail,
Products.productName, SalesOrderItems.quantity, SalesOrderItems.salePrice
FROM SalesOrders
JOIN Customers ON SalesOrders.customerID = Customers.customerID
JOIN Warehouses ON SalesOrders.warehouseID = Warehouses.warehouseID
LEFT JOIN SalesOrderItems ON SalesOrders.saleOrderID = SalesOrderItems.saleOrderID
LEFT JOIN Products ON SalesOrderItems.productID = Products.productID
WHERE SalesOrders.saleOrderID = :saleOrderID_selected_from_browse_salesorders_page;

-- Update Sales Order --
UPDATE SalesOrders SET customerID = :customerID_Input, warehouseID = :warehouseID_Input, saleDate = :saleDate_Input
WHERE saleOrderID = :saleOrderID_from_update_form;

-- Delete Sales Order--
DELETE FROM SalesOrders WHERE saleOrderID = :saleOrderID_selected_from_browse_salesorders_page;

-- Add Item to Sale --
INSERT INTO SalesOrderItems (saleOrderID, productID, quantity, salePrice) 
SELECT :saleOrderID_Input, :productID_Input, :quantity_Input, (Products.listCost * :quantity_Input)
FROM Products
WHERE Products.productID = :productID_Input;

-- Update a specific item in a sale order --
UPDATE SalesOrderItems SET productID = :productID_Input, quantity = :quantity_Input, salePrice = :salePrice_Input
WHERE saleOrderItemID = :saleOrderItemID_from_update_form;

-- Delete a specific item from a sale order --
DELETE FROM SalesOrderItems WHERE saleOrderItemID = :saleOrderItemID_selected;

-- Vendor Catalog --
-- Read all products sold by specific vendor --
SELECT Vendors.vendorName, Products.productID, Products.productName, VendorProducts.costFromVendor
FROM VendorProducts
JOIN Vendors ON VendorProducts.vendorID = Vendors.vendorID
JOIN Products on VendorProducts.productID = Products.productID 
WHERE Vendors.vendorID= :vendorID_selected_from_browse_vendor_page;

-- Create Product to Vendor Catalog --
INSERT INTO VendorProducts (vendorID, productID, costFromVendor) VALUES
(:vendorID_Input, :productID_Input, :costFromVendor_Input);

-- Update Product in Vendor Catalog --
UPDATE VendorProducts SET costFromVendor = :costFromVendor_Input
WHERE vendorProductID = :vendorProductID_from_update_form;

-- Remove Product from Vendor Catalog --
DELETE FROM VendorProducts WHERE VendorProducts.vendorID= :vendorID_Selected AND VendorProducts.productID = :productID_Selected;

-- WarehouseInventory --
-- Read all products in specific warehouse --
SELECT Warehouses.warehouseName, Products.productName, Inventory.quantity
FROM Inventory
JOIN Products ON Inventory.productID = Products.productID
JOIN Warehouses ON Inventory.warehouseID = Warehouses.warehouseID
WHERE Inventory.warehouseID = :warehouseID_selected_from_browse_warehouse_inventory_page;

-- Add product and quantity to warehouse --
INSERT INTO Inventory (productID, warehouseID, quantity) VALUES
(:productID_Input, :warehouseID_Input, :quantity_Input);

-- Update quantity of a product in a warehouse --
UPDATE Inventory SET quantity = :quantity_Input
WHERE warehouseID = :warehouseID_selected AND productID = :productID_selected;

-- Remove product and quantity from warehouse --
DELETE FROM Inventory WHERE warehouseID = :warehouseID_selected AND productID = :productID_selected;

-- Warehouse Stock Valuation --
SELECT Warehouses.warehouseName, SUM(Inventory.quantity), SUM(Inventory.quantity * Products.listCost)
FROM Inventory
JOIN Products ON Inventory.productID = Products.productID
JOIN Warehouses ON Inventory.warehouseID = Warehouses.warehouseID
GROUP BY Warehouses.warehouseName;

-- Warehouse Sell Through Rate --
SELECT Products.productName, SUM(SalesOrderItems.quantity), (SUM(SalesOrderItems.quantity) / 30)
FROM SalesOrderItems
JOIN SalesOrders ON SalesOrderItems.saleOrderID = SalesOrders.saleOrderID
JOIN Products ON SalesOrderItems.productID = Products.productID
WHERE SalesOrders.saleDate >= DATE_SUB(CURRENT_DATE, INTERVAL 30 DAY) -- CITATION: https://www.geeksforgeeks.org/sql/date_sub-function-in-mysql/
GROUP BY Products.productID;
