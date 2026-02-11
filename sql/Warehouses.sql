-- Warehouses--
-- Create --
INSERT INTO Warehouses (warehouseName, warehouseAddr) VALUES
(:warehouseName_Input, :warehouseAddr_Input);

-- Read All Warehouses --
SELECT * FROM Warehouses;

-- Update Warehouse --
UPDATE Warehouses SET warehouseName = :warehouseName_Input, warehouseAddr = :warehouseAddr_Input
WHERE warehouseID = :warehouseID_from_update_form

-- Delete Warehouse --
DELETE FROM Warehouses WHERE warehouseID = :warehouseID_selected_from_browse_warehouse_page;