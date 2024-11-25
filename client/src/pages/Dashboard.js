import React, { useState } from 'react'
import NavBar from '../components/NavBar'
import ItemContainer from '../components/ItemContainer'
// import { useContext } from 'react'
// import { Context } from '../context/Context'
import Cart from './Cart'

function Dashboard() {
  const [open, setOpen] = useState(true)


  return (
  <>
    <NavBar />
    <ItemContainer/>

    {open && <Cart open={open} setOpen={setOpen}/>}
  </>
    
  )
}

export default Dashboard

