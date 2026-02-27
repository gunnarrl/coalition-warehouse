import React, { useState, useEffect } from 'react';
import SimpleTable from '../components/SimpleTable';
import { HiUserAdd } from "react-icons/hi";
import PopupForm from '../components/PopupForm';

const CustomerPage = () => {
    const [customers, setCustomers] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentRow, setCurrentRow] = useState(null);

    useEffect(() => { // citation: https://maxrozen.com/fetching-data-react-with-useeffect
        const fetchCustomers = async () => {
            try {
                const res = await fetch('/customers');
                const data = await res.json();

                const formattedData = data.map(({ customerID, customerFN, customerLN, customerEmail, customerAddr }) => ({
                    customerId: customerID,
                    customerName: `${customerFN} ${customerLN}`,
                    customerEmail: customerEmail,
                    customerAddr: customerAddr
                }));

                setCustomers(formattedData);
            } catch (error) {
                console.error('Error fetching customers:', error);
            }
        };
        fetchCustomers();
    }, []);

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
            <h1>Manage Customers</h1>
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