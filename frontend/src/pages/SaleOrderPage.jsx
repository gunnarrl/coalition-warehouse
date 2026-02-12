import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import SimpleTable from '../components/SimpleTable'; // Added SimpleTable
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown'; 

const mockSalesOrders = [
    { saleOrderID: 1, saleDate: '2024-12-05', customerID: 1, customerName: 'Anna Hernandez', warehouseID: 4, warehouseName: 'West Coast Depot' },
    { saleOrderID: 2, saleDate: '2024-05-20', customerID: 3, customerName: 'Amanda Campbell', warehouseID: 3, warehouseName: 'East Coast Hub' },
    { saleOrderID: 3, saleDate: '2024-12-12', customerID: 2, customerName: 'Brenda White', warehouseID: 1, warehouseName: 'North Distribution' },
    { saleOrderID: 4, saleDate: '2024-02-08', customerID: 4, customerName: 'Betty Martin', warehouseID: 2, warehouseName: 'South Fulfillment' }
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

const initialSalesOrderItems = [
    { name: 'Ergonomic Mouse 654', qty: 4, price: 250.00 }, 
    { name: 'Steel Desk 473', qty: 5, price: 450.00 },     
];

const SalesOrdersPage = () => {

    const columns = [
        { label: 'ID', key: 'saleOrderID' },
        { label: 'Date', key: 'saleDate' },
        { label: 'Customer', key: 'customerName' }, 
        { label: 'Warehouse', key: 'warehouseName' } 
    ];

    const [salesOrders, setSalesOrders] = useState(mockSalesOrders);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const [saleItems, setSaleItems] = useState(initialSalesOrderItems);
    const [isItemsPopupOpen, setIsItemsPopupOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [targetSaleID, setTargetSaleID] = useState(null);

    // Handlers for Add/Edit/Delete
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
        window.alert(`Delete Sale Order ID: ${rowData.saleOrderID}`);
    }

    // item handlers
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

    const renderSaleItems = (row) => {
        const specificItems = saleItems;

        const itemColumns = [
            { label: 'Product Name', key: 'name' },
            { label: 'Quantity', key: 'qty' },
            { label: 'Unit Price', key: 'price' }
        ];
        return (
            <div>
                <h4>Items in Sale #{row.saleOrderID}</h4>
                <button onClick={() => handleAddItem(row.saleOrderID)}>+ Add Item</button>
                <SimpleTable 
                    columns={itemColumns}
                    data={specificItems}
                    onEdit={(itemRow) => handleEditItem(row.saleOrderID, itemRow)}
                    onDelete={(itemRow) => handleDeleteItem(row.saleOrderID, itemRow)}
                />
            </div>
        );
    };

    return (
        <div>
            <h1>Sales Orders</h1>
            <button onClick={handleAdd}>Add Sale Order</button>
            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                title={currentRow ? "Edit Sale" : "Create Sale"}
            >
                <form key={currentRow?.saleOrderID || 'new-sale'} onSubmit={handleSave}>
                    <label>Date:</label>
                    <input type="date" name="saleDate" defaultValue={currentRow?.saleDate}/>
                    <Dropdown
                        label="Customer"
                        name="customerID"
                        options={mockCustomers}
                        valueKey="customerID"
                        labelKey="customerName"
                        selectedValue={currentRow?.customerID}
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
                title={currentItem ? "Edit Item" : "Add Item"}
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
                renderDetails={renderSaleItems}
            />
        </div>
    );
};

export default SalesOrdersPage;