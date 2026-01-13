import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import CustomerForm from "./pages/CustomerForm";

function PrivateRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Routes>
      <Route
        path="/login"
        element={<Login setIsLoggedIn={setIsLoggedIn} />}
      />

      <Route
        path="/"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <Customers setIsLoggedIn={setIsLoggedIn} />
          </PrivateRoute>
        }
      />

      <Route
        path="/customer-form"
        element={
          <PrivateRoute isLoggedIn={isLoggedIn}>
            <CustomerForm />
          </PrivateRoute>
        }
      />

      {/* catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;