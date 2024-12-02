import React, { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { Context } from '../context/Context'


function Cart({ 
  openCart, 
  setOpenCart,
  setShowConfirmationPopup 
}) {
  const {
    currentOrder,
    orderType,
    selectedDate,
    selectedTime,
    onPlaceOrder,
    onUpdateQuantity,
    onDeleteOrderItem,
  } = useContext(Context)

  const [editingInstructions, setEditingInstructions] = useState(null);
  const [instructions, setInstructions] = useState(''); // Tracks the current input value

  
  const orderItems = currentOrder[0]?.order_items || [];
  const orderPrice = currentOrder[0]?.total_price || 0;
  const orderId = currentOrder[0]?.id || null;
  const pickupTime = `${selectedDate}T${selectedTime}:00`;  
  
  function handlePlaceOrder(id) {
    // Validate inputs
    if (!pickupTime || !orderType) {
      console.error("Invalid pickupTime or orderType. Cannot place order.");
      alert("Please ensure all fields are filled out correctly.");
      return;
    }
  
    fetch(`/orders/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderStatus: "Order Placed",
        pickupTime: pickupTime,
        orderType: orderType,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            console.error("Failed to place order:", errorData);
            alert("Error placing the order. Please try again.");
            throw new Error("Failed to place order");
          });
        }
        return response.json();
      })
      .then((placedOrder) => {
        console.log("Order successfully placed:", placedOrder);
        onPlaceOrder(placedOrder);
        setShowConfirmationPopup(true);
      })
      .catch((error) => {
        console.error("Error placing order:", error);
        alert("An unexpected error occurred. Please try again later.");
      });
  }

  function handleDeleteOrder(id) {
    fetch(`/orderitems/${id}`, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(res => {
      if (res.ok) {
        onDeleteOrderItem(id);
      } else {
        throw new Error('Failed to delete');
      }
    });
  };

  function handleAddInstructions(orderItemId) {
    // Submit the special instructions
    fetch(`/orderitems/${orderItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        specialInstructions: instructions,
      }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Failed to update special instructions');
        }
      })
      .then(() => {
        setEditingInstructions(null); // Exit editing mode
        setInstructions(''); // Clear input
      })
      .catch((error) => console.error(error));
  };

  function handleUpdateQuantity(orderItemId, newQuantity) {
    fetch(`/orderitems/${orderItemId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: parseInt(newQuantity, 10), // Ensure it's an integer
      }),
    })
      .then((res) => {
        if (res.ok) {
          console.log("Server response:",res.status)
          return res.json();
        } else {
          throw new Error('Failed to update quantity');
        }
      })
      .then((updatedOrderItem) => {

        onUpdateQuantity(updatedOrderItem)
      })
      .catch((error) => console.error(error));
  };

  return (
    <Dialog open={openCart} onClose={setOpenCart} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity duration-700 ease-in-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
          <DialogPanel
            transition
            className="pointer-events-auto w-screen max-w-md transform transition duration-700 ease-in-out data-[closed]:translate-x-full"
          >
              <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                  <div className="flex items-start justify-between">
                    <DialogTitle className="text-lg font-medium text-gray-900">Order Type: {orderType}</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpenCart(false)}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <XMarkIcon aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flow-root">
                      {orderItems.length === 0 ? (
                        <div className="flex justify-center items-center min-h-[42rem]">
                          <p className="text-gray-500 text-sm">Your cart is looking kinda empty...</p>
                        </div>
                      ) : (
                        <ul className="-my-6 divide-y divide-gray-200">
                          {orderItems.map((orderItem) => (
                          <li key={orderItem.id} className="flex flex-col py-6 w-full">
                          {/* Image Section */}
                          <div className="flex">
                            <div className="w-24 h-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                alt={orderItem.item.description}
                                src={orderItem.item.image}
                                className="w-full h-full object-cover"
                              />
                            </div>
                        
                            {/* Item Info Section */}
                            <div className="ml-4 flex-1">
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3>{orderItem.item.name}</h3>
                                <p className="ml-4">${orderItem.priceByQuantity}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500">{orderItem.item.description}</p>
                            </div>
                          </div>
                        
                          {/* Action Section */}
                          <div className="mt-4 flex flex-col">
                            {/* Dropdown and Remove Button */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <label htmlFor={`quantity-${orderItem.id}`} className="text-gray-500 mr-2">
                                  Qty:
                                </label>
                                <select
                                  id={`quantity-${orderItem.id}`}
                                  value={orderItem.quantity}
                                  onChange={(e) => handleUpdateQuantity(orderItem.id, e.target.value)}
                                  className="border border-gray-300 rounded-md text-gray-700 text-sm p-1"
                                >
                                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                    <option key={num} value={num}>
                                      {num}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <button
                                type="button"
                                className="text-smd text-red-500 hover:text-gray-700"
                                onClick={() => handleDeleteOrder(orderItem.id)}
                              >
                                Remove
                              </button>
                            </div>
                        
                            {/* Special Instructions */}
                            <div className="mt-4">
                              {editingInstructions === orderItem.id ? (
                                <div>
                                  <textarea
                                    className="w-full border rounded-md p-2 text-sm"
                                    placeholder="Enter special instructions..."
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                  />
                                  <div className="flex justify-between items-center mt-2">
                                    <button
                                      onClick={() => {
                                        setEditingInstructions(null);
                                        setInstructions('');
                                      }}
                                      className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => handleAddInstructions(orderItem.id)}
                                      className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900"
                                    >
                                      Submit
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setEditingInstructions(orderItem.id)}
                                  className="text-sm text-blue-500 hover:text-blue-700"
                                >
                                  Add Special Instructions
                                </button>
                              )}
                            </div>
                          </div>
                        </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${orderPrice}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500">Taxes & fees to be calculated at point of sale in-store.</p>
                  <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      handlePlaceOrder(orderId);
                      setOpenCart(false);
                    }}
                    className="flex w-full items-center justify-center rounded-md border border-black bg-black px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-900"
                  >
                    Place Order
                  </button>
                  </div>
                  <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                    <p>
                      or{' '}
                      <button
                        type="button"
                        onClick={() => setOpenCart(false)}
                        className="font-medium text-black hover:text-gray-700"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  )
};

export default Cart;

