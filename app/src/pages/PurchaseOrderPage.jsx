import React, { useState, useEffect } from 'react';
import DetailTable from '../components/DetailTable';
import SimpleTable from '../components/SimpleTable';
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown';

const PurchaseOrdersPage = () => {

    const columns = [
        { label: 'ID', key: 'purchaseOrderID' },
        { label: 'Date', key: 'purchaseDate' },
        { label: 'Vendor', key: 'vendorName' },
        { label: 'Warehouse', key: 'warehouseName' },
        { label: 'Total Cost', key: 'costOfPurchase' }
    ];

    const [purchaseOrders, setPurchaseOrders] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const [orderItems, setOrderItems] = useState([]);
    const [isItemsPopupOpen, setIsItemsPopupOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [targetPurchaseID, setTargetPurchaseID] = useState(null);

    // states for dropdowns
    const [vendors, setVendors] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [catalogItems, setCatalogItems] = useState([]);

    const fetchPurchaseOrders = async () => {
        try {
            const res = await fetch('/api/purchaseOrders');
            const data = await res.json();
            const formattedData = data.map(({ purchaseOrderID, purchaseDate, vendorID, vendorName, warehouseID, warehouseName, costOfPurchase }) => ({
                purchaseOrderID: purchaseOrderID,
                purchaseDate: purchaseDate ? purchaseDate.substring(0, 10) : '', // format date to YYYY-MM-DD
                vendorID: vendorID,
                vendorName: vendorName,
                warehouseID: warehouseID,
                warehouseName: warehouseName,
                costOfPurchase: costOfPurchase ? '$' + Number(costOfPurchase).toFixed(2) : '$0.00' // it is possible that costOfPurchase is null, default to 0
            }));
            setPurchaseOrders(formattedData);
        } catch (error) {
            console.error('Error fetching sales orders:', error);
        }
    };

    useEffect(() => {
        fetchPurchaseOrders();
    }, []);

    const fetchPurchaseItems = async () => {
        try {
            const res = await fetch('/api/purchaseOrderItems');
            const data = await res.json();
            const formattedData = data.map(({ purchaseOrderItemID, purchaseOrderID, productID, quantity, purchasePrice, productName }) => ({
                purchaseOrderItemID: purchaseOrderItemID,
                purchaseOrderID: purchaseOrderID,
                productID: productID,
                quantity: quantity,
                purchasePrice: purchasePrice,
                purchasePriceFormatted: '$' + Number(purchasePrice).toFixed(2),
                productName: productName
            }));
            setOrderItems(formattedData);
        } catch (error) {
            console.error('Error fetching purchase items:', error);
        }
    };

    useEffect(() => {
        fetchPurchaseItems();
    }, []);

    const fetchVendors = async () => {
        try {
            const res = await fetch('/api/vendors');
            const data = await res.json();
            const formattedData = data.map(({ vendorID, vendorName }) => ({
                vendorID: vendorID,
                vendorName: vendorName
            }));
            setVendors(formattedData);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const res = await fetch('/api/warehouses');
            const data = await res.json();
            const formattedData = data.map(({ warehouseID, warehouseName }) => ({
                warehouseID: warehouseID,
                warehouseName: warehouseName
            }));
            setWarehouses(formattedData);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchCatalog = async () => {
        try {
            const res = await fetch('/api/catalog');
            const data = await res.json();
            const formattedData = data.map(({ vendorProductID, vendorID, vendorName, productID, productName, costFromVendor }) => ({
                vendorProductID: vendorProductID,
                vendorID: vendorID,
                vendorName: vendorName,
                productID: productID,
                productName: productName,
                costFromVendor: costFromVendor
            }));
            setCatalogItems(formattedData);
        } catch (error) {
            console.error('Error fetching catalog:', error);
        }
    };

    useEffect(() => {
        fetchCatalog();
    }, []);


    // Handlers for Add/Edit/Delete
    // adapted from SaleOrderPage.jsx
    const handleSave = async (event) => {
        event.preventDefault();
        // Get the data from the form
        const formData = new FormData(event.target);
        // Format the data to match the database schema
        const purchaseOrderData = {
            purchaseDate: formData.get('purchaseDate'),
            vendorID: formData.get('vendorID'),
            warehouseID: formData.get('warehouseID')
        };

        try {
            let response;
            // If currentRow is not null, we are editing an existing sale order, otherwise we are creating one.
            if (currentRow) {
                response = await fetch(`/api/purchaseOrders/${currentRow.purchaseOrderID}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(purchaseOrderData) });
            } else {
                response = await fetch(`/api/purchaseOrders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(purchaseOrderData) });
            }
            const message = await response.text();
            if (response.ok) {
                alert(message);
                setIsPopupOpen(false); // Close popup on success
                fetchPurchaseOrders();
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error adding/updating purchase order:', error);
            alert('An error occurred while adding/updating the purchase order.');
        }
    }

    const handleEdit = (rowData) => {
        setCurrentRow(rowData);
        setIsPopupOpen(true);
    }

    const handleAdd = () => {
        setCurrentRow(null);
        setIsPopupOpen(true);
    }

    // adapted from SaleOrderPage.jsx
    const handleDelete = async (row) => {
        if (window.confirm("Are you sure you want to delete this?")) {
            try {
                const response = await fetch(`/api/purchaseOrders/${row.purchaseOrderID}`, { method: 'DELETE' });
                const message = await response.text();
                if (response.ok) {
                    alert(message);
                    fetchPurchaseOrders();
                } else {
                    alert(message);
                }
            } catch (error) {
                console.error('Error deleting purchase order:', error);
                alert('An error occurred while deleting the purchase order.');
            }
        }
    }

    // Inner table handlers

    const handleAddItem = (purchaseID) => {
        setTargetPurchaseID(purchaseID);
        setCurrentItem(null);
        setIsItemsPopupOpen(true);
    };

    const handleEditItem = (purchaseID, itemRow) => {
        setTargetPurchaseID(purchaseID);
        setCurrentItem(itemRow);
        setIsItemsPopupOpen(true);
    };

    const handleDeleteItem = async (itemRow) => {
        if (window.confirm("Are you sure you want to delete this?")) {
            try {
                const response = await fetch(`/api/purchaseOrderItems/${itemRow.purchaseOrderItemID}`, { method: 'DELETE' });
                const message = await response.text();
                if (response.ok) {
                    alert(message);
                    fetchPurchaseItems();
                    fetchPurchaseOrders(); // fetch orders so total cost is updated
                } else {
                    alert(message);
                }
            } catch (error) {
                console.error('Error deleting purchase order item:', error);
                alert('An error occurred while deleting the purchase order item.');
            }
        }
    };

    const handleSaveItem = async (event) => {
        event.preventDefault();
        // Get the data from the form
        const formData = new FormData(event.target);
        const selectedProductID = Number(formData.get('productID'));

        // Find the vendorID for the current purchase order
        const currentOrder = purchaseOrders.find(o => o.purchaseOrderID === targetPurchaseID);
        const orderVendorID = currentOrder ? currentOrder.vendorID : null;

        // Find the catalog item for this vendor and product
        const catalogEntry = catalogItems.find(c => c.vendorID === orderVendorID && c.productID === selectedProductID);
        const autoPurchasePrice = catalogEntry ? catalogEntry.costFromVendor : 0;

        // Format the data to match the database schema
        const purchaseOrderItemData = {
            purchaseOrderID: targetPurchaseID, // This is the sale order ID that the item is being added to, not allowed to be changed in form.
            productID: selectedProductID,
            quantity: formData.get('quantity'),
            purchasePrice: autoPurchasePrice
        };

        try {
            let response;
            // If currentRow is not null, we are editing an existing sale order, otherwise we are creating one.
            if (currentItem) {
                response = await fetch(`/api/purchaseOrderItems/${currentItem.purchaseOrderItemID}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(purchaseOrderItemData) });
            } else {
                response = await fetch(`/api/purchaseOrderItems`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(purchaseOrderItemData) });
            }
            const message = await response.text();
            if (response.ok) {
                alert(message);
                setIsItemsPopupOpen(false); // Close popup on success
                fetchPurchaseItems();
                fetchPurchaseOrders(); // fetch orders so total cost is updated
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error adding/updating purchase order item:', error);
            alert('An error occurred while adding/updating the purchase order item.');
        }
    }

    const renderPurchaseItems = (row) => {
        const itemColumns = [
            { label: 'Product Name', key: 'productName' },
            { label: 'Quantity', key: 'quantity' },
            { label: 'Purchase Price', key: 'purchasePriceFormatted' }
        ];

        return (
            <div>
                <h4>Items for Purchase Order #{row.purchaseOrderID}</h4>
                <button onClick={() => handleAddItem(row.purchaseOrderID)}>+ Add Item</button>
                <SimpleTable
                    columns={itemColumns}
                    data={orderItems.filter(item => item.purchaseOrderID === row.purchaseOrderID)}
                    onEdit={(itemRow) => handleEditItem(row.purchaseOrderID, itemRow)}
                    onDelete={handleDeleteItem}
                />
            </div>
        );
    };

    return (
        <div>
            <h1>Manage Purchase Orders</h1>
            <button onClick={handleAdd}>Add Purchase Order</button>
            <PopupForm
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={currentRow ? "Edit Purchase" : "Create Purchase"}
            >
                <form key={currentRow?.purchaseOrderID || 'new-order'} onSubmit={handleSave}>
                    <label>Date:</label>
                    <input type="date" name="purchaseDate" defaultValue={currentRow?.purchaseDate} />
                    <Dropdown
                        label="Vendor"
                        name="vendorID"
                        options={vendors}
                        valueKey="vendorID"    // What to save to DB (ID)
                        labelKey="vendorName"  // What to show user (Name)
                        selectedValue={currentRow?.vendorID}
                    />
                    <Dropdown
                        label="Warehouse"
                        name="warehouseID"
                        options={warehouses}
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
                {/* Find products specifically for the vendor of the target purchase order */}
                <form key={currentItem?.purchaseOrderItemID || 'new-item'} onSubmit={handleSaveItem}>
                    <Dropdown
                        label="Product (from selected Vendor)"
                        name="productID"
                        options={catalogItems.filter(c => c.vendorID === purchaseOrders.find(o => o.purchaseOrderID === targetPurchaseID)?.vendorID)}
                        valueKey="productID"
                        labelKey="productName"
                        selectedValue={currentItem?.productID}
                    />
                    <label>Quantity:</label>
                    <input name="quantity" type="number" defaultValue={currentItem?.quantity || 0} />
                    <button type="submit">Save Item</button>
                </form>
            </PopupForm>
            <DetailTable
                columns={columns}
                data={purchaseOrders}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderDetails={renderPurchaseItems}
            />
        </div>
    );
};

export default PurchaseOrdersPage;