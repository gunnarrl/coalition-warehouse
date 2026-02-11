import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown'; 

const mockPurchasesOrders = [
    { saleID: 1, saleDate: '2023-11-19', vendorID: 4, warehouseID: 1 },
    { saleID: 2, saleDate: '2024-09-12', vendorID: 1, warehouseID: 3 },
    { saleID: 3, saleDate: '2024-05-12', vendorID: 3, warehouseID: 4 },
    { saleID: 4, saleDate: '2023-07-31', vendorID: 2, warehouseID: 1 },
];

const mockVendors = [
    { vendorID: 1, vendorName: 'Martin GmbH' },
    { vendorID: 2, vendorName: 'King Group' },
    { vendorID: 3, vendorName: 'Nelson Group' },
    { vendorID: 4, vendorName: 'White Ltd' },
    { vendorID: 5, vendorName: 'Carter Group' },
];

const mockWarehouses = [
    { warehouseID: 1, warehouseName: 'North Distribution' },
    { warehouseID: 2, warehouseName: 'South Fulfillment' },
    { warehouseID: 3, warehouseName: 'East Coast Hub' },
    { warehouseID: 4, warehouseName: 'West Coast Depot' },
];

// For simplicity, using the same items for all purchase orders. These would be linked to the saleID in the DB.
const purchaseOrderItems = [
    { name: 'Ergonomic Mouse 654', qty: 98, price: 9.90 },
    { name: 'Steel Desk 473', qty: 71, price: 84.09 },
    { name: 'Plastic Drawer 653', qty: 92, price: 60.62 },
    { name: 'Premium Keyboard 591', qty: 45, price: 96.75 },
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