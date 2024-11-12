#!/usr/bin/env python3

# Remote library imports
from flask import request, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

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
        customers = [customer.to_dict(rules=('-_password_hash', '-orders')) for customer in Customer.query.all()]

        if customers:
            response = make_response(
                customers, 200
            )
            return response
        else:
            return {'error': 'Unexpected Server Error'}, 500

    def post(self):
        json = request.get_json()
    
        try:
            new_customer = Customer(
                username=json['username'],
                email=json['email'],
            )
            new_customer.password_hash = json['password']

            db.session.add(new_customer)
            db.session.commit()

            customer_dict = new_customer.to_dict(rules=('-_password_hash', '-orders'))
            return make_response(customer_dict, 200)
        
        except IntegrityError:
            db.session.rollback() 
            return {'errors': 'Username or email already exists'}, 400
        except ValueError as e:
            return {'errors': str(e)}, 400
        except Exception as e:
            return {'errors': 'Failed to add item to database'}, 500


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


api.add_resource(Customers, '/customers')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

