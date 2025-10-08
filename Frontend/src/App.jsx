import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Signin from "./pages/SignIn";
import Navbar from "./components/Navbar";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/Interview";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<Signin />} />
         <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/Interview" element={<Interview />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
