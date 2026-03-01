import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete the Premium Keyboard 591?")) {
            console.log("Deleting keyboard...");
            try {
                const response = await fetch('/products/delete-premium-keyboard');
                if (response.ok) {
                    alert("Premium Kyeboard 591 is deleted. Visit the Products page to confirm, then press Reset Sample Data.");
                } else {
                    alert("Deletion failed.");
                }
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    }; 
    
    const handleReset = async () => {
        if (window.confirm("Are you sure you want to reset the sample data?")) {
            console.log("Resetting database...");
            try {
                const response = await fetch('/resetdb, { method: 'POST' });
                const message = await response.text();
                if (response.ok) {
                    alert(message);
                } else {
                    alert("Reset failed: " + message);
                }
            } catch (error) {
                console.error("Error resetting database:", error);
                alert("An error occurred while resetting the database.");
            }
        }
    };

    return (
        <div>
            <h1>Coalition Warehouse Manager</h1>
            <p>Internal management system for tracking products, vendors, warehouses, customers, and orders.</p>
            <ul>
                <li><Link to="/products">Manage Products</Link> - Browse, add, edit, and remove products in the catalog.</li>
                <li><Link to="/vendors">Manage Vendors</Link> - View vendors and manage the products they supply.</li>
                <li><Link to="/warehouses">Manage Warehouses</Link> - Track warehouse locations and their inventory on hand.</li>
                <li><Link to="/customers">Manage Customers</Link> - Add and update customer records.</li>
                <li><Link to="/purchase-orders">Purchase Orders</Link> - Create and review orders placed with vendors.</li>
                <li><Link to="/sale-orders">Sales Orders</Link> - Create and review orders fulfilled to customers.</li>
                <li><button className='caution' onclick={handleDelete}>Delete Premium Keyboard 591</button> - Demo Reset Button</li>
            </ul>
            <button className='danger' onClick={handleReset}>Reset Sample Data</button>
        </div>
    );
};

export default HomePage;
