import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown'; 

// Mock Data
const mockSalesOrders = [
    { saleID: 1, saleDate: '2024-12-05', customerID: 1, warehouseID: 4 },
    { saleID: 2, saleDate: '2024-05-20', customerID: 3, warehouseID: 3 },
    { saleID: 3, saleDate: '2024-12-12', customerID: 2, warehouseID: 1 },
    { saleID: 4, saleDate: '2024-02-08', customerID: 4, warehouseID: 2 },
];

const mockCustomers = [
    { customerID: 1, customerName: 'Anna Hernandez' },
    { customerID: 2, customerName: 'Brenda White' },
    { customerID: 3, customerName: 'Amanda Campbell' },
    { customerID: 4, customerName: 'Betty Martin' },
];

const mockWarehouses = [
    { warehouseID: 1, warehouseName: 'North Distribution' },
    { warehouseID: 2, warehouseName: 'South Fulfillment' },
    { warehouseID: 3, warehouseName: 'East Coast Hub' },
    { warehouseID: 4, warehouseName: 'West Coast Depot' },
];

// For simplicity, using the same items for all sales orders. These would be linked to the saleID in the DB.
const salesOrderItems = [
    { name: 'Ergonomic Mouse 654', qty: 4, price: 250.00 }, 
    { name: 'Steel Desk 473', qty: 5, price: 450.00 },     
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

    // TODO: Add logic to add/remove items to the order
    const renderSaleItems = (row) => (
        <div>
            <h4>Items in Sale #{row.saleID}</h4>
            <ul>
                {salesOrderItems.map((item, i) => (
                    <li key={i}>{item.qty}x {item.name} @ ${item.price}</li>
                ))}
            </ul>
            <button>Add Item</button>
            <button>Remove Item</button>
        </div>
    );

    return (
        <div>
            <h1>Sales Orders</h1>
            <DetailTable
                columns={columns}
                data={salesOrders}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderDetails={renderSaleItems}
            />
            <button onClick={handleAdd}>Add Sale Order</button>

            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                title={currentRow ? "Edit Sale" : "Create Sale"}
            >
                <form onSubmit={handleSave}>
                    
                    <label className="font-bold">Date:</label>
                    <input type="date" name="saleDate" defaultValue={currentRow?.saleDate}/>
                    <Dropdown
                        label="Customer"
                        options={mockCustomers}
                        valueKey="customerID"    // What to save to DB (ID)
                        labelKey="customerName"  // What to show user (Name)
                        selectedValue={currentRow?.customerID}
                    />
                    <Dropdown
                        label="Warehouse"
                        options={mockWarehouses}
                        valueKey="warehouseID"    
                        labelKey="warehouseName"  
                        selectedValue={currentRow?.warehouseID}
                    />

                    <button type="submit">Save</button>
                </form>
            </PopupForm>
        </div>
    );
};

export default SalesOrdersPage;