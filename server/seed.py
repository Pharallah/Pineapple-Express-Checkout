#!/usr/bin/env python3

# Standard library imports
from random import randint, choice as rc

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Customer, Order, OrderItem, Category, Item

customers = [
    {
        'username': 'harry',
        'email': 'harry@gmail.com',
        ''
    }
]

def create_customers():
    pass

def create_orders():
    pass

def create_order_items():
    pass

def create_categories():
    pass

def create_items():
    pass

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        Customer.query.delete()
        Order.query.delete()
        OrderItem.delete()
        Category.query.delete()
        Item.query.delete()

        print("Seeding Customers...")
        customers = create_customers()
        db.session.add_all(customers)
        db.session.commit()

        print("Seeding Orders...")
        orders = create_orders()
        db.session.add_all(orders)
        db.session.commit()

        print("Seeding OrderItems...")
        order_items = create_order_items()
        db.session.add_all(order_items)
        db.session.commit()

        print("Seeding Categories...")
        categories = create_categories()
        db.session.add_all(categories)
        db.session.commit()

        print("Seeding Items...")
        items = create_items()
        db.session.add_all(items)
        db.session.commit()
