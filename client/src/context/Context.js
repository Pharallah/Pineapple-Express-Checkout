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

    console.log(currentUser)

    // CHECKS FOR AUTHENTICATED USER
    // useEffect(() => {
    //     fetch('/current_user')
    //     .then(res => res.json())
    //     .then(currentUser => setCurrentUser(currentUser))
    // }, [])
    
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

    function onSignup(user) {
        const updatedCustomers = [
            ...customers,
            user
        ]
        setCustomers(updatedCustomers)
    }
  
    return <Context.Provider value={
        {
            currentUser, setCurrentUser,
            customers, setCustomers,
            orders, setOrders,
            orderItems, setOrderItems,
            categories, setCategories,
            items, setItems,
            onSignup
        }
    }>{children}</Context.Provider>
}

export { Context, ContextProvider }