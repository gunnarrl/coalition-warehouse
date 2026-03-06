import React, { useState, useEffect } from 'react';
import SimpleTable from '../components/SimpleTable';
import { HiUserAdd } from "react-icons/hi";
import PopupForm from '../components/PopupForm';

const CustomerPage = () => {
    const [customers, setCustomers] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    const fetchCustomers = async () => {
        try {
            const res = await fetch('/customers');
            const data = await res.json();

            const formattedData = data.map(({ customerID, customerFN, customerLN, customerEmail, customerAddr }) => ({
                customerID: customerID,
                customerfName: customerFN,
                customerlName: customerLN,
                customerName: `${customerFN} ${customerLN}`,
                customerEmail: customerEmail,
                customerAddr: customerAddr
            }));

            setCustomers(formattedData);
        } catch (error) {
            console.error('Error fetching customers:', error);
        }
    };

    useEffect(() => { // citation: https://maxrozen.com/fetching-data-react-with-useeffect
        fetchCustomers();
    }, []);

    // Columns for the SimpleTable, maps the DB fields to user-friendly names
    const columns = [
        { key: 'customerID', label: 'ID' },
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        // get the form data
        const formData = new FormData(event.target);
        // format the data to match the database schema
        const customerData = {
            customerfName: formData.get('customerfName'),
            customerlName: formData.get('customerlName'),
            customerEmail: formData.get('customerEmail'),
            customerAddr: formData.get('customerAddr')
        };
        try {
            let response;
            // If currentRow is not null, we are editing an existing customer, otherwise we are creating a new one.
            if (currentRow) {
                response = await fetch(`/customers/${currentRow.customerID}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(customerData) });
            } else {
                response = await fetch('/customers', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(customerData) });
            }
            const message = await response.text();
            if (response.ok) {
                alert(message);
                fetchCustomers();
                setIsPopupOpen(false);
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error adding customer:', error);
            alert('An error occurred while adding the customer.');
        }
    };

    const handleDelete = async (row) => {
        try {
            const response = await fetch(`/customers/${row.customerID}`, { method: 'DELETE' });
            const message = await response.text();
            if (response.ok) {
                alert(message);
                fetchCustomers();
            } else {
                alert(message);
            }
        } catch (error) {
            console.error('Error deleting customer:', error);
            alert('An error occurred while deleting the customer.');
        }
    };

    return (
        <div>
            <h1>Manage Customers</h1>
            <button onClick={handleAdd}>
                <HiUserAdd /> Add Customer
            </button>
            <PopupForm
                isOpen={isPopupOpen}
                onClose={() => setIsPopupOpen(false)}
                title={currentRow ? 'Edit Customer' : 'Add Customer'}
            >
                <form onSubmit={handleSubmit}>
                    <label>First Name:</label>
                    <input
                        type="text"
                        defaultValue={currentRow?.customerfName || ''}
                        name="customerfName"
                        required
                    />
                    <label>Last Name:</label>
                    <input
                        type="text"
                        defaultValue={currentRow?.customerlName || ''}
                        name="customerlName"
                        required
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