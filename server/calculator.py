from random import randint, uniform, choice as rc
from datetime import datetime, timedelta
from models import db, Item, Order

def price_updater(item_id, order_id, quantity):
    item = Item.query.filter(Item.id == item_id).first()
    order = Order.query.filter(Order.id == order_id).first()

    order.total_price += item.price * quantity
    
    db.session.commit()

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