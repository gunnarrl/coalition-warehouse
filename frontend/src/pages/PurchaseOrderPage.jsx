import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown'; 

// Mock Data
const mockPurchasesOrders = [
    { saleID: 1, saleDate: '2024-06-01', vendorID: 1, warehouseID: 101 },
    { saleID: 2, saleDate: '2024-06-02', vendorID: 2, warehouseID: 102 },
];

const mockVendors = [
    { vendorID: 1, vendorName: 'Mass Supply Co' },
    { vendorID: 2, vendorName: 'The Little Boutique Shop' },
];

const mockWarehouses = [
    { warehouseID: 101, warehouseName: 'North Distribution' },
    { warehouseID: 102, warehouseName: 'South Fulfillment' },
];

const purchaseOrderItems = [
    { name: 'Widget', qty: 50, price: 10.00 },
    { name: 'Gadget', qty: 20, price: 15.00 },
];
const PurchaseOrdersPage = () => {

    const columns = [
        { label: 'ID', key: 'saleID' },
        { label: 'Date', key: 'saleDate' },
        { label: 'Vendor', key: 'vendorID' }, // We'll show the name in the table, but save the ID
        { label: 'Warehouse', key: 'warehouseID' } // Same for warehouse
    ];

    const [salesOrders, setPurchasesOrders] = useState(mockPurchasesOrders);
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
        window.alert(`Delete Purchase Order ID: ${rowData.saleID}`);
    }

    // TODO: Add logic to add/remove items to the order
    const renderPurchaseItems = (row) => (
        <div>
            <h4>Items Purchased in #{row.saleID}</h4>
            <ul>
                {purchaseOrderItems.map((item, i) => (
                    <li key={i}>{item.qty}x {item.name} @ ${item.price} </li>
                ))}
            </ul>
            <button>Add Item</button>
            <button>Remove Item</button>
        </div>
    );
    return (
        <div>
            <h1>Purchases Orders</h1>
            <DetailTable
                columns={columns}
                data={salesOrders}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderDetails={renderPurchaseItems}
            />
            <button onClick={handleAdd}>Add Purchase Order</button>

            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                title={currentRow ? "Edit Purchase" : "Create Purchase"}
            >
                <form onSubmit={handleSave}>
                    <label>Date:</label>
                    <input type="date" name="saleDate" defaultValue={currentRow?.saleDate}/>
                    <Dropdown
                        label="Vendor"
                        options={mockVendors}
                        valueKey="vendorID"    // What to save to DB (ID)
                        labelKey="vendorName"  // What to show user (Name)
                        selectedValue={currentRow?.vendorID}
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

export default PurchaseOrdersPage;