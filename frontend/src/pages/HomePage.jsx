import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the sample data?")) {
            console.log("Resetting database...");
        }
    };

    return (
        <div>
            <h1>Coalition Warehouse Manager</h1>
            <p>Internal management system for tracking products, vendors, warehouses, customers, and orders.</p>
            <ul>
                <li><Link to="/products">Manage Products</Link> — Browse, add, edit, and remove products in the catalog.</li>
                <li><Link to="/vendors">Manage Vendors</Link> — View vendors and manage the products they supply.</li>
                <li><Link to="/warehouses">Manage Warehouses</Link> — Track warehouse locations and their inventory on hand.</li>
                <li><Link to="/customers">Manage Customers</Link> — Add and update customer records.</li>
                <li><Link to="/purchase-orders">Purchase Orders</Link> — Create and review orders placed with vendors.</li>
                <li><Link to="/sale-orders">Sales Orders</Link> — Create and review orders fulfilled to customers.</li>
            </ul>
            <button className='danger' onClick={handleReset}>Reset Sample Data</button>
        </div>
    );
};

export default HomePage;