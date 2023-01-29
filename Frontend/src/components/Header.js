import React from 'react';
import { useNavigate } from 'react-router-dom';
import CreateFile from './Data/CreateFile';
import CreateFolder from './Data/CreateFolder';
import UploadFile from './Data/UploadFile';

function Header({ onGrandchildUpdate }) {
  
    const Navigation = useNavigate()
    let newUser = JSON.parse(localStorage.getItem("user-info"))
    function logout() {
        localStorage.clear()
        Navigation("/login")
    }
    return (
        <div >
            <CreateFile onUpdate={onGrandchildUpdate} />
            <CreateFolder onUpdate={onGrandchildUpdate} />
            <UploadFile onUpdate={onGrandchildUpdate} />
            <form className=" form-inline my-3 ">
             
                <input className="form-control mr-sm-2" type="search" placeholder="Search Your Document" aria-label="Search" id='Search'/>
                <button className="btn btn-outline-primary my-2 my-sm-0" type="submit">Search</button>
            </form>
            <div className=" d-flex flex-column my-5">
                <button type="button" className="btn btn-primary my-1" data-toggle="modal" data-target="#createFolder">
                    Create Folder
                </button>
                <button type="button" className="btn btn-primary my-1" data-toggle="modal" data-target="#creareFile">
                    Create File
                </button>
                <button type="button" className="btn btn-primary my-1" data-toggle="modal" data-target="#uploadFiles">
                    Upload Files
                </button>
            </div>
            <div className=" d-flex flex-column my-5">
           <div className="d-flex align-items-center ">
           <span className='cloud-icon'> &#9729;</span> <h3> Storage </h3>
           </div>
                <form>
                    <div className="form-group">
                        <input type="range" className="form-control-range" id="formControlRange" />
                    </div>
                    <center className='my-1'>1.57 GB of 15.00 GB used</center>
                    <center><button className='btn btn-primary my-1'>Buy Storage</button></center>
                </form>
            </div>
            {

                localStorage.getItem("user-info") ?

                    <>

                        <div className="dropdown">
                        Profile 
                            <button className="btn btn-secondary dropdown-toggle mx-1" type="button" data-toggle="dropdown" aria-expanded="false">

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
    )
}

export default Header