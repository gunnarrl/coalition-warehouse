import React from 'react';
import SimpleTable from '../components/SimpleTable';
import { HiUserAdd } from "react-icons/hi";
import PopupForm from '../components/PopupForm';

// Much of the code is reused from CustomerPage, but adapted for products. 
// The main differences are the fields we display and edit, and the API endpoints we would call (not implemented yet).
const products = [
    { productId: 1, productName: 'Premium Keyboard 591', listCost: 299.89 },
    { productId: 2, productName: 'Plastic Drawer 653', listCost: 297.88 },
    { productId: 3, productName: 'Steel Desk 473', listCost: 441.74 },
    { productId: 4, productName: 'Ergonomic Mouse 654', listCost: 220.62 },
];

const ProductPage = () => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState(null);

    // Columns for the SimpleTable, maps the DB fields to user-friendly names
    const columns = [
        { key: 'productId', label: 'ID' },
        { key: 'productName', label: 'Name' },
        { key: 'listCost', label: 'Price' },
    ];

    // TODO: Implement API calls for edit, add, delete, then refresh the displayed data.
    const handleEdit = (row) => {
        setCurrentRow(row);
        setIsPopupOpen(true);
    };

    const handleAdd = () => {
        setCurrentRow(null);
        setIsPopupOpen(true);
    };

    const handleDelete = (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.productName}?`)) {
            console.log("Deleting ID:", row.productId);
        }
    };

    return (
        <div>
            <h1>Manage Products</h1>
            <button onClick={handleAdd}>
                <HiUserAdd /> Add Product
            </button>
            <PopupForm
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={currentRow ? 'Edit Product' : 'Add Product'}
            >
                <form>
                    <label>Name:</label>
                    <input
                        type="text"
                        defaultValue={currentRow?.productName || ''}
                        name="ProductName"
                    />
                    <label>Price:</label>
                    <input
                        type="text"
                        defaultValue={currentRow?.listCost || ''}
                        name="listCost"
                    />
                    <button type="submit">Submit</button>
                </form>
            </PopupForm>
            <SimpleTable
                data={products}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default ProductPage;