import React, { useState, useEffect } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import { Context } from '../context/Context'


function Cart({ 
  open, 
  setOpen 
}) {
  const {
    currentUser, 
    currentOrder,
    onDeleteOrderItem,
    onPlaceOrder
   } = useContext(Context)
  
  const orderItems = currentOrder[0]?.order_items || [];
  const orderPrice = currentOrder[0]?.total_price || 0;
  
  if (!currentOrder && !orderPrice) {
    return <div>Loading...</div>;
  }

  console.log(currentOrder)
  
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
    })
  }

  function handlePlaceOrder(id) {
    fetch(`/orders/${id}`, {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderStatus: "Order Placed"
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error("Order placed failed.")
      }
      else {
        return res.json()
      }
    })
    .then((updatedOrder) => onPlaceOrder(updatedOrder))
  }

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
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
                    <DialogTitle className="text-lg font-medium text-gray-900">Shopping cart</DialogTitle>
                    <div className="ml-3 flex h-7 items-center">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
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
                          <p className="text-gray-500 text-sm">Cart is empty...</p>
                        </div>
                      ) : (
                        <ul role="list" className="-my-6 divide-y divide-gray-200">
                          {orderItems.map((orderItem) => (
                            <li key={orderItem.id} className="flex py-6">
                              <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  alt={orderItem.item.description}
                                  src={orderItem.item.image}
                                  className="size-full object-cover"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <div className="flex justify-between text-base font-medium text-gray-900">
                                    <h3>
                                      <a>{orderItem.item.name}</a>
                                    </h3>
                                    <p className="ml-4">${orderItem.priceByQuantity}</p>
                                  </div>
                                  <p className="mt-1 text-sm text-gray-500">
                                    {orderItem.item.description}
                                  </p>
                                </div>
                                <div className="flex flex-1 items-end justify-between text-sm">
                                  <p className="text-gray-500">Qty {orderItem.quantity}</p>
                                  <div className="flex">
                                    <button
                                      type="button"
                                      className="font-medium text-black hover:text-gray-700"
                                      onClick={() => handleDeleteOrder(orderItem.id)}
                                    >
                                      Remove
                                    </button>
                                  </div>
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
                      handlePlaceOrder(currentUser.id);
                      setOpen(false);
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
                        onClick={() => setOpen(false)}
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
}

export default Cart;

