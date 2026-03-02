// Citation for use of AI Tools: VS Code's Gemini Code Assist to set up CUD for inner tables
// Date: 02/11/2026
// Prompt: [Attached the WarehousePage.jsx]
// "I have a this page which currently renders a list of warehouses in a DetailTable component, when you click on a warehouse it expands to show the inventory in that warehouse.
// Please help me set up the state and handlers for the Add/Edit/Delete buttons for the inventory items, similar to how the warehouses CUD operations are handled."
// AI Source URL: https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist

import React, { useState, useEffect } from 'react';
import DetailTable from '../components/DetailTable';
import SimpleTable from '../components/SimpleTable';
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown';


const mockProducts = [
    { productID: 1, productName: 'Premium Keyboard 591' },
    { productID: 2, productName: 'Plastic Drawer 653' },
    { productID: 3, productName: 'Steel Desk 473' },
    { productID: 4, productName: 'Ergonomic Mouse 654' },
];

function WarehousePage() {

    const [warehouses, setWarehouses] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentWarehouse, setCurrentWarehouse] = useState(null);
    // inner table states
    const [inventoryItems, setInventoryItems] = useState([]);
    const [isItemPopupOpen, setIsItemPopupOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [targetWarehouseID, setTargetWarehouseID] = useState(null);

    // products state for the dropdown menu
    const [products, setProducts] = useState([]);

    const fetchWarehouses = async () => {
        try {
            const res = await fetch('/warehouses');
            const data = await res.json();
            const formattedData = data.map(({ warehouseID, warehouseName, warehouseAddr }) => ({
                warehouseID: warehouseID,
                warehouseName: warehouseName,
                warehouseAddr: warehouseAddr
            }));
            setWarehouses(formattedData);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    // get the warehouses from the DB
    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchInventory = async () => {
        try {
            const res = await fetch('/inventory');
            const data = await res.json();
            const formattedData = data.map(({ inventoryID, productName, warehouseID, quantity, listCost }) => ({
                inventoryID: inventoryID,
                productName: productName,
                warehouseID: warehouseID,
                quantity: quantity,
                price: listCost
            }));
            setInventoryItems(formattedData);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    // get the inventory from the DB
    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/products');
            const data = await res.json();
            const formattedData = data.map(({ productID, productName }) => ({
                productID: productID,
                productName: productName
            }));
            setProducts(formattedData);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    // get the products from the DB
    useEffect(() => {
        fetchProducts();
    }, []);

    // Columns for the DetailTable, maps the DB fields to user-friendly names
    const columns = [
        { label: 'ID', key: 'warehouseID' },
        { label: 'Name', key: 'warehouseName' },
        { label: 'Address', key: 'warehouseAddr' }
    ];

    const renderInventory = (row) => {
        // Passed to DetailTable to render the inventory details for each warehouse
        const itemColumns = [
            { label: 'Item Name', key: 'productName' },
            { label: 'Quantity', key: 'quantity' },
            { label: 'Price', key: 'price' }
        ];

        return (
            <div>
                <h4>Warehouse Inventory</h4>
                <button onClick={() => handleAddItem(row.warehouseID)}>+ Add Inventory</button>
                <SimpleTable
                    data={inventoryItems.filter(item => item.warehouseID === row.warehouseID)}
                    columns={itemColumns}
                    onEdit={(itemRow) => handleEditItem(row.warehouseID, itemRow)}
                    onDelete={(itemRow) => handleDeleteItem(row.warehouseID, itemRow)}
                />
            </div>
        );
    };
    // Handlers for Add/Edit/Delete, 
    // TODO: Connect these to the backend API and refresh the data after changes
    const handleAdd = () => {
        setCurrentWarehouse(null);
        setIsPopupOpen(true);
    };

    const handleEdit = (row) => {
        setCurrentWarehouse(row);
        setIsPopupOpen(true);
    };

    const handleDelete = (id) => {
        alert("Delete Warehouse ID: " + id);
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert("Saved!");
        setIsPopupOpen(false);
    };

    // Handlers for Inner table actions
    const handleAddItem = (warehouseID) => {
        setTargetWarehouseID(warehouseID);
        setCurrentItem(null);
        setIsItemPopupOpen(true);
    };

    const handleEditItem = (warehouseID, itemRow) => {
        setTargetWarehouseID(warehouseID);
        setCurrentItem(itemRow);
        setIsItemPopupOpen(true);
    };

    const handleDeleteItem = (warehouseID, itemRow) => {
        alert(`Delete Item ${itemRow.name} from Warehouse ID: ${warehouseID}`);
    };

    const handleSaveItem = (e) => {
        e.preventDefault();
        alert("Saved Item!");
        setIsItemPopupOpen(false);
    }

    return (
        <div>
            <h1>Manage Warehouses</h1>
            <button onClick={handleAdd}>Add New Warehouse</button>
            <PopupForm
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={currentWarehouse ? "Edit Warehouse" : "Add Warehouse"}
            >
                { /* Use key so that form data gets refreshed when you change it. Gemini 3 pro helped bugfix */}
                <form key={currentWarehouse?.warehouseID || 'new-wh'} onSubmit={handleSave}>
                    <label>Name:</label>
                    <input name='name' defaultValue={currentWarehouse?.warehouseName || ''} />
                    <label>Address:</label>
                    <input name='address' defaultValue={currentWarehouse?.warehouseAddr || ''} />
                    <button type="submit">Save</button>
                </form>
            </PopupForm>
            <PopupForm
                isOpen={isItemPopupOpen}
                onClose={() => setIsItemPopupOpen(false)}
                title={currentItem ? "Edit Inventory Item" : "Add Inventory Item"}
            >
                <form key={currentItem?.name || 'new-item'} onSubmit={handleSaveItem}>
                    <Dropdown
                        label="Product"
                        name="productID"
                        options={products}
                        valueKey="productID"
                        labelKey="productName"
                        selectedValue={currentItem?.productID}
                    />
                    <label>Quantity:</label>
                    <input name='quantity' type="number" defaultValue={currentItem?.quantity || 0} />
                    <label>Price:</label>
                    <input name='listCost' type="number" step="0.01" defaultValue={currentItem?.price || 0} />
                    <button type="submit">Save</button>
                </form>
            </PopupForm>
            <DetailTable
                columns={columns}
                data={warehouses}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderDetails={renderInventory}
            />
        </div>
    );
}

export default WarehousePage;