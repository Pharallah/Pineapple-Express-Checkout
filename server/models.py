from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from validate_email_address import validate_email
from sqlalchemy.ext.hybrid import hybrid_property
from datetime import datetime, timedelta
import re
from operations import capitalize_sentences

from config import db, bcrypt

# Models go here!

class Customer(db.Model, SerializerMixin):
    __tablename__ = "customers"
    serialize_rules = ('-orders.customer', '-_password_hash')

    id = db.Column(db.Integer, primary_key=True)
    username= db.Column(db.String, nullable =False, unique=True)
    email = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)
    first_name = db.Column(db.String, nullable=True)
    last_name = db.Column(db.String, nullable=True)
    phone_number = db.Column(db.String, nullable=True, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)

    orders = db.relationship('Order', back_populates='customer', cascade='all, delete-orphan')

    def _is_valid_password(self, password):
        if len(password) < 8:
            return False
        if not re.search(r'[A-Z]', password):
            return False
        if not re.search(r'[a-z]', password):
            return False
        if not re.search(r'[0-9]', password):
            return False
        if not re.search(r'[@$!%*?&#]', password):
            return False
        return True

    @hybrid_property
    def password_hash(self):
        raise Exception('Password hashes may not be viewed.')
    
    @password_hash.setter
    def password_hash(self, password):
        if not self._is_valid_password(password):
            raise ValueError("Password does not meet the security requirements.")
        
        self._password_hash = bcrypt.generate_password_hash(password.encode('utf-8')).decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))
    
    @validates('username')
    def validates_username(self, key, username):
        if not username:
            raise ValueError('Must provide a username')
        if not isinstance(username, str):
            raise ValueError('Username must be a valid string')
        if len(username) < 5:
            raise ValueError('Username must be at least 5 characters long')
        return username
    
    @validates('email')
    def validates_email(self, key, email):
        if not validate_email(email):
            raise ValueError('Must be a valid email address.')
        return email
    
    @validates('phone_number')
    def validate_phone(self, key, phone_number):
        if len(phone_number) != 12 or phone_number[3] != '-' or phone_number[7] != '-':
            raise ValueError('Phone number must be in the format XXX-XXX-XXXX.')
        
        if not (phone_number[:3].isdigit() and phone_number[4:7].isdigit() and phone_number[8:].isdigit()):
            raise ValueError('Phone number must contain digits in the format XXX-XXX-XXXX.')
        
        return phone_number
    
    @validates('first_name', 'last_name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError(f'{key.replace("_", " ").title()} must be provided.')
        if not name.isalpha():
            raise ValueError(f'{key.replace("_", " ").title()} must contain only alphabetic characters.')
        if len(name) < 2:
            raise ValueError(f'{key.replace("_", " ").title()} must be at least 2 characters long.')
        return name
    
    @validates('created_at')
    def validate_created_at(self, key, created_at):
        if not isinstance(created_at, datetime):
            raise ValueError('Created at must be a valid datetime object.')
        if created_at > datetime.now():
            raise ValueError('Created at cannot be set to a future date.')
        return created_at

    def __repr__(self):
        return f'<Customer {self.username}, ID {self.id}>'


class Order(db.Model, SerializerMixin):
    __tablename__ = "orders"
    serialize_rules = ('-customer.orders', '-order_items.order')

    id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(db.Integer, db.ForeignKey('customers.id'))
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now)
    order_type = db.Column(db.String, nullable=False)
    pickup_time = db.Column(db.DateTime, nullable=False)
    order_status = db.Column(db.String, nullable=False, default='In Cart')

    customer = db.relationship('Customer', back_populates='orders')
    order_items = db.relationship('OrderItem', back_populates='order', cascade='all, delete-orphan')

    @hybrid_property
    def number_of_items(self):
        return sum(item.quantity for item in self.order_items)

    @hybrid_property
    def total_price(self):
        return sum(order_item.item.price * order_item.quantity for order_item in self.order_items)
    
    @validates('customer_id')
    def validates_customer_id(self, key, id):
        customer = Customer.query.filter(Customer.id == id).first()
    
        if id is None:
            raise ValueError(f'Must provide a customer ID.')
        
        if not customer:
            raise ValueError(f'No customer by that ID found in database,')
            
        return id
    
    @validates('created_at')
    def validate_created_at(self, key, created_at):
        if not isinstance(created_at, datetime):
            raise ValueError('Created at must be a valid datetime object.')
        if created_at > datetime.now():
            raise ValueError('Created at cannot be set to a future date.')
        return created_at
    
    @validates('order_type')
    def validate_order_type(self, key, order_type):
        valid_order_types = ['Catering', 'Take-Out']

        if order_type is None:
            raise ValueError('Order Type must be specified')
        
        if order_type not in valid_order_types:
            raise ValueError('Must be a valid order type')
        
        return order_type
    
    @validates('pickup_time')
    def validate_pickup_time(self, key, pickup_time):
        if not isinstance(pickup_time, datetime):
            raise ValueError('Pickup time must be a valid datetime object.')

        now = datetime.now()

        if self.order_type == 'Catering':
            if pickup_time < now + timedelta(hours=24):
                raise ValueError('For Catering orders, pickup time must be at least 24 hours in advance.')
        elif self.order_type == 'Take-Out':
            if pickup_time < now + timedelta(minutes=10):
                raise ValueError('For Take-Out orders, pickup time must be made at least 10 minutes in advance.')
            if pickup_time > now + timedelta(hours=2):
                raise ValueError('For Take-Out orders, pickup time cannot be more than 2 hours in the future.')

        return pickup_time
    
    @validates('order_status')
    def validate_order_status(self, key, order_status):
        valid_order_status = ['In Cart', 'Order Placed']

        if order_status is None:
            raise ValueError('Order Status must be specified')
        
        if order_status not in valid_order_status:
            raise ValueError('Must be a valid order status')
        
        return order_status
    
    def __repr__(self):
        return f'<Order Pickup Time: {self.pickup_time}, ID {self.id}, # of Items: {self.number_of_items} | Total Price: {self.total_price}>'


