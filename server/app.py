#!/usr/bin/env python3

# Remote library imports
from flask import request, make_response, abort
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError

# Local imports
from config import app, db, api
# Add your model imports
from models import Customer, Order, OrderItem, Category, Item
from operations import datetime_formatter, custom_titled, capitalize_sentences

# Views go here!

@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Customers(Resource):
    def get(self):
        customers = [customer.to_dict(rules=('-_password_hash', '-orders')) 
        
        for customer in Customer.query.all()]
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
                errors.append({'error': str(e)})
        if 'email' in json_data:
            try:
                customer.email = json_data['email']
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'password' in json_data:
            try:
                customer.password_hash = json_data['password']
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'firstName' in json_data:
            try:
                customer.first_name = custom_titled(json_data['firstName'])
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'lastName' in json_data:
            try:
                customer.last_name = custom_titled(json_data['lastName'])
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'phoneNumber' in json_data:
            try:
                customer.phone_number = json_data['phoneNumber']
            except ValueError as e:
                errors.append({'error': str(e)})
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
                errors.append({'error': str(e)})
        if 'pickupTime' in json:
            try:
                order.pickup_time = datetime_formatter(json['pickupTime'])
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'orderStatus' in json:
            try:
                order.order_status = json['orderStatus']
            except ValueError as e:
                errors.append({'error': str(e)})
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
            abort(404, "Order not found")
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
                special_instructions=capitalize_sentences(json['specialInstructions'])
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
                errors.append({'error': str(e)})
        if 'specialInstructions' in json:
            try:
                order_item.special_instructions = capitalize_sentences(json['specialInstructions'])
            except ValueError as e:
                errors.append({'error': str(e)})
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
                name=custom_titled(json['name']),
                description=capitalize_sentences(json['description'])
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
    def get(self, id):
        category = Category.query.filter(Category.id == id).first()
        if not category:
            abort(404, "Category not found")
        return category.to_dict(rules=('-items',)), 200
    
    def patch(self, id):
        category = Category.query.filter(Category.id == id).first()

        if not category:
            abort(404, "Category not found")

        json = request.get_json()

        # Validate input fields
        errors = []
        if 'name' in json:
            try:
                category.name = custom_titled(json['name'])
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'description' in json:
            try:
                category.description = capitalize_sentences(json['description'])
            except ValueError as e:
                errors.append({'error': str(e)})
        if errors:
            return {'errors': errors}, 400

        try:
            db.session.commit()
        except Exception as e:
            return {'errors': 'Failed to update order item'}, 500

        category_dict = category.to_dict(rules=('-items',))
        return make_response(category_dict, 202)

    def delete(self, id):        
        category = Category.query.filter(Category.id == id).first()
        if not category:
            abort(404, "Category not found")
        db.session.delete(category)
        db.session.commit()
        return {}, 204

class Items(Resource):
    def get(self):
        items = [item.to_dict(rules=('-category', '-order_items')) for item in Item.query.all()]
        if items:
            return make_response(items, 200)
        else:
            return {'error': 'Unexpected Server Error'}, 500

    def post(self):
        json = request.get_json()
        try:
            new_item = Item(
               name=custom_titled(json['name']),
               description=capitalize_sentences(json['description']),
               price=json['price'],
               category_id=json['categoryId']
            )
            db.session.add(new_item)
            db.session.commit()
            item_dict = new_item.to_dict(rules=('-category', '-order_items'))
            return make_response(item_dict, 200)
        except IntegrityError:
            db.session.rollback() 
            return {'errors': 'Item with that name already exists'}, 400
        except ValueError as e:
            return {'errors': str(e)}, 400
        except Exception as e:
            return {'errors': 'Failed to add Item to database'}, 500

class ItemById(Resource):
    def get(self, id):
        item = Item.query.filter(Item.id == id).first()
        if not item:
            abort(404, "Item not found")
        return item.to_dict(rules=('-category', '-order_items')), 200
    
    def patch(self, id):
        item = Item.query.filter(Item.id == id).first()

        if not item:
            abort(404, "Item not found")

        json = request.get_json()

        # Validate input fields
        errors = []
        if 'name' in json:
            try:
                item.name = custom_titled(json['name'])
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'description' in json:
            try:
                item.description = capitalize_sentences(json['description'])
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'image' in json:
            try:
                item.image = json['image']
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'price' in json:
            try:
                item.price = json['price']
            except ValueError as e:
                errors.append({'error': str(e)})
        if 'categoryId' in json:
            try:
                item.category_id = custom_titled(json['categoryId'])
            except ValueError as e:
                errors.append({'error': str(e)})
        if errors:
            return {'errors': errors}, 400

        try:
            db.session.commit()
        except Exception as e:
            return {'errors': 'Failed to update order item'}, 500

        item_dict = item.to_dict(rules=('-category', '-order_items'))
        return make_response(item_dict, 202)

    def delete(self, id):        
        item = Item.query.filter(Item.id == id).first()
        if not item:
            abort(404, "Item not found")
        db.session.delete(item)
        db.session.commit()
        return {}, 204


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

