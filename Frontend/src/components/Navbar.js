import React, { useState,useEffect } from 'react'
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';

function Navbar() {
  
const alert = useAlert();
const Navigation = useNavigate()
const [data, setData] = useState([])
let newUser = JSON.parse(localStorage.getItem("user-info"))
const token = localStorage.getItem("token");


function logout() {
  localStorage.clear()
  Navigation("/login")
}

  return (
    <>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
  <Link className="navbar-brand" to="/">Inotebook</Link>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>

  <div className="collapse navbar-collapse" id="navbarSupportedContent">
    <ul className="navbar-nav mr-auto">
      <li className="nav-item active">
        <Link className="nav-link" to="/home">Home <span className="sr-only">(current)</span></Link>
      </li>
      <li className="nav-item active">
      <Link className="nav-link" to="/about">About <span className="sr-only">(current)</span></Link>

      </li>
    </ul>
    {

localStorage.getItem("user-info") ?

  <>

    <div className="dropdown">
      <button className="btn btn-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-expanded="false">

        {newUser && newUser.name}
      </button>
      <div className="dropdown-menu">
        <button className="dropdown-item" onClick={logout}>Logout</button>
      </div>
    </div>

    <div>
    </div>
  </> : null
}
  </div>
</nav>
    </>
  )
}

export default Navbar