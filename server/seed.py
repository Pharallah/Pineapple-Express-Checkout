#!/usr/bin/env python3

# Standard library imports
from random import randint, uniform, sample, choices, choice as rc

# Remote library imports
from faker import Faker
from datetime import datetime, timedelta

# Local imports
from app import app
from models import db, Customer, Order, OrderItem, Category, Item
from data import menu_items, categories, customers, fake_sentences
from calculator import pickup_time_randomizer, price_updater

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

def create_orders():
    order_type = ['Catering', 'Take-Out']
    valid_order_status = ['In Cart', 'Pending', 'Order Placed']
    customers = [customer for customer in Customer.query.all()]

    new_orders = []
    for customer in customers:
        # Random number of Orders generated for each Customer
        rand_int = randint(1, 5)
        for _ in range(rand_int):
            new_order = Order(
                customer_id=customer.id,
                order_type=rc(order_type),
                pickup_time=pickup_time_randomizer(),
                order_status=rc(valid_order_status)
            )
            new_orders.append(new_order)

    return new_orders

def create_order_items(): 
    items = [item for item in Item.query.all()]
    orders = [order for order in Order.query.all()]
    
    new_order_items = []
    for order in orders:
        # Randomly select a number of UNIQUE items to be converted into OrderItems
        rand_int = randint(2, 7)
        item_list = sample(items, k=rand_int)

        for item in item_list:
            order.number_of_items += 1
            db.session.commit()
            # Creates random sentences for special_instructions
            random_sentences_list = choices(fake_sentences, k=rand_int)
            joined_sentences = ' '.join(random_sentences_list)
            
            new_order_item = OrderItem(
                item_id=item.id,
                order_id=order.id,
                quantity=randint(1, 4),
                special_instructions=joined_sentences
            )
            
            price_updater(item.id, order.id, new_order_item.quantity)

            new_order_items.append(new_order_item)
            
    return new_order_items

if __name__ == '__main__':
    fake = Faker()
    with app.app_context():
        print("Starting seed...")
     
        Customer.query.delete()
        Order.query.delete()
        OrderItem.query.delete()
        Category.query.delete()
        Item.query.delete()

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



# ORDER OF CREATION
# 1. CUSTOMER 
# 2. CATEGORY
# 2. ITEM
# 3. ORDER -> ORDER ITEM
# 4. 

# CATEGORY => ITEM => 


