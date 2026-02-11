import React from 'react';
import SimpleTable from '../components/SimpleTable';
import { HiUserAdd } from "react-icons/hi";
import PopupForm from '../components/PopupForm';

const customers = [
    // customerName will be the combination of fname and lname in the DB. For processing, we can split it back into fname/lname when sending to the API
    { customerId: 1, customerName: 'Anna Hernandez', customerEmail: 'anna.hernandez1@example.com', customerAddr: '213 Park Rd, Los Angeles, CA' },
    { customerId: 2, customerName: 'Brenda White', customerEmail: 'brenda.white2@example.com', customerAddr: '493 Elm St, Houston, TX' },
    { customerId: 3, customerName: 'Amanda Campbell', customerEmail: 'amanda.campbell3@example.com', customerAddr: '229 Pine St, Philadelphia, PA' },
    { customerId: 4, customerName: 'Betty Martin', customerEmail: 'betty.martin4@example.com', customerAddr: '389 Lakeview Dr, San Jose, CA' },
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
            <button onClick={handleAdd}>
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
            <SimpleTable 
                data={customers}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete} 
            />
        </div>
    );
}

export default CustomerPage;