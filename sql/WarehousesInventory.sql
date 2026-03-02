-- WarehouseInventory --
-- Read all products in inventory --
SELECT Warehouses.warehouseID, Products.productID, Inventory.inventoryID, Products.productName, Inventory.quantity, Products.listCost
FROM Inventory
JOIN Products ON Inventory.productID = Products.productID
JOIN Warehouses ON Inventory.warehouseID = Warehouses.warehouseID;

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
