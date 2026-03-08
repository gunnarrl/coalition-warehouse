import React, { useState, useEffect } from 'react';
import DetailTable from '../components/DetailTable';
import SimpleTable from '../components/SimpleTable';
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown';

const SalesOrdersPage = () => {

    const columns = [
        { label: 'ID', key: 'saleOrderID' },
        { label: 'Date', key: 'saleDate' },
        { label: 'Customer', key: 'customerName' },
        { label: 'Warehouse', key: 'warehouseName' },
        { label: 'Total Cost', key: 'costOfOrder' }
    ];

    const [salesOrders, setSalesOrders] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const [saleItems, setSaleItems] = useState([]);
    const [isItemsPopupOpen, setIsItemsPopupOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);
    const [targetSaleID, setTargetSaleID] = useState(null);

    // states to populate dropdown menus
    const [customers, setCustomers] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);

    const fetchSalesOrders = async () => {
        try {
            const res = await fetch('/salesOrders');
            const data = await res.json();
            const formattedData = data.map(({ saleOrderID, saleDate, customerID, customerFN, customerLN, warehouseID, warehouseName, costOfSale }) => ({
                saleOrderID: saleOrderID,
                saleDate: saleDate ? saleDate.substring(0, 10) : '', // format date to YYYY-MM-DD
                customerID: customerID,
                customerName: customerFN + ' ' + customerLN,
                warehouseID: warehouseID,
                warehouseName: warehouseName,
                costOfSale: costOfSale ? '$' + Number(costOfSale).toFixed(2) : '$0.00' // it is possible that costOfSale is null, default to 0
            }));
            setSalesOrders(formattedData);
        } catch (error) {
            console.error('Error fetching sales orders:', error);
        }
    };

    useEffect(() => {
        fetchSalesOrders();
    }, []);

    const fetchSaleItems = async () => {
        try {
            const res = await fetch('/salesOrderItems');
            const data = await res.json();
            const formattedData = data.map(({ saleOrderID, productID, quantity, salePrice, productName }) => ({
                saleOrderID: saleOrderID,
                productID: productID,
                quantity: quantity,
                salePrice: '$' + Number(salePrice).toFixed(2),
                productName: productName
            }));
            setSaleItems(formattedData);
        } catch (error) {
            console.error('Error fetching sale items:', error);
        }
    };

    useEffect(() => {
        fetchSaleItems();
    }, []);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/customers');
            const data = await res.json();
            const formattedData = data.map(({ customerID, customerFN, customerLN }) => ({
                customerID: customerID,
                customerName: customerFN + ' ' + customerLN
            }));
            setCustomers(formattedData);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const res = await fetch('/warehouses');
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

    const fetchProducts = async () => {
        try {
            const res = await fetch('/products');
            const data = await res.json();
            const formattedData = data.map(({ productID, productName }) => ({
                productID: productID,
                productName: productName
            }));
            setProducts(formattedData);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handlers for Add/Edit/Delete
    // adapted from ProductPage.jsx
    const handleSave = async (event) => {
        event.preventDefault();
        // Get the data from the form
        const formData = new FormData(event.target);
        // Format the data to match the database schema
        const saleOrderData = {
            saleDate: formData.get('saleDate'),
            customerID: formData.get('customerID'),
            warehouseID: formData.get('warehouseID')
        };

        try {
            let response;
            // If currentRow is not null, we are editing an existing sale order, otherwise we are creating one.
            if (currentRow) {
                response = await fetch(`/salesOrders/${currentRow.saleOrderID}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(saleOrderData) });
            } else {
                response = await fetch(`/salesOrders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(saleOrderData) });
            }
            const message = await response.text();
            if (response.ok) {
                alert(message);
                setIsPopupOpen(false); // Close popup on success
                fetchSalesOrders();
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error adding/updating sale order:', error);
            alert('An error occurred while adding/updating the sale order.');
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

    // adapted from ProductPage.jsx
    const handleDelete = async (row) => {
        try {
            const response = await fetch(`/salesOrders/${row.saleOrderID}`, { method: 'DELETE' });
            const message = await response.text();
            if (response.ok) {
                alert(message);
                fetchSalesOrders();
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error deleting sale order:', error);
            alert('An error occurred while deleting the sale order.');
        }
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

    const handleDeleteItem = async (itemRow) => {
        try {
            const response = await fetch(`/salesOrderItems/${itemRow.saleOrderItemID}`, { method: 'DELETE' });
            const message = await response.text();
            if (response.ok) {
                alert(message);
                fetchSaleItems();
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error deleting sale order item:', error);
            alert('An error occurred while deleting the sale order item.');
        }
    };

    const handleSaveItem = async (event) => {
        event.preventDefault();
        // Get the data from the form
        const formData = new FormData(event.target);
        // Format the data to match the database schema
        const saleOrderItemData = {
            saleOrderID: formData.get('saleOrderID'),
            productID: formData.get('productID'),
            quantity: formData.get('quantity'),
            salePrice: formData.get('salePrice')
        };

        try {
            let response;
            // If currentRow is not null, we are editing an existing sale order, otherwise we are creating one.
            if (currentItem) {
                response = await fetch(`/salesOrderItems/${currentItem.saleOrderItemID}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(saleOrderItemData) });
            } else {
                response = await fetch(`/salesOrderItems`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(saleOrderItemData) });
            }
            const message = await response.text();
            if (response.ok) {
                alert(message);
                setIsItemsPopupOpen(false); // Close popup on success
                fetchSaleItems();
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error adding/updating sale order item:', error);
            alert('An error occurred while adding/updating the sale order item.');
        }
    }

    const renderSaleItems = (row) => {

        const itemColumns = [
            { label: 'Product Name', key: 'productName' },
            { label: 'Quantity', key: 'quantity' },
            { label: 'Sale Price', key: 'salePrice' }
        ];
        return (
            <div>
                <h4>Items in Sale #{row.saleOrderID}</h4>
                <button onClick={() => handleAddItem(row.saleOrderID)}>+ Add Item</button>
                <SimpleTable
                    columns={itemColumns}
                    data={saleItems.filter(item => item.saleOrderID === row.saleOrderID)}
                    onEdit={(itemRow) => handleEditItem(row.saleOrderID, itemRow)}
                    onDelete={(itemRow) => handleDeleteItem(row.saleOrderID, itemRow)}
                />
            </div>
        );
    };

    return (
        <div>
            <h1>Manage Sales Orders</h1>
            <button onClick={handleAdd}>Add Sale Order</button>
            <PopupForm
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={currentRow ? "Edit Sale" : "Create Sale"}
            >
                <form key={currentRow?.saleOrderID || 'new-sale'} onSubmit={handleSave}>
                    <label>Date:</label>
                    <input type="date" name="saleDate" defaultValue={currentRow?.saleDate} />
                    <Dropdown
                        label="Customer"
                        name="customerID"
                        options={customers}
                        valueKey="customerID"
                        labelKey="customerName"
                        selectedValue={currentRow?.customerID}
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
                title={currentItem ? "Edit Item" : "Add Item"}
            >
                <form key={currentItem?.name || 'new-item'} onSubmit={handleSaveItem}>
                    <Dropdown
                        label="Product"
                        name="productID"
                        options={products}
                        valueKey="productID"
                        labelKey="productName"
                        selectedValue={currentItem?.productID}
                    />
                    <label>Quantity:</label>
                    <input name="quantity" type="number" defaultValue={currentItem?.quantity || 0} />

                    <label>Sale Price:</label>
                    <input name="salePrice" type="number" step="0.01" defaultValue={currentItem?.salePrice || 0} />

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