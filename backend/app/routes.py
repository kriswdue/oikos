from flask import request, jsonify
from app import app, db
from app.models import Transaction
from datetime import datetime

@app.route('/add_transaction', methods=['POST'])
def add_transaction():
    data = request.get_json()
    new_transaction = Transaction(date=datetime.strptime(data['date'], '%Y-%m-%d'),
                                  amount=data['amount'],
                                  description=data['description'],
                                  category=data['category'])
    db.session.add(new_transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction added!'})

@app.route('/delete_transaction/<id>', methods=['DELETE'])
def delete_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({'message': 'Transaction not found!'})
    db.session.delete(transaction)
    db.session.commit()
    return jsonify({'message': 'Transaction removed!'})

@app.route('/get_transaction/<id>', methods=['GET'])
def get_transaction(id):
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({'message': 'Transaction not found!'})
    return jsonify({
        'date': transaction.date.strftime('%Y-%m-%d'),
        'amount': transaction.amount,
        'description': transaction.description,
        'category': transaction.category
    })

@app.route('/update_transaction/<id>', methods=['PUT'])
def update_transaction(id):
    data = request.get_json()
    transaction = Transaction.query.get(id)
    if not transaction:
        return jsonify({'message': 'Transaction not found!'})
    transaction.date = datetime.strptime(data['date'], '%Y-%m-%d')
    transaction.amount = data['amount']
    transaction.description = data['description']
    transaction.category = data['category']
    db.session.commit()
    return jsonify({'message': 'Transaction updated!'})

@app.route('/transactions', methods=['GET'])
@app.route('/transactions/<int:max_num>', methods=['GET'])
def get_transactions(max_num=None):
    if max_num is None:
        transactions = Transaction.query.all()  # fetches all transactions
    else:
        transactions = Transaction.query.limit(max_num)  # fetches top 'max_num' transactions

    transaction_list = []
    for transaction in transactions:
        transaction_data = {}
        transaction_data['id'] = transaction.id
        transaction_data['date'] = transaction.date.strftime('%Y-%m-%d')
        transaction_data['amount'] = transaction.amount
        transaction_data['description'] = transaction.description
        transaction_data['category'] = transaction.category
        transaction_list.append(transaction_data)

    return jsonify({'transactions': transaction_list})