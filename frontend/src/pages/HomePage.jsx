import React from 'react';

const HomePage = () => {
    const handleReset = () => {
        if (window.confirm("Are you sure you want to reset the sample data?")) {
            console.log("Resetting database...");
        }
    };

    return (
        <div>
            <h1>Coalition Warehouse Manager Home Page</h1>
            <button onClick={handleReset}></button>
        </div>
    );
}

export default HomePage;