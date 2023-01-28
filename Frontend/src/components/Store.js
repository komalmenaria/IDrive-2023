import React, { useEffect ,useState} from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from "react-router-dom";

function Store() {
    const newUser = JSON.parse(localStorage.getItem("user-info"))
    const token = localStorage.getItem("token");
    const [allFolders , setAllFolders] = useState("");
    const [allFiles , setAllFiles] = useState("");
    const [allImages , setAllImages] = useState("");
    async function getFolders() {
        try {
            let result = await axios.get(`http://localhost:4000/api/folders/${newUser.id}`, {
            headers: {
                'x-auth-token': token
            }
        })
        if (result.status === 200) {
            console.log(result.data)
            setAllFolders(result.data)
        }

        } catch (error) {
            console.log(error)
        }
    }
    async function getFiles() {
        try {
            let result = await axios.get(`http://localhost:4000/api/getfiles/${newUser.id}`, {
            headers: {
                'x-auth-token': token
            }
        })
        if (result.status === 200) {
            console.log(result.data)
            setAllFiles(result.data)
        }

        } catch (error) {
            console.log(error)
        }
    }
    async function getImages() {
        try {
            let result = await axios.get(`http://localhost:4000/api/getimages/${newUser.id}`, {
            headers: {
                'x-auth-token': token
            }
        })
        if (result.status === 200) {
            console.log(result.data)
            setAllImages(result.data)
        }

        } catch (error) {
            console.log(error)
        }
    }
useEffect(()=>{
    getFolders()
    getFiles()
    getImages()
},[])
    
    return (
        <>


            <div className="d-flex ">
                <div className="col-sm-3 " style={{ backgroundColor: "#edf2fa" }}>
                    <Header />
                </div>
                <div className="col-sm-9">
                    <div className='folders my-3'>
                        <h4> Folders</h4>
                        <div className="d-flex flex-wrap">
                            { allFolders && allFolders.length ? 
                                (
                                    allFolders.map((folder)=>(
                                        <span className='single-folder text-capitalize'>{folder.folderName}</span>
                                    ))
                                )
                                 : 
                               ( <h3>You have no folder </h3>   )}
                            
                            
                        </div>
                    </div>
                    <div className='files my-3'>
                        <h4> Files</h4>
                        <div className="d-flex flex-wrap">
                            { allFiles && allFiles.length ? 
                                (
                                    allFiles.map((file)=>(
                                        <Link className='single-file m-2 text-capitalize' to={file.url}>{file.name}</Link>
                                    ))
                                )
                                 : 
                               ( <h3>You have no Files </h3>   )}
                            
                            
                        </div>
                    </div>
                    <div className='images my-3'>
                        <h4> Images</h4>
                        <div className="d-flex flex-wrap">
                            { allImages && allImages.length ? 
                                (
                                    allImages.map((Image)=>(
                                        <img  src={Image.url} className='img-thumbnail' alt={Image.name} height="200" width="200" />
                                    ))
                                )
                                 : 
                               ( <h3>You have no Images </h3>   )}
                            
                            
                        </div>
                    </div>

                </div>
            </div>


        </>
    )
}

export default Store