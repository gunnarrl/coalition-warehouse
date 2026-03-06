import React, { useState, useEffect } from 'react';
import SimpleTable from '../components/SimpleTable';
import { HiUserAdd } from "react-icons/hi";
import PopupForm from '../components/PopupForm';

// Much of the code is reused from CustomerPage, but adapted for products. 
// The main differences are the fields we display and edit, and the API endpoints we would call (not implemented yet).



const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/products');
            const data = await res.json();
            const formattedData = data.map(({ productID, productName, listCost }) => ({
                productID: productID,
                productName: productName,
                listCost: listCost
            }));
            setProducts(formattedData);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Columns for the SimpleTable, maps the DB fields to user-friendly names
    const columns = [
        { key: 'productID', label: 'ID' },
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        // Get the data from the form
        const formData = new FormData(event.target);
        const productName = formData.get('productName');
        const listCost = formData.get('listCost');

        try {
            let response;
            // If currentRow is not null, we are editing an existing product, otherwise we are creating one.
            if (currentRow) {
                response = await fetch(`/products/${currentRow.productID}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productName, listCost }) });
            } else {
                response = await fetch(`/products`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productName, listCost }) });
            }
            const message = await response.text();
            if (response.ok) {
                alert(message);
                setIsPopupOpen(false); // Close popup on success
                fetchProducts();
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error adding/updating product:', error);
            alert('An error occurred while adding/updating the product.');
        }
    };

    const handleDelete = async (row) => {
        try {
            const response = await fetch(`/products/${row.productID}`, { method: 'DELETE' });
            const message = await response.text();
            if (response.ok) {
                alert(message);
                fetchProducts();
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('An error occurred while deleting the product.');
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
                <form onSubmit={handleSubmit}>
                    <label>Name:</label>
                    <input
                        type="text"
                        defaultValue={currentRow?.productName || ''}
                        name="productName"
                        required
                    />
                    <label>Price:</label>
                    <input
                        type="number"
                        step="0.01"
                        defaultValue={currentRow?.listCost || ''}
                        name="listCost"
                        required
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