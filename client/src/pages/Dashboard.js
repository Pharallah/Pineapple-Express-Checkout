import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import ItemContainer from '../components/ItemContainer';
import Account from './Account';
import Cart from './Cart';
import { useContext } from 'react';
import { Context } from '../context/Context';

function Dashboard() {
  const { selectedDate, selectedTime } = useContext(Context);
  const [openCart, setOpenCart] = useState(false);
  const [openAccount, setOpenAccount] = useState(false);
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const currentDate = new Date().toISOString().split("T")[0]; //'YYYY-MM-DD' format
  // Create a new Date object from the string
  const date = new Date(selectedDate);
  const timeParts = selectedTime.split(":");

  // Format the date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'short', // Full weekday name
    year: 'numeric', // Full year
    month: 'long',   // Full month name
    day: 'numeric',  // Day of the month
  }).format(date).replace(',', '');

  date.setHours(timeParts[0], timeParts[1]); // Set the hours and minutes
  // Format the time using Intl.DateTimeFormat
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // Use 12-hour format
  }).format(date);


  console.log("SELECTED TIME", selectedTime)
  console.log("SELECTED DATE", selectedDate)

  function handleOpenCart() {
    setOpenCart(true);
  };

  function handleOpenAccount() {
    setOpenAccount(true);
  };

  return (
    <>
      <NavBar handleOpenCart={handleOpenCart} handleOpenAccount={handleOpenAccount}/>
      <ItemContainer/>

      {openCart && <Cart openCart={openCart} setOpenCart={setOpenCart} setShowConfirmationPopup={setShowConfirmationPopup}/>}

      {openAccount && <Account openAccount={openAccount} setOpenAccount={setOpenAccount}/>}


      {/* Confirmation Popup */}
      {showConfirmationPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-md shadow-lg p-6 w-100 text-center">

            <h2 className="text-xl font-bold mb-6">
              Order Placed Successfully!
            </h2>

            <p className="text-gray-700 mb-6">
              Your order is confirmed for in-store pickup at <br></br><br></br><b>{formattedTime}</b> {selectedDate === currentDate ? "today!" : <>on <b>{formattedDate}</b></>}
            </p>

            <p className="text-gray-700 mb-6 font-bold">
              Address: 8155 Columbia Rd, Olmsted Falls, OH 44138
            </p>
            
            <p className="text-gray-700 mb-6">
              Thank you & see you again!
            </p>

            <button
              onClick={() => setShowConfirmationPopup(false)}
              className="bg-black text-white px-6 py-2 mt-1 rounded-md hover:bg-gray-800 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Dashboard

