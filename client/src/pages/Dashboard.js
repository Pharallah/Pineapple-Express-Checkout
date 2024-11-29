import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import ItemContainer from '../components/ItemContainer';
import Cart from './Cart';

function Dashboard() {
  const [open, setOpen] = useState(false)

  function handleOpenCart() {
    setOpen(true)
  }

  return (
  <>
    <NavBar handleOpenCart={handleOpenCart} />
    <ItemContainer/>

    {open && <Cart open={open} setOpen={setOpen}/>}
  </>
    
  )
}

export default Dashboard

