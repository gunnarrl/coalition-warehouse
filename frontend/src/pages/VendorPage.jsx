import React, { useState, useEffect } from 'react';
import DetailTable from '../components/DetailTable';
import SimpleTable from '../components/SimpleTable';
import PopupForm from '../components/PopupForm';
import Dropdown from '../components/Dropdown';

// Basically the same as WarehousePage but for Vendors. 
// Most of the code is reused with variable name changes and different table references.

function VendorPage() {
    const [vendors, setVendors] = useState([]);

    // Vendor Popup State
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentVendor, setCurrentVendor] = useState(null);

    // Catalog Popup State
    const [catalogItems, setCatalogItems] = useState([]);
    const [isCatalogPopupOpen, setIsCatalogPopupOpen] = useState(false);
    const [currentCatalogItem, setCurrentCatalogItem] = useState(null);
    const [targetVendorID, setTargetVendorID] = useState(null);

    // products for dropdown
    const [products, setProducts] = useState([]);

    const fetchVendors = async () => {
        try {
            const res = await fetch('/vendors');
            const data = await res.json();
            const formattedData = data.map(({ vendorID, vendorName, vendorAddr, vendorEmail }) => ({
                vendorID: vendorID,
                vendorName: vendorName,
                vendorAddr: vendorAddr,
                vendorEmail: vendorEmail
            }));
            setVendors(formattedData);
        } catch (error) {
            console.error('Error fetching vendors:', error);
        }
    };

    useEffect(() => {
        fetchVendors();
    }, []);

    const fetchCatalog = async () => {
        try {
            const res = await fetch('/catalog');
            const data = await res.json();
            const formattedData = data.map(({ vendorID, vendorName, productID, productName, costFromVendor }) => ({
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

    const columns = [
        { label: 'ID', key: 'vendorID' },
        { label: 'Name', key: 'vendorName' },
        { label: 'Address', key: 'vendorAddr' },
        { label: 'Email', key: 'vendorEmail' },
    ];

    const renderCatalog = (row) => {
        const specificCatalog = catalogItems;

        const catalogColumns = [
            { label: 'Product Name', key: 'productName' },
            { label: 'Cost From Vendor', key: 'costFromVendor' }
        ];

        return (
            <div>
                <h4>Catalog for {row.vendorName}</h4>
                <button onClick={() => handleAddCatalogItem(row.vendorID)}>+ Add Product to Catalog</button>
                <SimpleTable
                    data={catalogItems.filter(item => item.vendorID === row.vendorID)}
                    columns={catalogColumns}
                    onEdit={(itemRow) => handleEditCatalogItem(row.vendorID, itemRow)}
                    onDelete={(itemRow) => handleDeleteCatalogItem(row.vendorID, itemRow)}
                />
            </div>
        );
    };

    // Add/Edit/Delete handlers
    const handleAdd = () => {
        setCurrentVendor(null);
        setIsPopupOpen(true);
    };

    const handleEdit = (row) => {
        setCurrentVendor(row);
        setIsPopupOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert("Vendor Saved!");
        setIsPopupOpen(false);
    };

    const handleDelete = (id) => {
        alert("Delete Vendor ID: " + id);
    };

    // Inner Table handlers
    const handleAddCatalogItem = (vendorID) => {
        setTargetVendorID(vendorID);
        setCurrentCatalogItem(null);
        setIsCatalogPopupOpen(true);
    };

    const handleEditCatalogItem = (vendorID, itemRow) => {
        setTargetVendorID(vendorID);
        setCurrentCatalogItem(itemRow);
        setIsCatalogPopupOpen(true);
    };

    const handleSaveCatalogItem = (e) => {
        e.preventDefault();
        alert(`Saved ${currentCatalogItem ? "changes to" : "new"} product for Vendor ID ${targetVendorID}`);
        setIsCatalogPopupOpen(false);
    };

    const handleDeleteCatalogItem = (vendorID, itemRow) => {
        alert(`Removed ${itemRow.name} from Vendor ID ${vendorID}`);
    };

    return (
        <div>
            <h1>Manage Vendors</h1>
            <button onClick={handleAdd}>Add New Vendor</button>
            <PopupForm
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={currentVendor ? "Edit Vendor" : "Add Vendor"}
            >
                <form key={currentVendor?.vendorID || 'new-vendor'} onSubmit={handleSave}>
                    <label>Name:</label>
                    <input name="vendorName" defaultValue={currentVendor?.vendorName || ''} />
                    <label>Address:</label>
                    <input name="vendorAddr" defaultValue={currentVendor?.vendorAddr || ''} />
                    <label>Email:</label>
                    <input name="vendorEmail" defaultValue={currentVendor?.vendorEmail || ''} />
                    <button type="submit">Save Vendor</button>
                </form>
            </PopupForm>
            <PopupForm
                isOpen={isCatalogPopupOpen}
                onClose={() => setIsCatalogPopupOpen(false)}
                title={currentCatalogItem ? "Edit Catalog Product" : "Add Product to Catalog"}
            >
                <form key={currentCatalogItem?.name || 'new-cat-item'} onSubmit={handleSaveCatalogItem}>
                    <Dropdown
                        label="Product"
                        name="productID"
                        options={products}
                        valueKey="productID"
                        labelKey="productName"
                        selectedValue={currentCatalogItem?.productID}
                    />
                    <label>Cost From Vendor:</label>
                    <input name="costFromVendor" type="number" step="0.01" defaultValue={currentCatalogItem?.costFromVendor || 0} />
                    <button type="submit">Save Product</button>
                </form>
            </PopupForm>
            <DetailTable
                columns={columns}
                data={vendors}
                onEdit={handleEdit}
                onDelete={handleDelete}
                renderDetails={renderCatalog}
            />
        </div>
    );
}

export default VendorPage;