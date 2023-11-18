import React, { useState, useEffect } from 'react';
import './App.css'; // Or the appropriate path to your CSS file


function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);


    function fetchTransactions() {
        fetch('http://localhost:5000/transactions') // Adjust the URL if needed
            .then(response => response.json())
            .then(data => setTransactions(data.transactions))
            .catch(error => console.error('Error fetching data:', error));
    }

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const transactionData = {
            date: formData.get('date'),
            amount: formData.get('amount'),
            description: formData.get('description'),
            category: formData.get('category')
        };

        fetch('http://localhost:5000/add_transaction', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transactionData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                event.target.reset(); // Clear form
                // Optionally, set a flag to show a success message on the form
                fetchTransactions();
            })
            .catch(error => console.error('Error:', error));

    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            fetch(`http://localhost:5000/delete_transaction/${id}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    fetchTransactions(); // Refresh the transactions list
                })
                .catch(error => console.error('Error:', error));
        }
    };

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction);
    };

    const handleUpdate = (event, id) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const updatedTransaction = {
            date: formData.get('date'),
            amount: formData.get('amount'),
            description: formData.get('description'),
            category: formData.get('category')
        };

        // Call the backend to update the transaction
        fetch(`http://localhost:5000/update_transaction/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTransaction)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setEditingTransaction(null);
                fetchTransactions(); // Refresh the transactions list
            })
            .catch(error => console.error('Error:', error));
    };


    return (
        <div className="transactions-container">
            <h2>Transactions List</h2>
            <form onSubmit={handleSubmit} className="transaction-form">
                <input type="date" name="date" required />
                <input type="number" name="amount" required />
                <input type="text" name="description" required />
                <input type="text" name="category" required />
                <button type="submit" className="button-add">Add Transaction</button>
            </form>

            <ul className="transactions-list">
                {transactions.map(transaction => (
                    <li key={transaction.id} className="transaction-item">
                        {editingTransaction && editingTransaction.id === transaction.id
                            ? (
                                <form onSubmit={(event) => handleUpdate(event, transaction.id)} className="transaction-edit-form">
                                    <input defaultValue={editingTransaction.date} name="date" type="date" />
                                    <input defaultValue={editingTransaction.amount} name="amount" type="number" />
                                    <input defaultValue={editingTransaction.description} name="description" type="text" />
                                    <input defaultValue={editingTransaction.category} name="category" type="text" />
                                    <button type="submit" className="button-edit">Update</button>
                                    <button onClick={() => setEditingTransaction(null)} className="button-cancel">Cancel</button>
                                </form>
                            )
                            : (
                                <>
                                    <span>{transaction.date} - {transaction.description} - ${transaction.amount}</span>
                                    <span>
                                        <button onClick={() => handleEdit(transaction)} className="button-edit">Edit</button>
                                        <button onClick={() => handleDelete(transaction.id)} className="button-delete">Delete</button>
                                    </span>
                                </>
                            )
                        }
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Transactions;
