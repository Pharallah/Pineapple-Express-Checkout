#!/usr/bin/env python3

# Standard library imports
from random import randint, uniform, choice as rc

# Remote library imports
from faker import Faker
from datetime import datetime, timedelta

# Local imports
from app import app
from models import db, Customer, Order, OrderItem, Category, Item
from items import menu_items, categories

customers = [
    {
        'username': 'Pharallah',
        'email': 'pharallah@gmail.com',
        'password': 'Asflkjasf123!'
    },
    {
        'username': 'theERhusie',
        'email': 'thaerhusie@gmail.com',
        'password': 'Asjldghads9973!'

    },
    {
        'username': 'PepperoniViceroy',
        'email': 'pepperoniviceroy@gmail.com',
        'password': 'Nbouteb082752!'
    }
]


def price_randomizer():
    random_price = uniform(1.0, 100.0)
    rounded_price = round(random_price, 2)
    return rounded_price

def pickup_time_randomizer():
    # Current time
    now = datetime.now()

    # Generate a random number of minutes and seconds, ensuring at least 10 minutes in the future
    min_minutes = 10
    max_minutes = 59

    random_minutes = randint(min_minutes, max_minutes)  # Between 10 and 59 minutes
    random_seconds = randint(0, 59)  # Up to 59 seconds

    # Create a time delta with the random minutes and seconds
    random_time_delta = timedelta(minutes=random_minutes, seconds=random_seconds)

    # Add the time delta to the current time
    random_datetime = now + random_time_delta

    return random_datetime

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

def create_orders():
    new_orders = []

    customer_id = [customer.id for customer in Customer.query.all()]
    order_type = ['Catering', 'Take-Out']
    valid_order_status = ['In Cart', 'Pending', 'Order Placed']

    for _ in range(10):
        new_order = Order(
            customer_id=rc(customer_id),
            order_type=rc(order_type),
            pickup_time=pickup_time_randomizer(),
            total_price=price_randomizer(),
            order_status=rc(valid_order_status)
        )
        new_orders.append(new_order)

    return new_orders

def create_order_items():
    new_order_items = []
    item_id = [item.id for item in Item.query.all()]
    order_id = [order.id for order in Order.query.all()]

    for _ in range(20):
        new_order_item = OrderItem(
            item_id=rc(item_id),
            order_id=rc(order_id),
            quantity=randint(1, 5),
            special_instructions=""
        )
        # I THINK SPECIAL_INSTRUCTIONS IS NOT WORKING
        new_order_items.append(new_order_item)

    return new_order_items

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
        category = Category.query.filter(Category.name == item['category']).first()
        category_id = category.id

        new_item = Item(
            name=item['item_name'],
            description=item['description'],
            price=item['price'],
            category_id=category_id
        )
        items.append(new_item)

    return items


if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
        # Seed code goes here!
        Customer.query.delete()
        Order.query.delete()
        OrderItem.query.delete()
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

        print("Seeding Categories...")
        categories = create_categories()
        db.session.add_all(categories)
        db.session.commit()

        print("Seeding Items...")
        items = create_items()
        db.session.add_all(items)
        db.session.commit()

        print("Seeding OrderItems...")
        order_items = create_order_items()
        db.session.add_all(order_items)
        db.session.commit()

        print("Seed Successful!!!")
