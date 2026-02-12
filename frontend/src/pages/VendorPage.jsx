import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import SimpleTable from '../components/SimpleTable'; 
import PopupForm from '../components/PopupForm';

// Basically the same as WarehousePage but for Vendors. 
// Most of the code is reused with variable name changes and different table references.
const initialVendors = [
    { vendorID: 1, vendorName: 'Martin GmbH', vendorAddr: '602 Road 93, Dublin, Ireland', vendorEmail: 'sales@martingmbh.com' },
    { vendorID: 2, vendorName: 'King Group', vendorAddr: '429 Road 86, Munich, Germany', vendorEmail: 'sales@kinggroup.com' },
    { vendorID: 3, vendorName: 'Nelson Group', vendorAddr: '344 Street 70, Singapore, Singapore', vendorEmail: 'sales@nelsongroup.com' },
    { vendorID: 4, vendorName: 'White Ltd', vendorAddr: '542 Strasse 81, Seoul, South Korea', vendorEmail: 'sales@whiteltd.com' },
    { vendorID: 5, vendorName: 'Carter Group', vendorAddr: '829 Ave 19, Amsterdam, Netherlands', vendorEmail: 'sales@cartergroup.com' },
];

const initialCatalog = [
    { name: 'Premium Keyboard 591', qty: 50, price: 96.75 }, 
    { name: 'Ergonomic Mouse 654', qty: 200, price: 9.90 }, 
];

function VendorPage() {
    const [vendors, setVendors] = useState(initialVendors);
    
    // --- Vendor Popup State ---
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentVendor, setCurrentVendor] = useState(null);

    // --- Catalog Popup State (New) ---
    const [catalogItems, setCatalogItems] = useState(initialCatalog);
    const [isCatalogPopupOpen, setIsCatalogPopupOpen] = useState(false);
    const [currentCatalogItem, setCurrentCatalogItem] = useState(null);
    const [targetVendorID, setTargetVendorID] = useState(null);

    const columns = [
        { label: 'ID', key: 'vendorID' },
        { label: 'Name', key: 'vendorName' },
        { label: 'Address', key: 'vendorAddr' },
        { label: 'Email', key: 'vendorEmail' },
    ];

    const renderCatalog = (row) => {
        const specificCatalog = catalogItems;

        const catalogColumns = [
            { label: 'Product Name', key: 'name' },
            { label: 'Min Quantity', key: 'qty' }, 
            { label: 'Unit Price', key: 'price' }
        ];

        return (
            <div>
                <h4>Catalog for {row.vendorName}</h4>
                <button onClick={() => handleAddCatalogItem(row.vendorID)}>+ Add Product to Catalog</button>
                <SimpleTable 
                    data={specificCatalog}
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
            <h1>Vendors</h1>
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
                    <label>Product Name:</label>
                    <input name="name" defaultValue={currentCatalogItem?.name || ''} />
                    <label>Min Qty:</label>
                    <input name="qty" type="number" defaultValue={currentCatalogItem?.qty || 0} />
                    <label>Unit Price:</label>
                    <input name="price" type="number" step="0.01" defaultValue={currentCatalogItem?.price || 0} />
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