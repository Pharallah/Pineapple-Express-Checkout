import React, { useState } from 'react';
import { useContext } from 'react';
import { Context } from '../context/Context';
import NavBar from '../components/NavBar';

function OrderHistory() {
  const { currentUser, pastOrders } = useContext(Context);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded order

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prevId) => (prevId === orderId ? null : orderId));
  };

  return (
    <>
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 lg:px-8"> {/* Adjusted max-width */}
        <ul className="divide-y divide-gray-300">
          {pastOrders.map((order) => {
            // Parse and format dates
            const formattedCreatedAt = new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const formattedPickupTime = new Date(order.pickup_time).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });

            const isExpanded = expandedOrderId === order.id;

            return (
              <li
                key={order.id}
                className="flex flex-col gap-x-8 py-6 cursor-pointer border-b"
                onClick={() => toggleExpand(order.id)}
              >
                {/* Unexpanded List */}
                <div className="flex justify-between">
                  <div className="flex min-w-0 gap-x-6">
                    <div className="min-w-0 flex-auto">
                      <p className="text-lg font-bold text-gray-900">
                        Completed: {formattedPickupTime}
                      </p>
                      <p className="mt-2 text-md text-gray-700">Type: {order.order_type}</p>
                    </div>
                  </div>
                  <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                    <p className="text-lg text-gray-900">
                      # of Items: {order.number_of_items}
                    </p>
                    <p className="mt-2 text-md text-gray-700">
                      Total Price: ${order.total_price}
                    </p>
                  </div>
                </div>
                {/* Expanded List */}
                {isExpanded && (
                  <div className="mt-6 bg-gray-100 p-6 rounded-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Order Items:</h3>
                    <ul className="space-y-6">
                      {order.order_items.map((item, index) => (
                        <li key={index} className="flex items-start justify-between">
                          {/* Image and Item Name */}
                          <div className="flex items-center space-x-6">
                            <img
                              src={item.item.image}
                              alt={item.item.name}
                              className="w-20 h-20 object-cover rounded-md"
                            />
                            <div className="flex-1">
                              {/* Make this container flexible to prevent overlap */}
                              <p className="text-lg font-bold text-gray-900">{item.item.name}</p>
                              <p className="text-md text-gray-700 break-words">{item.item.description}</p> {/* Allow line breaks */}
                            </div>
                            {/* Quantity and Total */}
                            <div className="text-right flex-shrink-0">
                              <p className="text-md text-gray-800">Quantity: {item.quantity}</p>
                              <br></br>
                              <p className="text-md text-gray-800">Total: ${item.quantity * item.item.price}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default OrderHistory;