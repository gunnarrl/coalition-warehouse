import React from 'react';
import Select from 'react-select';

// labelkey: the property name in the options objects to use as the display label
// valuekey: the property name in the options objects to use as the value (usually a FK ID)
const Dropdown = ({ label, name, options, valueKey, labelKey, selectedValue, onChange }) => {
    
    // data must be formated for react-select: { value: ..., label: ... }
    const selectOptions = options.map(opt => ({
        value: opt[valueKey],
        label: opt[labelKey]
    }));

    const handleChange = (selectedOption) => {
        // When user selects an option, we call onChange with the value (ID)
        onChange(selectedOption ? selectedOption.value : null);
    }
    // Find the currently selected option object based on the selectedValue (which is the ID)
    const currentOption = selectOptions.find(opt => opt.value === selectedValue);

    return (
        <div className="flex flex-col">
            <label className="font-bold mb-1">{label}:</label>
            <Select
                options={selectOptions}
                value={currentOption}
                onChange={handleChange}
                placeholder={`Search ${label}...`}
                isClearable
                isSearchable
            />
            <input type="hidden" name={name} value={selectedValue || ''} /> 
            {/* Hidden input to include the selected value in form submissions */}
        </div>
    );
};

export default Dropdown;