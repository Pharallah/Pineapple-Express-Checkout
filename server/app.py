#!/usr/bin/env python3

# Remote library imports
from flask import request, make_response, abort
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
# Add your model imports
from models import Customer, Order, OrderItem, Category, Item
from operations import datetime_formatter

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Customers(Resource):
    def get(self):
        customers = [customer.to_dict(rules=('-_password_hash', '-orders')) for customer in Customer.query.all()]
        
        # UNCOMMENT OUT IF YOU WANT RETURNED CUSTOMER DICT'S CREATED AT TO BE FORMATTED TO HR/MIN

        # customers = []
        # for customer in Customer.query.all():
        #     customer_dict = customer.to_dict(rules=('-_password_hash', '-orders'))
        #     formatted_created_at = customer.created_at.strftime("%Y-%m-%d %H:%M")
        #     customer_dict['created_at'] = formatted_created_at
        #     customers.append(customer_dict)

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
                errors.append({'field': 'Username', 'error': str(e)})
        if 'email' in json_data:
            try:
                customer.email = json_data['email']
            except ValueError as e:
                errors.append({'field': 'Email', 'error': str(e)})
        if 'password' in json_data:
            try:
                customer.password_hash = json_data['password']
            except ValueError as e:
                errors.append({'field': 'Password', 'error': str(e)})
        if 'firstName' in json_data:
            try:
                customer.first_name = json_data['firstName']
            except ValueError as e:
                errors.append({'field': 'First Name', 'error': str(e)})
        if 'lastName' in json_data:
            try:
                customer.last_name = json_data['lastName']
            except ValueError as e:
                errors.append({'field': 'Last Name', 'error': str(e)})
        if 'phoneNumber' in json_data:
            try:
                customer.phone_number = json_data['phoneNumber']
            except ValueError as e:
                errors.append({'field': 'Phone Number', 'error': str(e)})
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

    def delete(self, id):
        customer = Customer.query.filter(Customer.id == id).first()

        if not customer:
            abort(404, "Customer not found")
  
        db.session.delete(customer)
        db.session.commit()
        return {}, 204

class Orders(Resource):
    def get(self):
        orders = [order.to_dict(rules=('-customer', '-order_items')) for order in Order.query.all()]
        if orders:
            return make_response(orders, 200)
        else:
            return {'error': 'Unexpected Server Error'}, 500

    def post(self):
        json = request.get_json()
        try:
            new_order = Order(
                customer_id=json['customerId'],
                order_type=json['orderType'],
                # CURRENTLY ONLY ACCEPTS DATETIME DATA THAT INCLUDES MICROSECONDS
                pickup_time=datetime_formatter(json['pickupTime'])
            )
            db.session.add(new_order)
            db.session.commit()
            order_dict = new_order.to_dict(rules=('-customer', '-order_items'))
            return make_response(order_dict, 200)
        except ValueError as e:
            return {'errors': str(e)}, 400
        except Exception as e:
            return {'errors': 'Failed to add order to database'}, 500

class OrdersById(Resource):
    def get(self, id):
        order = Order.query.filter(Order.id == id).first()
        if not order:
            abort(404, "Order not found")
        return order.to_dict(rules=('-customer', '-order_items')), 200
    
    def patch(self, id):
        order = Order.query.filter(Order.id == id).first()

        if not order:
            abort(404, "Order not found")

        json = request.get_json()

        # Validate input fields
        errors = []
        if 'orderType' in json:
            try:
                order.order_type = json['orderType']
            except ValueError as e:
                errors.append({'field': 'Order Type', 'error': str(e)})
        if 'pickupTime' in json:
            try:
                order.pickup_time = datetime_formatter(json['pickupTime'])
            except ValueError as e:
                errors.append({'field': 'Pickup Time', 'error': str(e)})
        if 'orderStatus' in json:
            try:
                order.order_status = json['orderStatus']
            except ValueError as e:
                errors.append({'field': 'Order Status', 'error': str(e)})
        if errors:
            return {'errors': errors}, 400

        try:
            db.session.commit()
        except Exception as e:
            return {'errors': 'Failed to update order'}, 500

        order_dict = order.to_dict(rules=('-customer', '-order_items'))
        return make_response(order_dict, 202)

    def delete(self, id):
        order = Order.query.filter(Order.id == id).first()
        if not order:
            abort(404, "Customer not found")
        db.session.delete(order)
        db.session.commit()
        return {}, 204

