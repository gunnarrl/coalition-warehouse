import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Table = ({ columns, data, onEdit, onDelete}) => {
    return (
        <table>
            <thead>
                <tr>
                    {columns.map((col, i) => (
                        <th key={i}>{col}</th>
                    ))}
                    <th>Edit</th>
                    <th>Delete</th>
                </tr>
            </thead>
            <tbody>
                {data.map((row, index) => (
                    <tr key={index}>
                        {columns.map((col) => (
                            <td key={col}>{row[col]}</td>
                        ))}
                        <td><button onClick={() => onEdit(row)}><FaEdit/></button></td>
                        <td><button onClick={() => onDelete(row)}><FaTrash/></button></td>   
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default Table;