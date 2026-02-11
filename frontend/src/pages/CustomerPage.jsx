import React from 'react';
import Table from '../components/SimpleTable';
import { HiUserAdd } from "react-icons/hi";
import PopupForm from '../components/PopupForm';

const customers = [
    { id: 1, name: 'Alice Jones', email: 'alice@abc.com', phone: '555-1234' },
    { id: 2, name: 'Bob Smith', email: 'bob@abc.com', phone: '555-5678' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@abc.com', phone: '555-9012' },
];

const CustomerPage = () => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);
    const [currentRow, setCurrentRow] = React.useState(null);

    const handleEdit = (row) => {
        setCurrentRow(row); // Save the row data
        setIsPopupOpen(true);
    };

    const handleAdd = () => {
        setCurrentRow(null); // Clear the data
        setIsPopupOpen(true);
    };

    const handleDelete = (row) => {
        if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
            // talk to backend to delete
        }
    };

    return (
        <div>
            <h1>Customer Page</h1>
            <SimpleTable 
                data={customers}
                columns={['id', 'name', 'email', 'phone']}
                onEdit={handleEdit}
                onDelete={handleDelete} 
            />
            <button onClick={handleAdd}><HiUserAdd /> Add Customer</button>
            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                title={currentRow ? 'Edit Customer' : 'Add Customer'}
            >
                <form>
                    <label>Name:</label>
                    <input 
                        type="text"
                        defaultValue={currentRow?.name || ''}
                        name="name" 
                    />
                    <label>Email:</label>
                    <input 
                        type="email" 
                        defaultValue={currentRow?.email || ''}
                        name="email" 
                    />
                    <label>Phone:</label>
                    <input 
                        type="text"
                        defaultValue={currentRow?.phone || ''}
                        name="phone" 
                    />
                    <button type="submit">Submit</button>
                </form>
            </PopupForm>
        </div>
    );
}

export default CustomerPage;