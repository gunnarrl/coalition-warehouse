import React, { useState } from 'react';
import DetailTable from '../components/DetailTable';
import PopupForm from '../components/PopupForm';

// Sample data before we connect to the backend API
const initialVendors = [
    { vendorID: 1, vendorName: 'Martin GmbH', vendorAddr: '602 Road 93, Dublin, Ireland', vendorEmail: 'sales@martingmbh.com' },
    { vendorID: 2, vendorName: 'King Group', vendorAddr: '429 Road 86, Munich, Germany', vendorEmail: 'sales@kinggroup.com' },
    { vendorID: 3, vendorName: 'Nelson Group', vendorAddr: '344 Street 70, Singapore, Singapore', vendorEmail: 'sales@nelsongroup.com' },
    { vendorID: 4, vendorName: 'White Ltd', vendorAddr: '542 Strasse 81, Seoul, South Korea', vendorEmail: 'sales@whiteltd.com' },
    { vendorID: 5, vendorName: 'Carter Group', vendorAddr: '829 Ave 19, Amsterdam, Netherlands', vendorEmail: 'sales@cartergroup.com' },
];

// Same for all vendors for now, will be linked to vendorID in the DB.
const catalog = [
    { name: 'Premium Keyboard 591', qty: 0, price: 96.75 }, 
    { name: 'Ergonomic Mouse 654', qty: 0, price: 9.90 }, 
];

function VendorPage() {

    const [vendors, setVendors] = useState(initialVendors);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentVendor, setCurrentVendor] = useState(null);

    // Columns for the DetailTable, maps the DB fields to user-friendly names
    const columns = [
        { label: 'ID', key: 'vendorID' },
        { label: 'Name', key: 'vendorName' },
        { label: 'Address', key: 'vendorAddr' },
        { label: 'Email', key: 'vendorEmail' },
    ];

    // Passed to DetailTable to render the inventory details for each vendor
    const renderCatalog = (row) => {
        return (
            <div className="catalog-box">
                <h4>Catalog for {row.vendorName}</h4>
                <ul>
                    {catalog.map((item, i) => (
                        <li key={i}>{item.qty}x {item.name}</li>
                    ))}
                </ul>
                <button>Add Product to Catalog +</button>
            </div>
        );
    };

    // Handlers for Add/Edit/Delete, 
    // TODO: Connect these to the backend API and refresh the data after changes
    const handleAdd = () => {
        setCurrentVendor(null);
        setIsPopupOpen(true);
    };

    const handleEdit = (row) => {
        setCurrentVendor(row);
        setIsPopupOpen(true);
    };

    const handleDelete = (id) => {
        alert("Delete Vendor ID: " + id);
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert("Saved!");
        setIsPopupOpen(false);
    };

    return (
        <div className="page-container">
            <h1>Vendors</h1>
            <button onClick={handleAdd}>Add New Vendor</button>
            <DetailTable 
                columns={columns} 
                data={vendors} 
                onEdit={handleEdit} 
                onDelete={handleDelete}
                renderDetails={renderInventory}
            />
            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)}
                title={currentVendor ? "Edit Vendor" : "Add Vendor"}
            >
                <form onSubmit={handleSave}>
                    <label>Name:</label>
                    <input defaultValue={currentVendor?.vendorName || ''} />
                    <label>Address:</label>
                    <input defaultValue={currentVendor?.vendorAddr || ''} />
                    <label>Email:</label>
                    <input defaultValue={currentVendor?.vendorEmail || ''} />
                    <button type="submit">Save</button>
                </form>
            </PopupForm>
        </div>
    );
}

export default VendorPage;