class OrderItem(db.Model, SerializerMixin):
    __tablename__ = "order_items"
    serialize_rules = ('-order.order_items', '-item.order_items')

    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('items.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False, default=1)
    special_instructions = db.Column(db.String, nullable=False, default="")

    order = db.relationship('Order', back_populates='order_items')
    item = db.relationship('Item', back_populates='order_items')

    @validates('item_id', 'order_id')
    def validates_foreign_keys(self, key, id):
        if id is None:
            raise ValueError(f'{key.replace("_", " ").title()} cannot be None.')
        
        if key == 'item_id':
            item_in_db = Item.query.filter(Item.id == id).first()
            if not item_in_db:
                raise ValueError(f'No item by that ID found in database.')
        
        if key == 'order_id':
            order_in_db = Order.query.filter(Order.id == id).first()
            if not order_in_db:
                raise ValueError(f'No order by that ID found in database.')
            
        return id

    @validates('quantity')
    def validates_item_quantities(self, key, quantity):
        
        if quantity is None:
            raise ValueError(f'A numeric value for quantity must be provided.')
        
        if not isinstance(quantity, int):
            raise ValueError(f'{key} must be a valid integer.')

        return quantity
    
    @validates('special_instructions')
    def validate_special_instructions(self, key, value):
        if not isinstance(value, str):
            raise ValueError("Special instructions must be a string.")
        return capitalize_sentences(value)

    def __repr__(self):
        return f'<OrderItem ID {self.id} | Item: {self.item.name} | Quantity: {self.quantity}>'


class Category(db.Model, SerializerMixin):
    __tablename__ = "categories"
    serialize_rules = ('-items.category',)

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    description = db.Column(db.String, nullable=False, default="")

    items = db.relationship('Item', back_populates='category', cascade='all, delete-orphan')

    @validates('name')
    def validates_name(self, key, name):
        if not name:
            raise ValueError('Must have name')
        if not isinstance(name, str):
            raise ValueError('Name must be a valid string')
        if len(name) < 5:
            raise ValueError('Name must be at least 5 characters long')
        return name.title()
    
    @validates('description')
    def validate_description(self, key, description):
        if not isinstance(description, str):
            raise ValueError("Descriptions must be a string.")
        
        return capitalize_sentences(description)
    

    def __repr__(self):
        return f'<ID {self.id} | Category {self.name}>'


class Item(db.Model, SerializerMixin):
    __tablename__ = "items"
    serialize_rules = ('-category.items', '-order_items.item')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    image = db.Column(db.String, nullable=True)
    description = db.Column(db.String, nullable=False, default="")
    price = db.Column(db.Numeric(10, 2), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'))

    category = db.relationship('Category', back_populates='items')
    order_items = db.relationship('OrderItem', back_populates='item')

    def __repr__(self):
        return f'<ID {self.id} | Item Name: {self.name} | Price: {self.price}>'

