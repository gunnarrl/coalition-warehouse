// Gemini 3 Pro used to help generate based on the SimpleTable.jsx
// Prompt: [Attached the SimpleTable.jsx component]
// "I have a simple React component called SimpleTable that displays data in a table format with edit and delete buttons. 
// I want to create a new component called DetailTable that extends the functionality of SimpleTable by allowing each row to be expandable, 
// showing additional details when clicked. For example, if the table is showing a list of sales, clicking on a row could expand it to show the items in that sale.
// Please write a basic DetailTable component in React, using the structure of SimpleTable as a base.
// Explain any design choices and assumptions you make while implementing this component. For instance, how you handle the state of which row is expanded, and how you render the additional details."
//
// It then wrote a basic component that I edited it to work with rest of the code and wrote all the renderDetails props for the pages.
import React, { useState } from 'react';
import { MdEdit, MdDelete, MdKeyboardArrowDown, MdKeyboardArrowRight } from 'react-icons/md';

function DetailTable({ columns, data, onEdit, onDelete, renderDetails }) {

    const [openRowId, setOpenRowId] = useState(null);

    const toggleRow = (id) => {
        setOpenRowId(openRowId === id ? null : id); // open a new row or close if it's already open
    };

    return (
        <table className="table">
            <thead>
                <tr>
                    <th></th> {/* Empty column for the arrow to expand the rows */}
                    {columns.map((col, i) => (
                        <th key={i}>{col.label}</th>
                    ))}
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, i) => (
                    <React.Fragment key={i}>
                        {/* MAIN ROW */}
                        <tr onClick={() => toggleRow(i)}>
                            <td>
                                {openRowId === i ? <MdKeyboardArrowDown /> : <MdKeyboardArrowRight />}
                            </td>
                            
                            {columns.map((col, j) => (
                                <td key={j}>{row[col.key]}</td>
                            ))}
                            
                            <td>
                                <button onClick={(e) => {e.stopPropagation(); onEdit(row)}}><MdEdit /></button>
                            </td>
                            <td>
                                <button className="danger" onClick={(e) => {e.stopPropagation(); onDelete(row.id)}}><MdDelete /></button>
                            </td>
                        </tr>
                        {/* EXPANDED ROW */}
                        {openRowId === i && (
                            <tr>
                                <td colSpan={columns.length + 3}>
                                    {renderDetails(row)}
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
}

export default DetailTable;