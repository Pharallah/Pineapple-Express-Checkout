import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { Context } from '../context/Context'

function OrderHistory() {

  const { currentUser } = useContext(Context)
  const [pastOrders, setPastOrders] = useState([])

  console.log(pastOrders)

  useEffect(() => {
    fetch(`/order_history/${currentUser.id}`)
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then((orders) => setPastOrders(orders))
  }, [])


  return (
    <>
      Order History
    </>
  )
}

export default OrderHistory