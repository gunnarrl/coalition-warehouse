// Citation for use of AI Tools: VS Code's Gemini Code Assist to help fix a bug in the Dropdown.jsx component.
// Date: 02/11/2026
// Prompt: Gave it the component and explained the issue of the placeholder values not updating, 
// helped me realize I needed a state variable and should use a hidden form.
// AI Source URL: https://marketplace.visualstudio.com/items?itemName=Google.geminicodeassist

import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // react-select is a good dropdown library that I found

// labelkey: the property name in the options objects to use as the display label
// valuekey: the property name in the options objects to use as the value (usually a FK ID)
const Dropdown = ({ label, name, options, valueKey, labelKey, selectedValue, onChange }) => {
    
    const [currentValue, setCurrentValue] = useState(selectedValue);

    useEffect(() => {
        setCurrentValue(selectedValue);
    }, [selectedValue]);
    
    // data must be formated for react-select: { value: ..., label: ... }
    const selectOptions = options.map(opt => ({
        value: opt[valueKey],
        label: opt[labelKey]
    }));

    // update state and call onChange when user selects an option
    const handleChange = (option) => {
        const newVal = option ? option.value : null;
        setCurrentValue(newVal);
        if (onChange) {
            onChange(newVal);
        };
    }

    const currentOption = selectOptions.find(opt => opt.value == currentValue);

    return (
        <div>
            <label>{label}:</label>
            <Select
                options={selectOptions}
                value={currentOption}
                onChange={handleChange}
                placeholder={`Search ${label}...`}
                isClearable
                isSearchable
            />
            <input type="hidden" name={name} value={currentValue || ''} />
        </div>
    );
};

export default Dropdown;