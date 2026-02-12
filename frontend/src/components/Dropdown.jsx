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

    const handleChange = (option) => {
        const newVal = option ? option.value : null;
        setCurrentValue(newVal);
        if (onChange) {
            onChange(newVal);
        };
    }

    // Find the currently selected option object based on the selectedValue (which is the ID)
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