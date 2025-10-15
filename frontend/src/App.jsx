import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";
import Signin from "./pages/signin";
import Signup from "./pages/signup";
import ProtectedRoute from "./components/ProtectedRoute";
const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/interview" element={<ProtectedRoute><Interview /></ProtectedRoute>} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/signup" element={<Signup/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
