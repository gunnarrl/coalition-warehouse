import React from 'react';
import Table from '../components/Table';
import { HiUserAdd } from "react-icons/hi";
import PopupForm from '../components/PopupForm';

const customers = [
    { id: 1, name: 'Alice Jones', email: 'alice@abc.com', phone: '555-1234' },
    { id: 2, name: 'Bob Smith', email: 'bob@abc.com', phone: '555-5678' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@abc.com', phone: '555-9012' },
];

const CustomerPage = () => {
    const [isPopupOpen, setIsPopupOpen] = React.useState(false);

    return (
        <div>
            <h1>Customer Page</h1>
            <Table data={customers}
            columns={['id', 'name', 'email', 'phone']} />
            <button onClick={() => setIsPopupOpen(true)}><HiUserAdd /> Add Customer</button>
            <PopupForm 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                title="Add Customer"
            >
                <form>
                    <label>Name:</label>
                    <input type="text" name="name" />
                    <label>Email:</label>
                    <input type="email" name="email" />
                    <label>Phone:</label>
                    <input type="text" name="phone" />
                    <button type="submit">Submit</button>
                </form>
            </PopupForm>
        </div>
    );
}

export default CustomerPage;