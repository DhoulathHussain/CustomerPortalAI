import React, { useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Customers from "./pages/Customers";
import CustomerForm from "./pages/CustomerForm";
import Navbar from "./components/Navbar";

function PrivateRoute({ isLoggedIn, children }) {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

function App({ toggleTheme, mode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {isLoggedIn && (
        <Navbar
          setIsLoggedIn={setIsLoggedIn}
          toggleTheme={toggleTheme}
          mode={mode}
        />
      )}
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
    </>
  );
}

export default App;