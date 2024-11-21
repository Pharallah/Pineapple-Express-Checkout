import React from 'react'
import NavBar from '../components/NavBar'
import ItemContainer from '../components/ItemContainer'
import { useContext } from 'react'
import { Context } from '../context/Context'

function Dashboard() {
  return (
  <>
    <NavBar />
    <ItemContainer/>
  </>
    
  )
}

export default Dashboard

