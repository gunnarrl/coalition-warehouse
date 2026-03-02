-- Vendor Catalog --
-- Read all products sold by all vendors --
SELECT Vendors.vendorID, Vendors.vendorName, Products.productID, Products.productName, VendorProducts.costFromVendor
FROM VendorProducts
JOIN Vendors ON VendorProducts.vendorID = Vendors.vendorID
JOIN Products on VendorProducts.productID = Products.productID;

-- Create Product to Vendor Catalog --
INSERT INTO VendorProducts (vendorID, productID, costFromVendor) VALUES
(:vendorID_Input, :productID_Input, :costFromVendor_Input);

-- Update Product in Vendor Catalog --
UPDATE VendorProducts SET costFromVendor = :costFromVendor_Input
WHERE vendorProductID = :vendorProductID_from_update_form;

-- Remove Product from Vendor Catalog --
DELETE FROM VendorProducts WHERE VendorProducts.vendorID= :vendorID_Selected AND VendorProducts.productID = :productID_Selected;