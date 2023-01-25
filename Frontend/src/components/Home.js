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
    <p style={{fontSize:"25px",fontWeight:"400"}}>Notes, photos, files</p>
    <div className="row">
   <div className="col-3">
   <Link className="btn btn-primary btn-lg mx-2 btn-block" to="/login" role="button">Login</Link>
   </div>
    <div className="col-3">
    <Link className="btn btn-primary btn-lg mx-2 btn-block" to="/register" role="button">SignIn</Link>
    </div>
    </div>
  </div>
<img src={StorageImg} alt="storage your images" />
</div>
<div className="jumbotron jumbotron-fluid my-4 about-container">
  <div className="container ">
    <h1 className="display-4">About Us</h1>
  
    <p className="lead" > In today’s era we are unable to remember Everything. We get so busy in the schedule of life that we forget small things. Sometimes we forget our email id – password, Aadhar Card, Pen Card and many more essential documents. And then we face a lot of trouble, and that we have to visit our home again or we have to call someone to send our documents.</p>

        <p className="lead" >Inotebook is the website or we can say the app where we can store our notes, our passwords, our essential documents or files and photos etc.</p>

        <p className="lead" >In Inotebook, we can create folders and upload our documents, like if you created a folder with the name id proof and you uploaded your Pan Card, Aadhar Card, Driving license, Photo of signature, Your Passport size photos, So you can easily login in this site open the folder and download whatever you want anytime and anywhere.</p>

        <p className="lead" >There is a search bar to accomplish a task more quickly, here you can search for name of file and folder or any text you written in Inotebook to get the document, file, folder and notes.</p>

        <p className="lead" >So now we have a clear idea about Inotebook, that why you need to use Inotebook and what are the benefits you will get using Inotebook. If you deleted any documents there is a trash bin folder from where you can recollect your documents easily.</p>
  </div>
</div>

     
    </>
  )
}

export default Home