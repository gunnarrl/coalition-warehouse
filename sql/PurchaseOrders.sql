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

-- Read All Purchase Orders and Calculate Cost of Purchase--
SELECT PurchaseOrders.purchaseOrderID, PurchaseOrders.purchaseDate,  Warehouses.warehouseID, Warehouses.warehouseName, Vendors.vendorID, Vendors.vendorName,
SUM(PurchaseOrderItems.quantity * PurchaseOrderItems.purchasePrice) AS costOfPurchase
FROM PurchaseOrders
JOIN Warehouses ON PurchaseOrders.warehouseID = Warehouses.warehouseID
JOIN Vendors ON PurchaseOrders.vendorID = Vendors.vendorID
LEFT JOIN PurchaseOrderItems ON PurchaseOrders.purchaseOrderID = PurchaseOrderItems.purchaseOrderID
GROUP BY PurchaseOrders.purchaseOrderID;

-- Read all items purchased--
SELECT PurchaseOrderItems.purchaseOrderID, PurchaseOrderItems.productID, PurchaseOrderItems.quantity, 
PurchaseOrderItems.purchasePrice, Products.productName, PurchaseOrders.warehouseID
FROM PurchaseOrderItems
JOIN Products ON PurchaseOrderItems.productID = Products.productID
JOIN PurchaseOrders ON PurchaseOrderItems.purchaseOrderID = PurchaseOrders.purchaseOrderID;

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