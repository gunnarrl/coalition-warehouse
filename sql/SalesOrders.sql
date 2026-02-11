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

-- Delete Sales Order--
DELETE FROM SalesOrders WHERE saleOrderID = :saleOrderID_selected_from_browse_salesorders_page;

-- Add Item to Sale --
INSERT INTO SalesOrderItems (saleOrderID, productID, quantity, salePrice) 
SELECT :saleOrderID_Input, :productID_Input, :quantity_Input, (Products.listCost * :quantity_Input)
FROM Products
WHERE Products.productID = :productID_Input;