#!/usr/bin/env python3

# Standard library imports
from random import randint, sample, choices, choice as rc
from datetime import datetime, timedelta

# Remote library imports
from faker import Faker

# Local imports
from app import app
from models import db, Customer, Order, OrderItem, Category, Item
from data import menu_items, categories, customers, fake_sentences


def create_customers():
    seeded_customers = []
    for customer in customers:
        new_customer = Customer(
            username=customer['username'],
            email=customer['email']
        )
        new_customer.password_hash = customer['password']
        seeded_customers.append(new_customer)
    return seeded_customers

def create_categories():
    seeded_categories = []
    for category in categories:
        new_category = Category(
            name=category,
            description=""
        )
        seeded_categories.append(new_category)
    return seeded_categories

def create_items():
    items = []
    for item in menu_items:
        category_in_db = Category.query.filter(Category.name == item["category"]).first()
        new_item = Item(
            name=item['item_name'],
            image=item['image'],
            description=item['description'],
            price=item['price'],
            category_id=category_in_db.id
        )
        items.append(new_item)
    return items

def create_orders():
    order_type_options = ['Catering', 'Take-Out']
    customers = Customer.query.all()

    new_orders = []
    for customer in customers:
        type = rc(order_type_options)
        if type == 'Catering':
            # Ensure pickup time is at least 24 hours in the future
            pickup_time = datetime.now() + timedelta(hours=randint(24, 48))
        elif type == 'Take-Out':
            # Ensure pickup time is between 10 minutes and 2 hours in the future
            pickup_time = datetime.now() + timedelta(minutes=randint(10, 120))
        
        new_order = Order(
            customer_id=customer.id,
            order_type=type,
            pickup_time=pickup_time
        )
        new_orders.append(new_order)

    return new_orders

def create_order_items(): 
    items = [item for item in Item.query.all()]
    orders = [order for order in Order.query.all()]
    
    new_order_items = []
    for order in orders:
        # Randomly select a number of UNIQUE items to be converted into OrderItems
        rand_int = randint(1, 5)
        item_list = sample(items, k=rand_int)

        for item in item_list:
            # order.number_of_items += 1
            # db.session.commit()
            # Creates random sentences for special_instructions
            random_sentences_list = choices(fake_sentences, k=rand_int)
            joined_sentences = ' '.join(random_sentences_list)
            
            new_order_item = OrderItem(
                item_id=item.id,
                order_id=order.id,
                quantity=randint(1, 4),
                special_instructions=joined_sentences
            )
            
            new_order_items.append(new_order_item)
            
    return new_order_items

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        # Drop all tables
        print("Dropping all tables...")
        db.drop_all()

        # Recreate all tables
        print("Recreating all tables...")
        db.create_all()

        print("Starting seed...")
        # Customer.query.delete()
        # Order.query.delete()
        # OrderItem.query.delete()
        # Category.query.delete()
        # Item.query.delete()
        # print('All tables deleted...')

        print("Seeding Customers...")
        customers = create_customers()
        db.session.add_all(customers)
        db.session.commit()

        print("Seeding Categories...")
        categories = create_categories()
        db.session.add_all(categories)
        db.session.commit()

        print("Seeding Items...")
        items = create_items()
        db.session.add_all(items)
        db.session.commit()

        print("Seeding Orders...")
        orders = create_orders()
        db.session.add_all(orders)
        db.session.commit()

        print("Seeding OrderItems...")
        order_items = create_order_items()
        db.session.add_all(order_items)
        db.session.commit()

        print("Seed Successful!!!")





