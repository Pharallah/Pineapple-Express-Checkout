import React, { useEffect, useState } from "react";
import Signup from "./Signup";
import Dashboard from "./Dashboard";
import { useContext } from "react";
import { Context } from "../context/Context";

function App() {
  const { currentUser } = useContext(Context)
  

  return (
    <>
      {currentUser ? <Dashboard /> : <Signup />}
    </>
  )
}

export default App;
