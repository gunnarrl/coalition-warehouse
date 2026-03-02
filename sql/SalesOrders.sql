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


-- Read All Sales Orders and Calculate Cost of Sale --
SELECT SalesOrders.saleOrderID, SalesOrders.saleDate,  Warehouses.warehouseID, Warehouses.warehouseName, Customers.customerID, Customers.customerLN, Customers.customerFN, Customers.customerAddr, Customers.customerEmail,
SUM(SalesOrderItems.quantity * SalesOrderItems.salePrice) AS costOfSale
FROM SalesOrders
JOIN Customers ON SalesOrders.customerID = Customers.customerID
JOIN Warehouses ON SalesOrders.warehouseID = Warehouses.warehouseID
LEFT JOIN SalesOrderItems ON SalesOrders.saleOrderID = SalesOrderItems.saleOrderID
GROUP BY SalesOrders.saleOrderID;

-- Read all sold items --
SELECT SalesOrderItems.saleOrderID, SalesOrderItems.productID, SalesOrderItems.quantity, 
SalesOrderItems.salePrice, Products.productName, SalesOrders.warehouseID
FROM SalesOrderItems
JOIN Products ON SalesOrderItems.productID = Products.productID
JOIN SalesOrders ON SalesOrderItems.saleOrderID = SalesOrders.saleOrderID;

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