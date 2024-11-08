from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime

from config import db, bcrypt

# Models go here!

class Customer(db.Model, SerializerMixin):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    username= db.Column(db.String, nullable =False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String, nullable=True)
    last_name = db.Column(db.String, nullable=True)
    phone_number = db.Column(db.String, nullable=True, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.now)

    orders = db.relationship('Order', back_populates='customer', cascade='all, delete-orphan')

    @hybrid_property
    def password_hash(self):
        return self._password_hash
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))

        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    def __repr__(self):
        return f'Customer {self.username}, ID {self.id}'


class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    order_type = db.Column(db.String, nullable=False)
    pickup_time = db.Column(db.DateTime, nullable=False)
    total_price = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    order_status = db.Column(db.String, nullable=False, default='In Cart')

    customer = db.relationship('Customer', back_populates='orders')
    order_items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Order ID {self.id}'


class OrderItem(db.Model, SerializerMixin):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    special_instructions = db.Column(db.String, nullable=False, default="")

    order = db.relationship('Order', back_populates='order_items')
    item = db.relationship('Item', back_populates='items')

    def __repr__(self):
        return f'OrderItem ID {self.id}'


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    description = db.Column(db.String, nullable=False, default="")

    items = db.relationship('Item', back_populates='category', cascade='all, delete-orphan')

    def __repr__(self):
        return f'Category {self.name}, ID {self.id}'


class Item(db.Model, SerializerMixin):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    image = db.Column(db.String, nullable=True)
    description = db.Column(db.String, nullable=False, default="")
    price = db.Column(db.Numeric(10, 2), nullable=False)

    category = db.relationship('Category', back_populates='items')
    order_items = db.relationship('OrderItem', back_populates='item')

    def __repr__(self):
        return f'Item Name: {self.name}, ID {self.id}'

