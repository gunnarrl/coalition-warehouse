-- Products --
-- Create --
INSERT INTO Products (productName, listCost) VALUES
(:productName_Input, :listCost_Input);

-- Read All Products--
SELECT * FROM Products;

-- Read Product Specific Details --
SELECT productID, productName, listCost
FROM Products
WHERE productID = :productID_selected_from_browse_product_page;

-- Update --
UPDATE Products SET productName = :productName_Input, listCost = :listCost_Input WHERE id= :productID_from_update_form;

-- Delete --
DELETE FROM Products WHERE productID = :productID_selected_from_browse_product_page;