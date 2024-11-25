import React, { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
import { useContext } from 'react'
import { Context } from '../context/Context'


function Cart() {
  const { currentUser, currentOrder } = useContext(Context)

  return (
    <div>Cart</div>
  )
}

export default Cart