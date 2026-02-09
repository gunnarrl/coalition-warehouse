import React from 'react';
import Table from '../components/Table';
import { HiUserAdd } from "react-icons/hi";

const customers = [
    { id: 1, name: 'Alice Jones', email: 'alice@abc.com', phone: '555-1234' },
    { id: 2, name: 'Bob Smith', email: 'bob@abc.com', phone: '555-5678' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@abc.com', phone: '555-9012' },
];

const CustomerPage = () => {
    return (
        <div>
            <h1>Customer Page</h1>
            <Table data={customers}
            columns={['id', 'name', 'email', 'phone']} />
            <button style={{ marginTop: '20px' }}><HiUserAdd /> Add Customer</button>
        </div>
    );
}

export default CustomerPage;