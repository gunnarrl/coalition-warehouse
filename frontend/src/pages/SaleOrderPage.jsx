import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown'; 

// Mock Data
const mockSalesOrders = [
    { saleID: 1, saleDate: '2024-06-01', customerID: 1, warehouseID: 101 },
    { saleID: 2, saleDate: '2024-06-02', customerID: 2, warehouseID: 102 },
];

const mockCustomers = [
    { customerID: 1, customerName: 'Alice Jones' },
    { customerID: 2, customerName: 'Bob Smith' },
];

const mockWarehouses = [
    { warehouseID: 101, warehouseName: 'North Distribution' },
    { warehouseID: 102, warehouseName: 'South Fulfillment' },
];

const SalesOrdersPage = () => {

    const columns = [
        { label: 'ID', key: 'saleID' },
        { label: 'Date', key: 'saleDate' },
        { label: 'Customer', key: 'customerID' }, // We'll show the name in the table, but save the ID
        { label: 'Warehouse', key: 'warehouseID' } // Same for warehouse
    ];

    const [salesOrders, setSalesOrders] = useState(mockSalesOrders);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);


    // Handlers for Add/Edit/Delete
    // TODO: Connect these to the backend API and refresh the data after changes
    const handleSave = (e) => {
        e.preventDefault();
    }

    const handleEdit = (rowData) => {
        setCurrentRow(rowData);
        setIsPopupOpen(true);
    }

    const handleAdd = () => {
        setCurrentRow(null);
        setIsPopupOpen(true);
    }

    const handleDelete = (rowData) => {
        window.alert(`Delete Sale Order ID: ${rowData.saleID}`);
    }

    // TODO: Add logic to show each item in an order when it is clicked, and a button to add items to the order
    const renderSaleItems = (row) => (
        <div className="p-4 bg-gray-50 border rounded">
            <h4>Items in Sale #{row.saleID}</h4>
            <p>Not Complete</p>
            <button className="bg-blue-500 text-white px-2 py-1 rounded mt-2">Add Item</button>
        </div>
    );
    return (
        <div className="p-6">
            <h1>Sales Orders</h1>
            <DetailTable
                columns={columns}
                data={salesOrders}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderDetails={renderSaleItems}
            />
            <button onClick={handleAdd} className="bg-green-600 text-white p-2 mt-4">Add Sale Order</button>

            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                title={currentRow ? "Edit Sale" : "Create Sale"}
            >
                <form onSubmit={handleSave} className="flex flex-col gap-4">
                    
                    <label className="font-bold">Date:</label>
                    <input type="date" name="saleDate" defaultValue={currentRow?.saleDate} className="border p-2" />

                    {/* --- DROPDOWN 1: CUSTOMER --- */}
                    <Dropdown
                        label="Customer"
                        options={mockCustomers}
                        valueKey="customerID"    // What to save to DB (ID)
                        labelKey="customerName"  // What to show user (Name)
                        selectedValue={currentRow?.customerID}
                    />

                    {/* --- DROPDOWN 2: WAREHOUSE --- */}
                    <Dropdown
                        label="Warehouse"
                        options={mockWarehouses}
                        valueKey="warehouseID"     // Unique ID for this list
                        labelKey="warehouseName"   // Unique Name for this list
                        selectedValue={currentRow?.warehouseID}
                    />

                    <button type="submit" className="bg-blue-600 text-white p-2 mt-2">Save</button>
                </form>
            </PopupForm>
        </div>
    );
};

export default SalesOrdersPage;