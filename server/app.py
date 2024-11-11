#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request
from flask_restful import Resource

# Local imports
from config import app, db, api
# Add your model imports
from models import Customer, Order, OrderItem, Category, Item

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Customers(Resource):
    def get(self):
        customers = [customer.to_dict() for customer in Customer.query.all()]

    def post(self):
        pass

class CustomerById(Resource):
    def get(self):
        pass
    def patch(self):
        pass
    def delete(self):
        pass

class Orders(Resource):
    def get(self):
        pass
    def post(self):
        pass

class OrdersById(Resource):
    def get(self):
        pass
    def patch(self):
        pass
    def delete(self):
        pass

class OrderItems(Resource):
    def get(self):
        pass
    def post(self):
        pass

class OrderItemsById(Resource):
    def get(self):
        pass
    def patch(self):
        pass
    def delete(self):
        pass

class Categories(Resource):
    def get(self):
        pass
    def post(self):
        pass

class CategoriesById(Resource):
    def get(self):
        pass
    def patch(self):
        pass
    def delete(self):
        pass

class Items(Resource):
    def get(self):
        pass
    def post(self):
        pass

class ItemsById(Resource):
    def get(self):
        pass
    def patch(self):
        pass
    def delete(self):
        pass



if __name__ == '__main__':
    app.run(port=5555, debug=True)

