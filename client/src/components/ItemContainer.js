import React, { useContext } from 'react';
import { Context } from '../context/Context';

function ItemContainer() {
    const { 
        currentUser, items, 
        categories, onNewOrder, 
        onNewOrderItem, onUpdateOrderItem,
        orderType, setOrderType,
        isModalOpen, setModalOpen,
        selectedDate, setSelectedDate,
        selectedTime, setSelectedTime
    } = useContext(Context);

    const handleToggle = () => {
        setOrderType((prev) => (prev === "Take-Out" ? "Catering" : "Take-Out"));
        toggleModal();
    };

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        const inputTime = e.target.value;
        const minTime = "11:00";
        const maxTime = "20:00";
    
        if (inputTime >= minTime && inputTime <= maxTime) {
            setSelectedTime(inputTime);
        } else {
            alert("Please select a time between 11:00 and 20:00!");
            e.target.value = "11:00"; // Reset invalid input
        }
    };

    const handleSave = () => {
        console.log(`Selected Date: ${selectedDate}, Selected Time: ${selectedTime}`);
        setModalOpen(false);
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
    
        const userOrders = currentUser.orders || [];
    
        // Check for a "Pending Checkout" order
        const pendingOrder = userOrders.find(order => order.order_status === "Pending Checkout");
    
        if (pendingOrder) {
            console.log("Found Pending Checkout order:", pendingOrder);
    
            // Check if the clicked item already exists in the pending order
            const matchedOrderItem = pendingOrder.order_items.find(item => item.item_id === itemId);
    
            if (matchedOrderItem) {
                console.log("Item already exists in order. Updating...");
                updateOrderItem(matchedOrderItem);
            } else {
                console.log("Item not in the order. Adding new item...");
                createOrderItem(pendingOrder, itemId);
            }
        } else {
            // If no Pending Checkout order exists, create a new one
            console.log("No Pending Checkout order found. Creating a new order...");
            createNewOrder(itemId);
        }
    }

    return (
        <div className="bg-white">
        {/* Header Section */}
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <div className="flex items-center justify-between mt-10 mb-1">
                {/* Order Type Toggle */}
                <label className="relative inline-flex cursor-pointer items-center">
                    <input
                        type="checkbox"
                        checked={orderType === "Catering"}
                        onChange={handleToggle}
                        className="peer sr-only"
                    />
                    <div 
                        className="peer relative flex h-12 w-64 items-center rounded-full bg-black px-8 after:absolute after:left-2 after:h-8 after:w-28 after:rounded-full after:bg-white/25 after:duration-900 after:transition-all after:content-[''] peer-checked:after:translate-x-32 peer-focus:outline-none text-lg text-white"
                    >
                        <span
                            className={`absolute left-6 text-lg font-medium transition-colors ${
                                orderType === "Catering" ? "text-gray-400" : "text-white"
                            }`}
                        >
                            Take-Out
                        </span>
                        <span
                            className={`absolute right-7 text-lg font-medium transition-colors ${
                                orderType === "Catering" ? "text-white" : "text-gray-400"
                            }`}
                        >
                            Catering
                        </span>
                    </div>
                </label>

                {/* Schedule Appointment Button */}
                <button
                    type="button"
                    onClick={toggleModal}
                    className="text-white bg-black hover:bg-gray-900 border border-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-700 font-medium rounded-full text-lg h-12 px-8 inline-flex items-center"
                >
                    Schedule Pickup { "\u00A0" }{ "\u00A0" }
                    <svg
                        className="w-7 h-7 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            fillRule="evenodd"
                            d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>

        {/* Products Section */}
        <div className="max-w-2xl mx-auto py-2 px-4 sm:py-5 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Products</h2>

                {categories.map((category) => (
                    <div key={category.id} className="mb-8">
                        {/* Category Name */}
                        <h1 className="text-lg font-semibold text-gray-900 mb-5">
                            <u>{category.name.toUpperCase()}</u>
                        </h1>

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
                                            {/* Item Details */}
                                            <div className="flex-1">
                                                <h3 className="text-sm font-bold text-gray-700 break-words">
                                                {item.name}
                                                </h3>
                                                <p className="mt-1 text-lg font-medium text-gray-900">${item.price}</p>
                                            </div>

                                            {/* Add Item Button */}
                                            <button
                                                className="bg-red-500 text-white px-4 py-2 mt-3 text-sm font-bold rounded-md hover:bg-red-600 transition flex-shrink-0"
                                                aria-label={`Add ${item.name}`}
                                                onClick={(e) => {
                                                onAddItemClick(e, item.id);
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

        
        {/* Modal */}
        {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white text-black rounded-lg shadow-lg max-w-md w-full">
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h3 className="text-xl font-semibold">Schedule Pickup</h3>
                        <button
                            onClick={toggleModal}
                            className="text-gray-600 hover:bg-gray-100 rounded-lg p-2"
                        >
                            <svg
                                className="w-6 h-6"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                        </button>
                    </div>
                    {orderType === "Catering" ? (
                         <div className="p-6">
                         <p className="text-gray-700">
                            Pickup time must be scheduled at least 24 hours in advance and no later than 7 days from today.
                         </p>
                     </div>
                    ) : (
                        <div className="p-6">
                        <p className="text-gray-700">
                            Pickup time must be scheduled at least 20 minutes from now and no later than 8:00 PM today.
                        </p>
                    </div>
                   )}
                    <div className="p-6">
                        {/* Date Picker */}
                        <label className="block text-lg font-medium text-gray-700 mb-3">
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            min={new Date().toISOString().split("T")[0]} // Set the minimum date to today
                            className="block w-full bg-gray-100 border border-gray-300 text-lg text-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg p-3"
                        />
                        {/* Time Picker */}
                        <label className="block text-lg font-medium text-gray-700 mt-6 mb-3">
                            Select Time
                        </label>
                        <select
                            value={selectedTime}
                            onChange={(e) => handleTimeChange(e)}
                            className="block w-full bg-gray-100 border border-gray-300 text-lg text-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-lg p-3"
                        >
                            {/* Generate options dynamically */}
                            {[...Array((9 * 4) + 1)].map((_, i) => {
                                // Calculate time slots starting at 11:00, incrementing by 15 minutes
                                const totalMinutes = 660 + i * 15; // 660 minutes = 11:00 AM
                                const hours = Math.floor(totalMinutes / 60);
                                const minutes = totalMinutes % 60;
                                const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                                return (
                                    <option key={time} value={time}>
                                        {time}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

            
                    <div className="flex justify-between p-6 border-t border-gray-200">
                        <button
                            onClick={toggleModal}
                            className="text-black bg-gray-100 border border-gray-300 rounded-lg px-6 py-3 hover:bg-gray-200 text-lg"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="text-white bg-black hover:bg-gray-800 rounded-lg px-6 py-3 text-lg"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )}


    </div>
    );
}

export default ItemContainer;