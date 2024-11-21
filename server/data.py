from faker import Faker

fake = Faker()

fake_sentences = fake.sentences()

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

categories = [
    "Parilya Rice Bowl Classics",
    "Lumpia (Filipino Egg Rolls)",
    "Noodles & Rice",
    "Skewers & Wings",
    "Vegetarian/Vegan Delights",
    "Parilya Bakery",
    "Drinks"
]

menu_items = [
  {
    "item_name": "Chicken Tocino",
    "description": "Flat-top grilled pineapple-marinated chicken caramelized with Tocino pineapple glaze, topped with a fried egg. Served with homemade pickled veggies and a choice of garlic fried rice or steamed white rice.",
    "price": 21.0,
    "category": "Parilya Rice Bowl Classics",
    "image": "http://127.0.0.1:5555/static/images/chicken_tocino.jpg"
  },
  {
    "item_name": "Chicken BBQ",
    "description": "Fire-grilled Filipino-style BBQ chicken glazed with sweet & tangy Parilya BBQ Sauce. Served on garlic fried rice or steamed white rice, garnished with homemade pickled veggies.",
    "price": 21.0,
    "category": "Parilya Rice Bowl Classics",
    "image": "http://127.0.0.1:5555/static/images/chicken_bbq.jpg"
  },
  {
    "item_name": "Pork Sisig",
    "description": "Chargrilled and chopped pork belly and pork shoulder, mixed with diced onions and sweet & spicy peppers, topped with a fried egg. Served with garlic fried rice or steamed white rice.",
    "price": 23.0,
    "category": "Parilya Rice Bowl Classics",
    "image": "http://127.0.0.1:5555/static/images/pork_sisig.jpg"
  },
  {
    "item_name": "Pork Inihaw",
    "description": "Flame-seared marinated pork belly and pork shoulder served with garlic fried rice or steamed white rice, garnished with pickled veggies and accompanied by spiced cane vinegar.",
    "price": 26.0,
    "category": "Parilya Rice Bowl Classics",
    "image": "http://127.0.0.1:5555/static/images/pork_inihaw.jpg"
  },
  {
    "item_name": "Beef Tapsilog",
    "description": "Marinated angus beef steak, seared and served with garlic fried rice or steamed white rice, topped with a fried egg and homemade pickled veggies. Includes a side of spiced cane vinegar.",
    "price": 26.0,
    "category": "Parilya Rice Bowl Classics",
    "image": "http://127.0.0.1:5555/static/images/beef_tapsilog.jpg"
  },
  {
    "item_name": "Sriracha Lime Pork Belly",
    "description": "Grilled pork belly with a zesty Sriracha Lime glaze, served over garlic fried rice or steamed white rice with house-made pickled veggies.",
    "price": 24.0,
    "category": "Parilya Rice Bowl Classics",
    "image": "http://127.0.0.1:5555/static/images/sriracha_lime_pork_belly.jpg"
  },
  {
    "item_name": "Pork & Beef Lumpia",
    "description": "Crispy Filipino-style egg rolls filled with pork and beef meat mixture, served with sweet chili sauce.",
    "price": 10.5,
    "category": "Lumpia (Filipino Egg Rolls)",
    "image": "http://127.0.0.1:5555/static/images/pork_&_beef_lumpia.jpg"
  },
  {
    "item_name": "Vegetarian Lumpia",
    "description": "Hand-rolled Filipino-style egg rolls filled with cabbage, carrots, celery, green beans, and rice noodles, served with sweet chili sauce.",
    "price": 12.0,
    "category": "Lumpia (Filipino Egg Rolls)",
    "image": "http://127.0.0.1:5555/static/images/vegetarian_lumpia.jpg"
  },
  {
    "item_name": "50/50 Lumpia",
    "description": "A mix of pork & beef and vegetarian lumpia served with sweet chili sauce.",
    "price": 11.0,
    "category": "Lumpia (Filipino Egg Rolls)",
    "image": "http://127.0.0.1:5555/static/images/5050_lumpia.jpg"
  },
  {
    "item_name": "Pork Pancit",
    "description": "Stir-fried noodles with tender pork and vegetables, garnished with scallions and served with a lemon wedge.",
    "price": 15.0,
    "category": "Noodles & Rice",
    "image": "http://127.0.0.1:5555/static/images/pork_pancit.jpg"
  },
  {
    "item_name": "Vegetarian Pancit",
    "description": "Stir-fried noodles with crisp vegetables, garnished with scallions and served with a lemon wedge.",
    "price": 12.0,
    "category": "Noodles & Rice",
    "image": "http://127.0.0.1:5555/static/images/vegetarian_pancit.jpg"
  },
  {
    "item_name": "Garlic Fried Rice",
    "description": "Saut\u00e9ed with garlic and soy sauce for a rich, savory flavor.",
    "price": 5.0,
    "category": "Noodles & Rice",
    "image": "http://127.0.0.1:5555/static/images/garlic_fried_rice.jpg"
  },
  {
    "item_name": "Steamed White Rice",
    "description": "Fluffy, perfectly steamed, and gluten-free.",
    "price": 5.0,
    "category": "Noodles & Rice",
    "image": "http://127.0.0.1:5555/static/images/steamed_white_rice.jpg"
  },
  {
    "item_name": "BBQ Skewer",
    "description": "An 8oz Filipino-style BBQ skewer (choice of chicken or pork) glazed with Parilya BBQ sauce.",
    "price": 11.0,
    "category": "Skewers & Wings",
    "image": "http://127.0.0.1:5555/static/images/bbq_skewer.jpg"
  },
  {
    "item_name": "Sriracha Lime Wings",
    "description": "Chicken wings tossed in a mildly spicy Sriracha Lime sauce.",
    "price": 15.5,
    "category": "Skewers & Wings",
    "image": "http://127.0.0.1:5555/static/images/sriracha_lime_wings.jpg"
  },
  {
    "item_name": "Crispy Tofu",
    "description": "Vegan, gluten-free crispy tofu served with sweet chili tofu sauce.",
    "price": 10.0,
    "category": "Vegetarian/Vegan Delights",
    "image": "http://127.0.0.1:5555/static/images/crispy_tofu.jpg"
  },
  {
    "item_name": "Ube Cheesecake Cookie",
    "description": "A chewy vanilla-cinnamon sugar cookie with a soft ube cheesecake center.",
    "price": 6.0,
    "category": "Parilya Bakery",
    "image": "http://127.0.0.1:5555/static/images/ube_cheesecake_cookie.jpg"
  },
  {
    "item_name": "Brown-Butter Miso Chocolate Chip Cookie",
    "description": "A cookie with brown butter, miso dough, semi-sweet chocolate chips, topped with house-made English toffee.",
    "price": 5.0,
    "category": "Parilya Bakery",
    "image": "http://127.0.0.1:5555/static/images/brown-butter_miso_chocolate_chip_cookie.jpg"
  },
  {
    "item_name": "Calamansi Bar",
    "description": "A twist on a lemon bar using Calamansi lime with a vanilla shortbread crust and tangy calamansi curd.",
    "price": 3.25,
    "category": "Parilya Bakery",
    "image": "http://127.0.0.1:5555/static/images/calamansi_bar.jpg"
  },
  {
    "item_name": "Milo Ganache Brownie",
    "description": "A fudgy mini bundt brownie topped with malt-milk chocolate ganache.",
    "price": 7.5,
    "category": "Parilya Bakery",
    "image": "http://127.0.0.1:5555/static/images/milo_ganache_brownie.jpg"
  },
  {
    "item_name": "FOCO Coconut Juice",
    "description": "Natural isotonic beverage from young green coconuts.",
    "price": 4.0,
    "category": "Drinks",
    "image": "http://127.0.0.1:5555/static/images/foco_coconut_juice.jpg"
  },
  {
    "item_name": "Brisk Iced Tea Lemon",
    "description": "Lemon-flavored iced tea.",
    "price": 3.0,
    "category": "Drinks",
    "image": "http://127.0.0.1:5555/static/images/brisk_iced_tea_lemon.jpg"
  }
]
