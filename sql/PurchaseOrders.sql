-- PurchaseOrders --
-- Create Purchase Order & Add Inventory on Hand --
INSERT INTO PurchaseOrders (vendorID, warehouseID, purchaseDate) VALUES
(:vendorID_Input, :warehouseID_Input, :purchaseDate_Input);
INSERT INTO PurchaseOrderItems (purchaseOrderID, productID, quantity, purchasePrice)
SELECT :purchaseOrderID_Input, :productID_Input, :quantity_Input, (VendorProducts.priceFromVendor * :quantity_Input)
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

-- Delete Purchase Order --
DELETE FROM PurchaseOrders WHERE purchaseOrderID= :purchaseOrderID_selected_from_browse_purchaseOrder_page;

-- Read all products sold by a specific vendor --
SELECT Vendors.vendorName, Products.productName, VendorProducts.priceFromVendor
FROM VendorProducts
JOIN Vendors ON VendorProducts.vendorID = Vendors.vendorID
JOIN Products ON VendorProducts.productID = Products.productID
WHERE Vendors.vendorID = :vendorID_selected;

-- Add a specific product and amount to an existing order --
INSERT INTO PurchaseOrderItems (puchaseOrderID, productID, quantity, purchasePrice) VALUES
(:purchaseOrderID_Input, :productID_Input, :quantity_Input, :purchasePrice_Input);

-- Delete a specific product/amount from an existing order --
DELETE FROM PurchaseOrders WHERE purchaseOrderID = :purchaseOrderID_selected AND productID = :productID_selected

-- Add Item to Purchase Order --
INSERT INTO PurchaseOrderItems (purchaseOrderID, productID, quantity, purchasePrice)
SELECT :purchaseOrderID_Input, :productID_Input, :quantity_Input, (VendorProducts.priceFromVendor * :quantity_Input)
FROM VendorProducts 
WHERE VendorProducts.productID = :productID_Input;