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
WHERE vendorID= :vendorID_from_update_form

-- Delete--
DELETE FROM Vendors WHERE vendorID= :vendorID_selected_from_browse_vendor_page;