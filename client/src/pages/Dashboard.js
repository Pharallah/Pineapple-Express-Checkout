import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import ItemContainer from '../components/ItemContainer';
import Account from './Account';
import Cart from './Cart';

function Dashboard() {
  const [openCart, setOpenCart] = useState(false)
  const [openAccount, setOpenAccount] = useState(false)

  function handleOpenCart() {
    setOpenCart(true);
  }

  function handleOpenAccount() {
    setOpenAccount(true);
  }

  return (
  <>
    <NavBar handleOpenCart={handleOpenCart} handleOpenAccount={handleOpenAccount}/>
    <ItemContainer/>

    {openCart && <Cart openCart={openCart} setOpenCart={setOpenCart}/>}

    {openAccount && <Account openAccount={openAccount} setOpenAccount={setOpenAccount}/>}
  </>
    
  )
}

export default Dashboard

