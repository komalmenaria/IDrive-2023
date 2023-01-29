import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';

function Store() {
    const Navigate = useNavigate()
    const [grandchildValue, setGrandchildValue] = useState(0);
    const alert = useAlert();
    function handleGrandchildUpdate(newValue) {
        setGrandchildValue(newValue);
    }
    const newUser = JSON.parse(localStorage.getItem("user-info"))
    const token = localStorage.getItem("token");
    const [allFolders, setAllFolders] = useState("");
    const [allFiles, setAllFiles] = useState("");
    const [allImages, setAllImages] = useState("");
    async function getFolders() {
        try {
            let result = await axios.get(`http://localhost:4000/api/folders/${newUser.id}`, {
                headers: {
                    'x-auth-token': token
                }
            })
            if (result.status === 200) {
                // console.log(result.data)
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
                // console.log(result.data)
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
                // console.log(result.data)
                setAllImages(result.data)
            }

        } catch (error) {
            console.log(error)
        }
    }
    async function handleReadFile(file) {
        console.log(file.name)
        Navigate(`/readfile/${file.name}`)
    }
    async function deleteImage(Image){
        let deleteImg = window.confirm("Are you sure want to delete this image ?")
        if(deleteImg){
            try {
                let result = await axios.delete(`http://localhost:4000/api/deleteImage/${newUser.id}/${Image.name}`, {
                    headers: {
                        'x-auth-token': token
                    }
                })
                if (result.status === 200) {
                    alert.success(result.data.msg);
                    getImages()
                } else {
                    console.log(result.response.data.msg)
                    alert.error(result.response.data.msg)
                }
    
    
            } catch (error) {
                console.log(error)
                alert.error(error.response.data.msg)
            }
        }
    }
    useEffect(() => {
        getFolders()
        getFiles()
        getImages()
    }, [grandchildValue])

    return (
        <>


            <div className="d-flex ">
                <div className="col-sm-3 " style={{ backgroundColor: "#edf2fa" }}>
                    <Header onGrandchildUpdate={handleGrandchildUpdate} />
                </div>
                <div className="col-sm-9">
                    <div className='folders my-3'>
                        <h4> Folders</h4>
                        <div className="d-flex flex-wrap">
                            {allFolders && allFolders.length ?
                                (
                                    allFolders.map((folder) => (
                                        <span key={folder.folderName} className='single-folder'>{folder.folderName}</span>
                                    ))
                                )
                                :
                                (<h3>You have no folder </h3>)}


                        </div>
                    </div>
                    <div className='files my-3'>
                        <h4> Files</h4>
                        <div className="d-flex flex-wrap">
                            {allFiles && allFiles.length ?
                                (
                                    allFiles.map((file) => (
                                        <span key={file.name} onClick={() => handleReadFile(file)} className='single-file m-2' >{file.name}</span>
                                    ))
                                )
                                :
                                (<h3>You have no Files </h3>)}


                        </div>
                    </div>
                    <div className='images my-3'>
                        <h4> Images</h4>
                        <div className="d-flex flex-wrap">
                            {allImages && allImages.length ?
                                (
                                    allImages.map((Image) => (
                                        <div className='m-2'>
                                            <img key={Image.name} src={Image.url} className='img-thumbnail store-image' loading='lazy' alt={Image.name} height="200" width="200" />
                                            <span className="badge badge-danger" onClick={()=>deleteImage(Image)}>&#10006;</span>
                                            <span className="sr-only">unread messages</span>
                                        </div>
                                    ))
                                )
                                :
                                (<h3>You have no Images </h3>)}


                        </div>
                    </div>

                </div>
            </div>


        </>
    )
}

export default Store