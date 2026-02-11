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
                                <button onClick={(e) => {e.stopPropagation(); onDelete(row.id)}}><MdDelete /></button>
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