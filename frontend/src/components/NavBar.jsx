import React from 'react';
import { NavLink } from 'react-router-dom';

const NavBar = () => {
    return (
        <nav>
            <div>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/products">Products</NavLink>
            <NavLink to="/vendors">Vendors</NavLink>
            <NavLink to="/customers">Customers</NavLink>
            <NavLink to="/warehouses">Warehouses</NavLink>
            <NavLink to="/sales">Sales</NavLink>
            <NavLink to="/purchases">Purchases</NavLink>
            </div>
        </nav>
    );
};

export default NavBar;