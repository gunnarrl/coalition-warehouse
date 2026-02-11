-- WarehouseInventory --
-- Read all products in specific warehouse --
SELECT Warehouses.warehouseName, Products.productName, Inventory.quantity
FROM Inventory
JOIN Products ON Inventory.productID = Products.productID
JOIN Warehouses ON Inventory.warehouseID = Warehouses.warehouseID
WHERE Inventory.warehouseID = :warehouseID_selected_from_browse_warehouse_inventory_page;

-- Add product and quantity to warehouse --
INSERT INTO Inventory (productID, warehouseID, quantity) VALUES
(:productID_Input, :warehouseID_Input, :quantity_Input)

-- Remove product and quantity from warehouse --
DELETE FROM Inventory WHERE warehouseID = :warehouseID_selected AND productID = :productID_selected

-- Warehouse Stock Valuation --
SELECT Warehouses.warehouseName, SUM(Inventory.quantity), SUM(Inventory.quantity * Products.listcost)
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


