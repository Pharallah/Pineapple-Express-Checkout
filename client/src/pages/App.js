import React from "react";
// eslint-disable-next-line
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedDashboardRoute from "../components/ProtectedDashboardRoute";
import Signup from "./Signup";
import Login from "./Login";
import Dashboard from "./Dashboard";
import { useContext } from "react";
import { Context } from "../context/Context";

function App() {
  const { currentUser } = useContext(Context);

  return (
        <Routes>
            {/* Default route: Direct unauthenticated users to Signup */}
            <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Signup />} />

            {/* Login page */}
            <Route path="/login" element={<Login />} />

            {/* Protected Dashboard Route */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedDashboardRoute isAuthenticated={currentUser}>
                        <Dashboard />
                    </ProtectedDashboardRoute>
                }
            />
        </Routes>
);
}

export default App;
