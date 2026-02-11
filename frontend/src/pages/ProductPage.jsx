import React from 'react';
import SimpleTable from '../components/SimpleTable';
import { HiUserAdd } from "react-icons/hi";
import PopupForm from '../components/PopupForm';

// Much of the code is reused from CustomerPage, but adapted for products. 
// The main differences are the fields we display and edit, and the API endpoints we would call (not implemented yet).
const products = [
    // customerName will be the combination of fname and lname in the DB. For processing, we can split it back into fname/lname when sending to the API
    { productId: 1, productName: 'Multivitamin', listCost: 9.99 },
    { productId: 2, productName: 'Air Fryer', listCost: 49.99 },
    { productId: 3, productName: 'Trash Can', listCost: 24.99 },
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
        if (window.confirm(`Are you sure you want to delete ${row.customerName}?`)) {
            console.log("Deleting ID:", row.customerId);
        }
    };

    return (
        <div>
            <h1>Products Page</h1>
            <SimpleTable 
                data={products}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete} 
            />
            <button onClick={handleAdd}>
                <HiUserAdd /> Add Customer
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
        </div>
    );
}

export default ProductPage;