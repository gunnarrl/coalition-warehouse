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
    const [targetSaleID, setTargetSaleID] = useState(null);

    // states for dropdowns
    const [vendors, setVendors] = useState([]);
    const [warehouses, setWarehouses] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchPurchasesOrders = async () => {
            try {
                const res = await fetch('/purchaseOrders');
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
        fetchPurchasesOrders();
    }, []);

    useEffect(() => {
        const fetchPurchaseItems = async () => {
            try {
                const res = await fetch('/purchaseOrderItems');
                const data = await res.json();
                const formattedData = data.map(({ purchaseOrderID, productID, quantity, purchasePrice, productName }) => ({
                    purchaseOrderID: purchaseOrderID,
                    productID: productID,
                    quantity: quantity,
                    purchasePrice: '$' + Number(purchasePrice).toFixed(2),
                    productName: productName
                }));
                setOrderItems(formattedData);
            } catch (error) {
                console.error('Error fetching purchase items:', error);
            }
        };
        fetchPurchaseItems();
    }, []);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const res = await fetch('/vendors');
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
        fetchVendors();
    }, []);

    useEffect(() => {
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
        fetchWarehouses();
    }, []);

    useEffect(() => {
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
        fetchProducts();
    }, []);


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
        const itemColumns = [
            { label: 'Product Name', key: 'productName' },
            { label: 'Quantity', key: 'quantity' },
            { label: 'Purchase Price', key: 'purchasePrice' }
        ];

        return (
            <div>
                <h4>Items for Purchase Order #{row.purchaseOrderID}</h4>
                <button onClick={() => handleAddItem(row.purchaseOrderID)}>+ Add Item</button>
                <SimpleTable
                    columns={itemColumns}
                    data={orderItems.filter(item => item.purchaseOrderID === row.purchaseOrderID)}
                    onEdit={(itemRow) => handleEditItem(row.purchaseOrderID, itemRow)}
                    onDelete={(itemRow) => handleDeleteItem(row.purchaseOrderID, itemRow)}
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
                <form key={currentItem?.name || 'new-item'} onSubmit={handleSaveItem}>
                    <Dropdown
                        label="Product"
                        name="productID"
                        options={products}
                        valueKey="productID"
                        labelKey="productName"
                        selectedValue={currentRow?.productID}
                    />
                    <label>Quantity:</label>
                    <input name="qty" type="number" defaultValue={currentItem?.qty || 0} />
                    <label>Unit Price:</label>
                    <input name="price" type="number" step="0.01" defaultValue={currentItem?.price || 0} />
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