import React, { useContext, useState } from 'react';
import { Context } from '../context/Context';

function ItemContainer() {
    const { 
        currentUser, 
        items, 
        categories, 
        onNewOrder, 
        onNewOrderItem, 
        onUpdateOrderItem 
    } = useContext(Context);
    const [orderType, setOrderType] = useState("Take-Out");
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    console.log("Order Type?", orderType)
    console.log("Model Open?", isModalOpen)
    console.log("Selected Date:", selectedDate)
    console.log("Selected Time:", selectedTime)

    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value);
    };

    const handleSave = () => {
        console.log(`Selected Date: ${selectedDate}, Selected Time: ${selectedTime}`);
        setModalOpen(false);
    };

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
        // <div className="bg-white">
        //     {/* Order Type Toggle */}
        //     <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        //         <div className="flex items-center justify-between mt-10 mb-1">
        //             <label className="relative inline-flex cursor-pointer items-center">
        //                 <input
        //                     type="checkbox"
        //                     checked={orderType === "Catering"}
        //                     onChange={handleToggle}
        //                     className="peer sr-only"
        //                 />
        //                 <div className="peer relative flex h-8 w-42 items-center rounded-full bg-orange-200 px-2 after:absolute after:left-1 after:h-6 after:w-20 after:rounded-full after:bg-black/20 after:duration-300 after:transition-all after:content-[''] peer-checked:after:translate-x-20 peer-focus:outline-none text-sm text-black">
        //                     <span className="absolute left-3 text-md font-bold">Take-Out</span>
        //                     <span className="absolute right-3 text-md font-bold">Catering</span>
        //                 </div>
        //             </label>

        //             {/* Schedule Appointment Button */}
        //             <button
        //                 type="button"
        //                 onClick={openModal}
        //                 className="text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:hover:bg-gray-700">
        //                 <svg className="w-4 h-4 me-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        //                     <path fillRule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z" clipRule="evenodd"/>
        //                 </svg>
        //                 Schedule appointment
        //             </button>

        //         </div>
        //     </div>

        //     {/* Products Section */}
        //     <div className="max-w-2xl mx-auto py-2 px-4 sm:py-2 sm:px-6 lg:max-w-7xl lg:px-8">
        //         <h2 className="sr-only">Products</h2>

        //         {categories.map((category) => (
        //             <div key={category.id} className="mb-4">
        //                 {/* Category Name */}
        //                 <h3 className="text-lg font-semibold text-gray-900 mb-4">
        //                     {category.name}
        //                 </h3>

        //                 {/* Items under this category */}
        //                 <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        //                     {items
        //                         .filter((item) => item.category_id === category.id)
        //                         .map((item) => (
        //                             <div key={item.id} className="group">
        //                                 {/* Image Container */}
        //                                 <div className="relative w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
        //                                     <img
        //                                         src={item.image}
        //                                         alt={item.description}
        //                                         className="w-full h-full object-center object-cover group-hover:opacity-75"
        //                                     />
        //                                 </div>

        //                                 {/* Item Details */}
        //                                 <div className="mt-4 flex items-center justify-between">
        //                                     {/* Item Name */}
        //                                     <div>
        //                                         <h3 className="text-sm font-bold text-gray-700">{item.name}</h3>
        //                                         <p className="mt-1 text-lg font-medium text-gray-900">
        //                                             ${item.price}
        //                                         </p>
                                                
        //                                     </div>
        //                                     {/* Add Item Button */}
        //                                     <button
        //                                         className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-red-600 transition"
        //                                         aria-label={`Add ${item.name}`}
        //                                         onClick={(e) => {
        //                                             onAddItemClick(e, item.id)
        //                                         }}
        //                                     >
        //                                         Add Item
        //                                     </button>
        //                                 </div>
        //                             </div>
        //                         ))}
        //                 </div>
        //             </div>
        //         ))}
        //     </div>
        // </div>
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
                        className="peer relative flex h-8 w-42 items-center rounded-full bg-black px-2 after:absolute after:left-1 after:h-6 after:w-20 after:rounded-full after:bg-white/25 after:duration-300 after:transition-all after:content-[''] peer-checked:after:translate-x-20 peer-focus:outline-none text-sm text-white"
                    >
                        <span
                        className={`absolute left-3 text-md font-bold transition-colors ${
                            orderType === "Catering" ? "text-gray-400" : "text-white"
                        }`}
                        >
                        Take-Out
                        </span>
                        <span
                        className={`absolute right-3 text-md font-bold transition-colors ${
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
                    className="text-white bg-black hover:bg-gray-900 border border-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
                    >
                    <svg
                        className="w-4 h-4 mr-2 text-gray-300"
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
                    Schedule Pickup
                </button>
            </div>
        </div>

        {/* Products Section */}
        <div className="max-w-2xl mx-auto py-2 px-4 sm:py-2 sm:px-6 lg:max-w-7xl lg:px-8">
            <h2 className="sr-only">Products</h2>

            {categories.map((category) => (
                <div key={category.id} className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.name}</h3>
                    <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                        {items
                            .filter((item) => item.category_id === category.id)
                            .map((item) => (
                                <div key={item.id} className="group">
                                    <div className="relative w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                        <img
                                            src={item.image}
                                            alt={item.description}
                                            className="w-full h-full object-center object-cover group-hover:opacity-75"
                                        />
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div>
                                            <h3 className="text-sm font-bold text-gray-700">{item.name}</h3>
                                            <p className="mt-1 text-lg font-medium text-gray-900">${item.price}</p>
                                        </div>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 text-sm font-bold rounded-md hover:bg-red-600 transition"
                                            aria-label={`Add ${item.name}`}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
        <div className="bg-gray-900 text-white rounded-lg shadow-lg max-w-sm w-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-lg font-semibold">Schedule Pickup</h3>
            <button
              onClick={toggleModal}
              className="text-gray-400 hover:bg-gray-800 rounded-lg p-1"
            >
              <svg
                className="w-4 h-4"
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
          <div className="p-4">
            {/* Date Picker */}
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Select Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="block w-full bg-gray-800 border-gray-600 text-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {/* Time Picker */}
            <label className="block text-sm font-medium text-gray-400 mt-4 mb-2">
              Select Time
            </label>
            <input
              type="time"
              value={selectedTime}
              onChange={handleTimeChange}
              className="block w-full bg-gray-800 border-gray-600 text-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          {/* Save and Discard Buttons */}
          <div className="flex justify-end p-4 border-t border-gray-700">
            <button
              onClick={toggleModal}
              className="text-gray-300 bg-gray-800 border border-gray-600 rounded-lg px-4 py-2 mr-2 hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="text-white bg-blue-600 hover:bg-blue-700 rounded-lg px-4 py-2"
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