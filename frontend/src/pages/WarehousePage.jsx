import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import PopupForm from '../components/PopupForm';

// Sample data before we connect to the backend API
const initialWarehouses = [
    { warehouseID: 1, warehouseName: 'North Distribution', warehouseAddr: '541 Monroe Ave' },
    { warehouseID: 2, warehouseName: 'South Fulfillment', warehouseAddr: '456 8th Street' },
];

const inventory = [
    { name: 'Widget', qty: 50 },
    { name: 'Gadget', qty: 20 },
];

function WarehousesPage() {

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
            <DetailTable 
                columns={columns} 
                data={warehouses} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                renderDetails={renderInventory}
            />
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
        </div>
    );
}

export default WarehousesPage;