class OrderItems(Resource):
    def get(self):
        order_items = [order_item.to_dict(rules=('-item', '-order')) for order_item in OrderItem.query.all()]
        if order_items:
            return make_response(order_items, 200)
        else:
            return {'error': 'Unexpected Server Error'}, 500

    def post(self):
        json = request.get_json()

        try:
            new_order_item = OrderItem(
                item_id=json['itemId'],
                order_id=json['orderId'],
                special_instructions=json['specialInstructions']
            )

            db.session.add(new_order_item)
            db.session.commit()

            order_item_dict = new_order_item.to_dict(rules=('-item', '-order'))
            return make_response(order_item_dict, 200)
        
        except ValueError as e:
            return {'errors': str(e)}, 400
        except Exception as e:
            return {'errors': 'Failed to add Order Item to database'}, 500

class OrderItemById(Resource):
    def get(self, id):
        order_item = OrderItem.query.filter(OrderItem.id == id).first()
        if not order_item:
            abort(404, "Order Item not found")
        return order_item.to_dict(rules=('-item', '-order')), 200
    
    def patch(self, id):
        order_item = OrderItem.query.filter(OrderItem.id == id).first()

        if not order_item:
            abort(404, "Order Item not found")

        json = request.get_json()

        # Validate input fields
        errors = []
        if 'quantity' in json:
            try:
                order_item.quantity = json['quantity']
            except ValueError as e:
                errors.append({'field': 'Quantity', 'error': str(e)})
        if 'specialInstructions' in json:
            try:
                order_item.special_instructions = json['specialInstructions']
            except ValueError as e:
                errors.append({'field': 'Special Instructions', 'error': str(e)})
        if errors:
            return {'errors': errors}, 400

        try:
            db.session.commit()
        except Exception as e:
            return {'errors': 'Failed to update order item'}, 500

        order_item_dict = order_item.to_dict(rules=('-item', '-order'))
        return make_response(order_item_dict, 202)

    def delete(self, id):
        order_item = OrderItem.query.filter(OrderItem.id == id).first()
        if not order_item:
            abort(404, "Order Item not found")
        db.session.delete(order_item)
        db.session.commit()
        return {}, 204

class Categories(Resource):
    def get(self):
        categories = [category.to_dict(rules=('-items',)) for category in Category.query.all()]
        if categories:
            return make_response(categories, 200)
        else:
            return {'error': 'Unexpected Server Error'}, 500

    def post(self):
        json = request.get_json()
        try:
            new_category = Category(
                name=json['name'],
                description=json['description']
            )
            db.session.add(new_category)
            db.session.commit()
            category_dict = new_category.to_dict(rules=('-items',))
            return make_response(category_dict, 200)
        except IntegrityError:
            db.session.rollback() 
            return {'errors': 'Category with that name already exists'}, 400
        except ValueError as e:
            return {'errors': str(e)}, 400
        except Exception as e:
            return {'errors': 'Failed to add Category to database'}, 500

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

class ItemById(Resource):
    def get(self):
        pass
    def patch(self):
        pass
    def delete(self):
        pass


api.add_resource(Customers, '/customers')
api.add_resource(CustomerById, '/customers/<int:id>')
api.add_resource(Orders, '/orders')
api.add_resource(OrdersById, '/orders/<int:id>')
api.add_resource(OrderItems, '/orderitems')
api.add_resource(OrderItemById, '/orderitems/<int:id>')
api.add_resource(Categories, '/categories')
api.add_resource(CategoriesById, '/categories/<int:id>')
api.add_resource(Items, '/items')
api.add_resource(ItemById, '/items/<int:id>')

if __name__ == '__main__':
    app.run(port=5555, debug=True)

