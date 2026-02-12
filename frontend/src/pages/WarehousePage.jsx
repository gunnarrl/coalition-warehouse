import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import SimpleTable from '../components/SimpleTable';
import PopupForm from '../components/PopupForm';

// Sample data before we connect to the backend API
const initialWarehouses = [
    { warehouseID: 1, warehouseName: 'North Distribution', warehouseAddr: '123 Frozen Lane, Anchorage, AK' },
    { warehouseID: 2, warehouseName: 'South Fulfillment', warehouseAddr: '456 Sunny Blvd, Miami, FL' },
    { warehouseID: 3, warehouseName: 'East Coast Hub', warehouseAddr: '789 Metro Way, New York, NY' },
    { warehouseID: 4, warehouseName: 'West Coast Depot', warehouseAddr: '101 Tech Drive, San Francisco, CA' },
];

// Not yet connected to the DB, so using the same inventory for all warehouses for now. Will be linked to warehouseID in the DB later.
const inventory = [
    { name: 'Steel Desk 473', qty: 189, price: 84.09 },     
    { name: 'Premium Keyboard 591', qty: 414, price: 96.75 }, 
    { name: 'Plastic Drawer 653', qty: 334, price: 60.62 },  
    { name: 'Ergonomic Mouse 654', qty: 445, price: 9.90 }, 
];

function WarehousePage() {

    const [warehouses, setWarehouses] = useState(initialWarehouses);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentWarehouse, setCurrentWarehouse] = useState(null);
    // inner table states
    const [inventoryItems, setInventoryItems] = useState(inventory);
    const [isItemPopupOpen, setIsItemPopupOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [targetWarehouseID, setTargetWarehouseID] = useState(null);

    // Columns for the DetailTable, maps the DB fields to user-friendly names
    const columns = [
        { label: 'ID', key: 'warehouseID' },
        { label: 'Name', key: 'warehouseName' },
        { label: 'Address', key: 'warehouseAddr' }
    ];

    const renderInventory = (row) => {
    // Passed to DetailTable to render the inventory details for each warehouse
        const specificItems = inventoryItems; 

        const itemColumns = [
            { label: 'Item Name', key: 'name' },
            { label: 'Qty', key: 'qty' },
            { label: 'Price', key: 'price' }
        ];

        return (
            <div>
                <h4>Order Items</h4>
                <button onClick={() => handleAddItem(row.warehouseID)}>+ Add Inventory</button>
                <SimpleTable 
                    data={specificItems}
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
            <h1>Warehouses</h1>
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
                    <label>Item Name:</label>
                    <input name='name' defaultValue={currentItem?.name || ''} />
                    <label>Quantity:</label>
                    <input name='qty' type="number" defaultValue={currentItem?.qty || 0} />
                    <label>Price:</label>
                    <input name='price' type="number" step="0.01" defaultValue={currentItem?.price || 0} />
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