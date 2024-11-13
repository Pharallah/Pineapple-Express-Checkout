from random import randint, uniform, choice as rc
from datetime import datetime, timedelta
import re

def price_updater(item_id, order_id, quantity):
    from config import db
    from models import Item, Order

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

def capitalize_sentences(paragraph):
        # Regular expression to find sentence endings
        sentence_endings = re.compile(r'(?<=[.!?])\s+')

        # Split the paragraph into sentences
        sentences = sentence_endings.split(paragraph)

        # Capitalize the first letter of each sentence
        capitalized_sentences = [sentence[0].upper() + sentence[1:] if sentence else '' for sentence in sentences]

        # Join the sentences back into a single string
        return ' '.join(capitalized_sentences)

def is_valid_image_url(url):
    # Check for valid image file extensions
    valid_image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp')
    if not url.lower().endswith(valid_image_extensions):
        return False

    return True

def datetime_formatter(date):
    if isinstance(date, str):
        date_format = "%Y-%m-%d %H:%M:%S.%f"
        date_object = datetime.strptime(date, date_format)
        # Append to the end of date_object if need to omit milliseconds: .replace(second=0, microsecond=0)
        return date_object
    
    if isinstance(date, datetime):
        return date.replace(second=0, microsecond=0)
    
def custom_titled(text):
    # Define punctuation characters
    punctuation = ".,!?;"
    titled_words = []
    word = ''

    for char in text:
        if char.isalnum() or (char == "'" and word):
            # Build the current word
            word += char
        else:
            # If the current character is punctuation or a space and a word is built, process the word
            if word:
                if "'" in word and word.endswith("'s"):
                    # Capitalize the word but keep 's' lowercase
                    titled_word = word[0].upper() + word[1:-2].lower() + "'s"
                else:
                    # Capitalize the entire word
                    titled_word = word.capitalize()

                titled_words.append(titled_word)
                word = ''

            # Add punctuation or space as a separate element
            if char in punctuation or char.isspace():
                titled_words.append(char)

    # Process any remaining word after the loop ends
    if word:
        if "'" in word and word.endswith("'s"):
            titled_word = word[0].upper() + word[1:-2].lower() + "'s"
        else:
            titled_word = word.capitalize()
        titled_words.append(titled_word)

    return ''.join(titled_words)

