import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
  import Navbar from './Navbar';
import Home from './Home';
import Login from './auth/Login';
import Register from './auth/Register';
import About from './About';
import ForgetPass from './auth/ForgetPass';
import Store from './Store';
import Footer from './Footer';
function Main() {
  return (
    <div>
         <Router>
                <Navbar />
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/home" element={<Home />} />
                    <Route exact path="/about" element={<About />} />
                    <Route exact path="/store" element={<Store />} />
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/reset-password" element={<ForgetPass />} />
                    <Route exact path="/register" element={<Register />} />
                </Routes>
                <Footer />
            </Router>
    </div>
  )
}

export default Main