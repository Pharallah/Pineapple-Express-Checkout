import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import ItemContainer from '../components/ItemContainer'
// import { useContext } from 'react'
// import { Context } from '../context/Context'
import Cart from './Cart'

function Dashboard() {
  const [open, setOpen] = useState(false)

  function handleOpenCart() {
    setOpen(true)
  }

  // console.log(open)

  return (
  <>
    <NavBar handleOpenCart={handleOpenCart} />
    <ItemContainer/>

    {open && <Cart open={open} setOpen={setOpen}/>}
  </>
    
  )
}

export default Dashboard

