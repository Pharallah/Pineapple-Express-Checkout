#!/usr/bin/env python3

# Remote library imports
from flask import request, make_response, abort
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
    def get(self, id):
        customer = Customer.query.filter(Customer.id == id).first()
        if not customer:
            abort(404, "Customer not found")
        return customer.to_dict(rules=('-_password_hash', '-orders')), 200
    
    def patch(self, id):
        customer = Customer.query.filter(Customer.id == id).first()

        if not customer:
            abort(404, "Customer not found")

        json_data = request.get_json()

        # Validate input fields
        errors = []
        if 'username' in json_data:
            try:
                customer.username = json_data['username']
            except ValueError as e:
                errors.append({'field': 'username', 'error': str(e)})
        if 'email' in json_data:
            try:
                customer.email = json_data['email']
            except ValueError as e:
                errors.append({'field': 'email', 'error': str(e)})
        if 'password' in json_data:
            try:
                customer.password_hash = json_data['password']
            except ValueError as e:
                errors.append({'field': 'password', 'error': str(e)})
        if 'first_name' in json_data:
            try:
                customer.first_name = json_data['first_name']
            except ValueError as e:
                errors.append({'field': 'first_name', 'error': str(e)})
        if 'last_name' in json_data:
            try:
                customer.last_name = json_data['last_name']
            except ValueError as e:
                errors.append({'field': 'last_name', 'error': str(e)})
        if 'phone_number' in json_data:
            try:
                customer.phone_number = json_data['phone_number']
            except ValueError as e:
                errors.append({'field': 'phone_number', 'error': str(e)})
        if errors:
            return {'errors': errors}, 400

        try:
            db.session.commit()
        except IntegrityError:
            db.session.rollback()
            return {'errors': 'Email or phone number already exists'}, 400
        except Exception as e:
            return {'errors': 'Failed to update customer', 'message': str(e)}, 500

        customer_dict = customer.to_dict(rules=('-_password_hash', '-orders'))
        return make_response(customer_dict, 202)

    def delete(self):
        customer = Customer.query.filter(Customer.id == id).first()

        if not customer:
            abort(404, "Customer not found")
  
        db.session.delete(customer)
        db.session.commit()
        return {}, 204

class Orders(Resource):
    def get(self):
        orders = [order.to_dict() for order in Order.query.all()]
        if orders:
            response = make_response(
                orders, 200
            )
            return response
        else:
            return {'error': 'Unexpected Server Error'}, 500

    def post(self):
        json = request.get_json()
        try:
            new_order = Order(
                customer_id=json['customerId'],
                order_type=json['orderType'],
                pickup_time=json['pickupTime']
            )

            db.session.add(new_order)
            db.session.commit()

            order_dict = new_order.to_dict()
            return make_response(order_dict, 200)
        
        except ValueError as e:
            return {'errors': str(e)}, 400
        except Exception as e:
            return {'errors': 'Failed to add order to database'}, 500

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
api.add_resource(CustomerById, '/customers/<int:id>')


if __name__ == '__main__':
    app.run(port=5555, debug=True)

