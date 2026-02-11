-- Customers --
-- Create --
INSERT INTO Customers (customerLN, customerFN, customerAddr, customerEmail) VALUES
(:customerLN_Input, :customerFN_Input, :customerAddr_Input, :customerEmail_Input);

-- Read All Customers--
SELECT * FROM Customers;

-- Read Customer Specific Details --
SELECT customerID, customerLN, customerFN, customerAddr, customerEmail
FROM Customers
WHERE customerID = :customerID_selected_from_browse_customer_page

-- Update --
UPDATE Customers SET customerLN = :customerLN_Input, customerFN = :customerFN_Input, customerAddr = :customerAddr_Input, customerEmail = :customerEmail_Input
WHERE customerID = :customerID_from_update_form

-- Delete --
DELETE FROM Customers WHERE customerID = :customerID_selected_from_browse_customer_page;