import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import SimpleTable from '../components/SimpleTable';
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown'; 

const mockPurchasesOrders = [
    { purchaseOrderID: 1, purchaseDate: '2023-11-19', vendorID: 4, vendorName: 'White Ltd', warehouseID: 1, warehouseName: 'North Distribution' },
    { purchaseOrderID: 2, purchaseDate: '2024-09-12', vendorID: 1, vendorName: 'Martin GmbH', warehouseID: 3, warehouseName: 'East Coast Hub' },
    { purchaseOrderID: 3, purchaseDate: '2024-05-12', vendorID: 3, vendorName: 'Nelson Group', warehouseID: 4, warehouseName: 'West Coast Depot' },
    { purchaseOrderID: 4, purchaseDate: '2023-07-31', vendorID: 2, vendorName: 'King Group', warehouseID: 1, warehouseName: 'North Distribution' }
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
    { label: 'ID', key: 'purchaseOrderID' },
    { label: 'Date', key: 'purchaseDate' },
    { label: 'Vendor', key: 'vendorName' },    
    { label: 'Warehouse', key: 'warehouseName' } 
];

    const [salesOrders, setPurchasesOrders] = useState(mockPurchasesOrders);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const [orderItems, setOrderItems] = useState(purchaseOrderItems);
    const [isItemsPopupOpen, setIsItemsPopupOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [targetSaleID, setTargetSaleID] = useState(null);



    // Handlers for Add/Edit/Delete
    // TODO: Connect these to the backend API and refresh the data after changes
    const handleSave = (e) => {
        e.preventDefault();
        setIsPopupOpen(false);
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

    // Inner table handlers

    const handleAddItem = (saleID) => {
        setTargetSaleID(saleID);
        setCurrentItem(null);
        setIsItemsPopupOpen(true);
    };

    const handleEditItem = (saleID, itemRow) => {
        setTargetSaleID(saleID);
        setCurrentItem(itemRow);
        setIsItemsPopupOpen(true);
    };

    const handleDeleteItem = (saleID, itemRow) => {
        window.alert(`Delete Item ${itemRow.name} from Sale ID: ${saleID}`);
    };

    const handleSaveItem = (e) => {
        e.preventDefault();
        setIsItemsPopupOpen(false);
    }

    const renderPurchaseItems = (row) => {
        const specificItems = orderItems; 

        const itemColumns = [
            { label: 'Product Name', key: 'name' },
            { label: 'Quantity', key: 'qty' },
            { label: 'Unit Price', key: 'price' }
        ];

        return (
            <div>
                <h4>Items for Purchase Order {row.saleID}</h4>
                <button onClick={() => handleAddItem(row.saleID)}>+ Add Item</button>
                <SimpleTable 
                    columns={itemColumns} 
                    data={specificItems} 
                    onEdit={(itemRow) => handleEditItem(row.saleID, itemRow)}
                    onDelete={(itemRow) => handleDeleteItem(row.saleID, itemRow)}
                />
            </div>
        );
    };

    return (
        <div>
            <h1>Purchases Orders</h1>
            <button onClick={handleAdd}>Add Purchase Order</button>
            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                title={currentRow ? "Edit Purchase" : "Create Purchase"}
            >
                <form key={currentRow?.purchaseOrderID || 'new-order'} onSubmit={handleSave}>
                    <label>Date:</label>
                    <input type="date" name="saleDate" defaultValue={currentRow?.saleDate}/>
                    <Dropdown
                        label="Vendor"
                        name="vendorID"
                        options={mockVendors}
                        valueKey="vendorID"    // What to save to DB (ID)
                        labelKey="vendorName"  // What to show user (Name)
                        selectedValue={currentRow?.vendorID}
                    />
                    <Dropdown
                        label="Warehouse"
                        name="warehouseID"
                        options={mockWarehouses}
                        valueKey="warehouseID"   
                        labelKey="warehouseName" 
                        selectedValue={currentRow?.warehouseID}
                    />
                    <button type="submit">Save</button>
                </form>
            </PopupForm>
            <PopupForm
                isOpen={isItemsPopupOpen}
                onClose={() => setIsItemsPopupOpen(false)}
                title={currentItem ? "Edit Order Item" : "Add Item to Order"}
            >
                <form key={currentItem?.name || 'new-item'} onSubmit={handleSaveItem}>
                    <label>Product Name:</label>
                    <input name="name" defaultValue={currentItem?.name || ''} />
                    <label>Quantity:</label>
                    <input name="qty" type="number" defaultValue={currentItem?.qty || 0} />
                    <label>Unit Price:</label>
                    <input name="price" type="number" step="0.01" defaultValue={currentItem?.price || 0} />
                    <button type="submit">Save Item</button>
                </form>
            </PopupForm>
            <DetailTable
                columns={columns}
                data={salesOrders}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderDetails={renderPurchaseItems}
            />
        </div>
    );
};

export default PurchaseOrdersPage;