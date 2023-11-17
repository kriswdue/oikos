from app import db

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=True)

    def __repr__(self):
        return f"Transaction('{self.id}', '{self.date}', '{self.amount}', '{self.description}', '{self.category}')"
