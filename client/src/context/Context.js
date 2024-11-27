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

    const [orderType, setOrderType] = useState("Take-Out");
    const [isModalOpen, setModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("12:00");

    // console.log(`CUSTOMERS:`, customers)
    // console.log('ORDERS:', orders)
    // console.log(`ORDERITEMS:`, orderItems)
    // console.log(`CATEGORIES:`, categories)
    // console.log(`ITEMS:`, items)
    // console.log('CurrentUSER:', currentUser)
    // console.log('CurrentORDER:', currentOrder)

    
    // Updates currentUser via changes to orders & orderItems
    useEffect(() => {
        updateCurrentUser();
    }, [orders, orderItems])

    function updateCurrentUser() {
        fetch('/current_user')
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((user) => {
                setCurrentUser(user);
                if (user) {
                    recalculateCurrentOrder(user); // Works because recalculateCurrentOrder is getting its source from the server
                }
            })
            .catch((err) => console.error("Error fetching current user:", err));
    }
    
    // Guards recalculateCurrentOrder from changes in currentUser being executed anywhere outside of updateCurrentUser (i.e. Signup & Login)
    useEffect(() => {
        if (currentUser) {
            recalculateCurrentOrder(currentUser);
        }
    }, [currentUser]);

    function recalculateCurrentOrder(user) {
        if (
            !user || 
            !user.orders || 
            !Array.isArray(user.orders
            )) {
            setCurrentOrder([]); 
            return;
        };

        const pendingOrder = user.orders.find((order) => order.order_status === "Pending Checkout");

        setCurrentOrder(pendingOrder ? [pendingOrder] : []);
    }
    
    //  *********************************************************
    
    // setCustomers
    useEffect(() => {
        fetch('/customers')
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(customers => {
            setCustomers(customers);
        })
    }, [])

    // setOrders
    useEffect(() => {
        fetch('/orders')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                return res.json();
            })
            .then(orders => setOrders(orders))
    }, [orderItems])

    // setOrderItems
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

    // setCategories
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
    
    // setItems
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

    // ************* CALLBACK FUNCTIONS *******************

    function onSignup(newCustomer) {
        const updatedCustomers = [
            ...customers,
            newCustomer
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
        const updatedOrderItems = orderItems.map((item) => {
            if (item.id === updatedOrder.id) {
                return updatedOrder
            } else {
                return item
            }
        })
        setOrderItems(updatedOrderItems)
    }

    function onDeleteOrderItem(id) {
        const updatedOrderItems = orderItems.filter((item) => item.id !== id)
        setOrderItems(updatedOrderItems);
    }
  
    function onPlaceOrder(updatedOrder) {
        const updatedOrders = orders.map((order) => {
            if (order.id === updatedOrder.id) {
                return updatedOrder
            } else {
                return order
            }
        })
        setOrders(updatedOrders);
    }

    function onUpdateQuantity(updatedOrderItem) {
        const updatedOrderItems = orderItems.map((item) => item.id === updatedOrderItem.id ? updatedOrderItem : item)
        setOrderItems(updatedOrderItems)
    }
    return <Context.Provider value={
        {
            currentUser, setCurrentUser, updateCurrentUser,
            currentOrder, recalculateCurrentOrder, 
            customers, setCustomers,
            orders, setOrders,
            orderItems, setOrderItems,
            categories, setCategories,
            items, setItems,
            onSignup, 
            onNewOrder, onNewOrderItem,
            onUpdateOrderItem, onDeleteOrderItem,
            onUpdateQuantity, onPlaceOrder,
            orderType, setOrderType,
            isModalOpen, setModalOpen,
            selectedDate, setSelectedDate,
            selectedTime, setSelectedTime
        }
    }>{children}</Context.Provider>
}

export { Context, ContextProvider }