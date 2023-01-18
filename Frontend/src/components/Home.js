import React from 'react';
import StorageImg from "../assets/storage.jpg";
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
<div className="d-flex justify-content-center align-items-center mx-3">
  <div className="container">
    <h1 style={{fontSize:"6rem"}}>Inotebook</h1>
    <p style={{fontSize:"25px",fontWeight:"400"}}>Free Storage for your  essential documents, Notes, photos, files</p>
    <div className="d-flex">
    <Link className="btn btn-primary btn-lg mx-2" to="/login" role="button">Login</Link>
    <Link className="btn btn-primary btn-lg mx-2" to="/register" role="button">SignIn</Link>
    </div>
  </div>
<img src={StorageImg} alt="storage your images" />
</div>
    </>
  )
}

export default Home