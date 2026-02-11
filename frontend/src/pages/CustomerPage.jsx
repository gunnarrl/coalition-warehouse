import React from 'react';
import SimpleTable from '../components/SimpleTable';
import { HiUserAdd } from "react-icons/hi";
import PopupForm from '../components/PopupForm';

const customers = [
    { customerId: 1, customerName: 'Alice Jones', customerEmail: 'alice@abc.com', customerAddr: '111 1st Street' },
    { customerId: 2, customerName: 'Bob Smith', customerEmail: 'bob@abc.com', customerAddr: '222 2nd Street' },
    { customerId: 3, customerName: 'Charlie Brown', customerEmail: 'charlie@abc.com', customerAddr: '333 3rd Street' },
];

const CustomerPage = () => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState(null);

    // Columns for the SimpleTable, maps the DB fields to user-friendly names
    const columns = [
        { key: 'customerId', label: 'ID' },
        { key: 'customerName', label: 'Name' },
        { key: 'customerEmail', label: 'Email' },
        { key: 'customerAddr', label: 'Address' }
    ];

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
            // TODO: Call API to delete customer, then refresh data
        }
    };

    return (
        <div>
            <h1>Customer Page</h1>
            <SimpleTable 
                data={customers}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete} 
            />
            <button onClick={handleAdd} style={{ marginTop: '1rem' }}>
                <HiUserAdd /> Add Customer
            </button>
            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                title={currentRow ? 'Edit Customer' : 'Add Customer'}
            >
                <form>
                    <label>Name:</label>
                    <input 
                        type="text"
                        defaultValue={currentRow?.customerName || ''}
                        name="customerName" 
                    />
                    <label>Email:</label>
                    <input 
                        type="email" 
                        defaultValue={currentRow?.customerEmail || ''}
                        name="customerEmail" 
                    />
                    <label>Address:</label>
                    <input 
                        type="text"
                        defaultValue={currentRow?.customerAddr || ''}
                        name="customerAddr" 
                    />
                    <button type="submit">Submit</button>
                </form>
            </PopupForm>
        </div>
    );
}

export default CustomerPage;