from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from datetime import datetime

from config import db

# Models go here!

class Customer(db.Model, SerializerMixin):
    __tablename__ = "customers"

    id = db.Column(db.Integer, primary_key=True)
    # username= db.Column(db.String, nullable =False, unique=True)
    # email = db.Column(db.String, nullable=False, unique=True)
    # _password_hash = db.Column(db.String, nullable=False)
    # first_name = db.Column(db.String, nullable=True)
    # last_name = db.Column(db.String, nullable=True)
    # phone_number = db.Column(db.String, nullable=True, unique=True)
    # created_at = db.Column(db.DateTime, default=datetime.now)

    # orders = db.relationship('Order', back_populates='customer', cascade='all, delete-orphan')


class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    # customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    # created_at = db.Column(db.DateTime, default=datetime.now)
    # order_type = db.Column(db.String, nullable=False)
    # pickup_time = db.Column(db.DateTime, nullable=False)
    # total_price = db.Column(db.Numeric(10, 2), nullable=False, default=0.00)
    # order_status = db.Column(db.String, nullable=False, default='In Cart')

    # customer = db.relationship('Customer', back_populates='orders')
    # order_items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')



class OrderItem(db.Model, SerializerMixin):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    # item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    # order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    # quantity = db.Column(db.Integer, nullable=False, default=1)
    # special_instructions = db.Column(db.String, nullable=False, default="")

    # order = db.relationship('Order', back_populates='order_items')
    # item = db.relationship('Item', back_populates='items')


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"

    id = db.Column(db.Integer, primary_key=True)
    # name = db.Column(db.String, nullable=False, unique=True)
    # description = db.Column(db.String, nullable=False, default="")

    # items = db.relationship('Item', back_populates='category', cascade='all, delete-orphan')


class Item(db.Model, SerializerMixin):
    __tablename__ = "items"

    id = db.Column(db.Integer, primary_key=True)
    # name = db.Column(db.String, nullable=False, unique=True)
    # image = db.Column(db.String, nullable=True)
    # description = db.Column(db.String, nullable=False, default="")
    # price = db.Column(db.Numeric(10, 2), nullable=False)

    # category = db.relationship('Category', back_populates='items')
    # order_items = db.relationship('OrderItem', back_populates='item')

