import React from 'react';

const Dropdown = ({ label, name, options, valueKey, labelKey, selectedValue }) => {
    return (
        <div className="flex flex-col">
            <label className="font-bold">{label}:</label>
            <select 
                name={name} 
                defaultValue={selectedValue} 
                className="border p-2 rounded"
                required
            >
                <option value="" disabled>Select {label}...</option>
                {options.map((option) => (
                    <option key={option[valueKey]} value={option[valueKey]}>
                        {option[labelKey]} 
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;