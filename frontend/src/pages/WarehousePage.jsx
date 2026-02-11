import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
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
    { name: 'Steel Desk 473', qty: 189 },     
    { name: 'Premium Keyboard 591', qty: 414 }, 
    { name: 'Plastic Drawer 653', qty: 334 },  
    { name: 'Ergonomic Mouse 654', qty: 445 }, 
];

function WarehousePage() {

    const [warehouses, setWarehouses] = useState(initialWarehouses);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentWarehouse, setCurrentWarehouse] = useState(null);

    // Columns for the DetailTable, maps the DB fields to user-friendly names
    const columns = [
        { label: 'ID', key: 'warehouseID' },
        { label: 'Name', key: 'warehouseName' },
        { label: 'Address', key: 'warehouseAddr' }
    ];

    // Passed to DetailTable to render the inventory details for each warehouse
    const renderInventory = (row) => {
        return (
            <div className="inventory-box">
                <h4>Inventory at {row.warehouseName}</h4>
                <ul>
                    {inventory.map((item, i) => (
                        <li key={i}>{item.qty}x {item.name}</li>
                    ))}
                </ul>
                <button>Add Stock +</button>
                <button className="danger">Remove Stock -</button>
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

    return (
        <div className="page-container">
            <h1>Warehouses</h1>
            <button onClick={handleAdd}>Add New Warehouse</button>
            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)}
                title={currentWarehouse ? "Edit Warehouse" : "Add Warehouse"}
            >
                <form onSubmit={handleSave}>
                    <label>Name:</label>
                    <input defaultValue={currentWarehouse?.warehouseName || ''} />
                    <label>Address:</label>
                    <input defaultValue={currentWarehouse?.warehouseAddr || ''} />
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