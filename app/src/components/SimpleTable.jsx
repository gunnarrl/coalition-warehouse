import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';

function SimpleTable({ columns, data, onEdit, onDelete }) {
    return (
        <table className="table">
            <thead>
                <tr>
                    {columns.map((col, i) => (
                        <th key={i}>{col.label}</th>
                    ))}
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {columns.map((col) => (
                            <td key={col}>{row[col.key]}</td>
                        ))}
                        <td><button onClick={() => onEdit(row)}><MdEdit /></button></td>
                        <td><button className="danger" onClick={() => onDelete(row)}><MdDelete /></button></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default SimpleTable;