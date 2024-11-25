import React from 'react'
import { createContext } from 'react'
import { useState, useEffect } from 'react'

const Context = createContext()

function ContextProvider({ children }) {
    const [customers, setCustomers] = useState([])
    const [orders, setOrders] = useState([])
    const [orderItems, setOrderItems] = useState([])
    const [categories, setCategories] = useState([])
    const [items, setItems] = useState([])
    const [currentUser, setCurrentUser] = useState(false)
    const [currentOrder, setCurrentOrder] = useState([])


    // console.log(`CUSTOMERS: ${customers}`)
    // console.log(`ORDERS: ${orders}`)
    // console.log(`ORDERITEMS: ${orderItems}`)
    // console.log(`CATEGORIES: ${categories}`)
    // console.log(`ITEMS: ${items}`)
    // console.log(currentOrder)
    useEffect(() => {
        fetch('/customers')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(customers => setCustomers(customers))
    }, [])

    // CHECKS FOR AUTHENTICATED USER
    useEffect(() => {
        fetch('/current_user')
        .then(res => {
            if (res.ok) {
                return res.json()
            }
        })
        .then((user) => {
            setCurrentUser(user);
        })
    }, [customers, orders, orderItems])

    useEffect(() => {
        if (currentUser !== false) {
          const pendingOrder = currentUser.orders.filter((order) => order.order_status === "Pending Checkout")
          setCurrentOrder(pendingOrder)
        }
      }, [currentUser])

    useEffect(() => {
        fetch('/orders')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(orders => setOrders(orders))
    }, [])

    useEffect(() => {
        fetch('/orderitems')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(orderItems => setOrderItems(orderItems))
    }, [])

    useEffect(() => {
        fetch('/categories')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(categories => setCategories(categories))
    }, [])
    
    useEffect(() => {
        fetch('/items')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(items => setItems(items))
    }, [])

    // ****************** CALLBACK FUNCTIONS **********************

    const onSetCurrentUser = (user) => setCurrentUser(user)

    function onSignup(user) {
        const updatedCustomers = [
            ...customers,
            user
        ]
        setCustomers(updatedCustomers)
    }

    function onNewOrder(newOrder) {
        const updatedOrders = [
            ...orders,
            newOrder
        ]
        setOrders(updatedOrders)
    }

    function onNewOrderItem(newOrderItem) {
        const updatedOrderItems = [
            ...orderItems,
            newOrderItem
        ]
        setOrderItems(updatedOrderItems)
    }

    function onUpdateOrderItem(updatedOrder) {
        const updatedOrderItems = orderItems.filter((item) => {
            if (item.id === updatedOrder.id) {
                return updatedOrder
            } else {
                return item
            }
        })
        setOrderItems(updatedOrderItems)
    }
  
    return <Context.Provider value={
        {
            currentOrder,
            currentUser, setCurrentUser,
            customers, setCustomers,
            orders, setOrders,
            orderItems, setOrderItems,
            categories, setCategories,
            items, setItems,
            onSignup,
            onNewOrder, onNewOrderItem,
            onUpdateOrderItem
        }
    }>{children}</Context.Provider>
}

export { Context, ContextProvider }