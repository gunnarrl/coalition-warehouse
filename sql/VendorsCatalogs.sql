-- Vendor Catalog --
-- Read all products sold by specific vendor --
SELECT Vendors.vendorName, Products.productID, Products.productName, VendorProducts.priceFromVendor
FROM VendorProducts
JOIN Vendors ON VendorProducts.vendorID = Vendors.vendorID
JOIN Products on VendorProducts.productID = Products.productID 
WHERE Vendors.vendorID= :vendorID_selected_from_browse_vendor_page;

-- Create Product to Vendor Catalog --
INSERT INTO VendorProducts (vendorID, productID, costFromVendor) VALUES
(:vendorID_Input, :productID_Input, :costFromVendor_Input);

-- Remove Product from Vendor Catalog --
DELETE FROM VendorProducts WHERE VendorProducts.vendorID= :vendorID_Selected AND VendorProducts.productID = :productID_Selected;