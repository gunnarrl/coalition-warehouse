# Coalition Warehouse Manager
## Authors: Team 90 (Daniel Slay, Gunnar Larsen)
## Course: CS340
## Date: 03/15/2026

## Description
Internal management system for tracking products, vendors, warehouses, customers, and orders for Coalition Warehouse LLC. Built with React + Vite for the frontend and Node.js + Express for the backend, connected to a MariaDB database.

## Citations

### CS 340 Starter Code
- Scope: Project structure, `db-connector.js`, initial `app.js` server setup
- Date: 02/27/2026
- Originality: Adapted from CS 340 Activity 2 starter code. Modified to use ESM syntax, added all CRUD API routes using stored procedures, and added React static file serving.
- Source URL: https://canvas.oregonstate.edu/courses/2031764/assignments/10323319?module_item_id=26243357

### Gemini Code Assist (VS Code Extension)
- Scope: Debugging `app.js` (ESM issues, static serving), setting up CUD for inner tables in `WarehousePage.jsx` (logic reused in `VendorPage.jsx`, and both order pages), 
setting up the DetailTable component in `DetailTable.jsx`, debugging sales order item operations in `SaleOrderPage.jsx`, filtering product dropdowns by warehouse inventory in `SaleOrderPage.jsx`, trigger logic in `DDL.sql`, `app.js` and `SaleOrderPage.jsx` (logic was then copied to `PurchaseOrderPage.jsx`). AI was also used to create `App.css`.
- Date: 02/11/2026 – 03/09/2026
- Originality: Used iteratively for debugging and feature implementation. AI-generated suggestions were reviewed, adapted, and integrated. Specific prompts and results are documented in the relevant source files.
- Source URL: https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist

### React useEffect Data Fetching Pattern  
- Scope: `CustomerPage.jsx` line 31, pattern reused across all page components
- Date: 02/27/2026
- Originality: Adapted
- Source URL: https://maxrozen.com/fetching-data-react-with-useeffect

### SQL DATE_SUB Function
- Scope: `DML.sql` line 222
- Date: 03/02/2026
- Originality: Referenced for syntax
- Source URL: https://www.geeksforgeeks.org/sql/date_sub-function-in-mysql/

### Sample Data generation
- Scope: `DDL.sql` sample data
- Date: 01/23/2026
- Originality: Generated using Gemini
- Prompt: Gave it the Schema and asked it to generate sample data for each table
- Source URL: https://gemini.google.com/app

## Original Work
All CRUD pages (CustomerPage, ProductPage, PurchaseOrderPage), all React components (NavBar, SimpleTable, DetailTable, PopupForm, Dropdown), all stored procedures in `PL.sql`, the database schema in `DDL.sql`, and the DML queries were authored by Team 90. All pages were adapted from patterns established in earlier pages (mainly ProductPage and WarehousePage) with AI-assisted debugging as cited above.

## Technologies used
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MariaDB (MySQL)
- Libraries: Express, React, Vite, mysql2, react-router-dom, react-icons, react-select

## How to Run
1. npm install
2. Update db-connector.js with your DB credentials
3. npm run build && npm run production
