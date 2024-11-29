import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { Context } from '../context/Context'
import NavBar from '../components/NavBar'

function OrderHistory() {

  const { currentUser } = useContext(Context)


  return (
    <>
      <NavBar />
    </>
  )
}

export default OrderHistory