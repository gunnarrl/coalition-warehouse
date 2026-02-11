import React from 'react';

const HomePage = () => {
    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the sample data?")) {
            console.log("Resetting database...");
        }
    };

    return (
        <div>
            <h1>Coalition Warehouse Manager</h1>
            <button className='danger' onClick={handleReset}>Reset Sample Data</button>
        </div>
    );
}

export default HomePage;