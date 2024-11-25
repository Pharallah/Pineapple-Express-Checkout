import React, { useContext, useState } from 'react';
import { Context } from '../context/Context';

function ItemContainer() {
    const { currentUser, items, orders, categories, onNewOrder, onNewOrderItem, onUpdateOrderItem } = useContext(Context);
    const [orderType, setOrderType] = useState("Take-Out");

    const handleToggle = () => {
        setOrderType((prev) => (prev === "Take-Out" ? "Catering" : "Take-Out"));
    };

    function createNewOrder(itemId) {
        fetch('/orders', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customerId: currentUser.id,
                orderType: orderType
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            } 
        })
        .then((newOrder) => {
            onNewOrder(newOrder);
            createOrderItem(newOrder, itemId);
        })
    }

    function createOrderItem(order, itemId) {
        fetch('/orderitems', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                itemId: itemId,
                orderId: order.id
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then((newOrderItem) => {
            onNewOrderItem(newOrderItem)
        })
    }

    function updateOrderItem(orderItem) {
        fetch(`/orderitems/${orderItem.id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                quantity: orderItem.quantity + 1
            })
        })
        .then(res => {
            if (res.ok) {
                return res.json()
            } 
        })
        .then((order)=> {
            onUpdateOrderItem(order)
        })
    }

    function onAddItemClick(e, itemId) {
        e.preventDefault();
        const userOrderLength = currentUser.orders.length;
        
        if (userOrderLength === 0) {
            createNewOrder(itemId); 
        } else {
            for (let order of currentUser.orders) {
                if (order.order_status === "Pending Checkout") {
                    // Finds the OrderItems that match the Item clicked
                    const orderItemsInOrder = order.order_items;
                    const matchedOrderItem = orderItemsInOrder.find((item) => item.item_id === itemId);
    
                    if (matchedOrderItem) {
                        updateOrderItem(matchedOrderItem)
                    } else {
                        createOrderItem(order, itemId)
                    }
                    return;
                }
            }
        }
    }

    return (
        <div className="bg-white">
            {/* Order Type Toggle */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="flex items-center justify-between mt-10 mb-1">
                    <label className="relative inline-flex cursor-pointer items-center">
                        <input
                            type="checkbox"
                            checked={orderType === "Catering"}
                            onChange={handleToggle}
                            className="peer sr-only"
                        />
                        <div className="peer relative flex h-8 w-42 items-center rounded-full bg-orange-200 px-2 after:absolute after:left-1 after:h-6 after:w-20 after:rounded-full after:bg-black/20 after:duration-300 after:transition-all after:content-[''] peer-checked:after:translate-x-20 peer-focus:outline-none text-sm text-black">
                            <span className="absolute left-3 text-md font-bold">Take-Out</span>
                            <span className="absolute right-3 text-md font-bold">Catering</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Products Section */}
            <div className="max-w-2xl mx-auto py-2 px-4 sm:py-2 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>

                {categories.map((category) => (
                    <div key={category.id} className="mb-4">
                        {/* Category Name */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            {category.name}
                        </h3>

                        {/* Items under this category */}
                        <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                            {items
                                .filter((item) => item.category_id === category.id)
                                .map((item) => (
                                    <div key={item.id} className="group">
                                        {/* Image Container */}
                                        <div className="relative w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                            <img
                                                src={item.image}
                                                alt={item.description}
                                                className="w-full h-full object-center object-cover group-hover:opacity-75"
                                            />
                                        </div>

                                        {/* Item Details */}
                                        <div className="mt-4 flex items-center justify-between">
                                            {/* Item Name */}
                                            <div>
                                                <h3 className="text-sm font-bold text-gray-700">{item.name}</h3>
                                                <p className="mt-1 text-lg font-medium text-gray-900">
                                                    ${item.price}
                                                </p>
                                                
                                            </div>
                                            {/* Add Item Button */}
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-red-600 transition"
                                                aria-label={`Add ${item.name}`}
                                                onClick={(e) => {
                                                    onAddItemClick(e, item.id)
                                                }}
                                            >
                                                Add Item
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ItemContainer;