import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import downloadImg from "../../assets/download.png"
import ReadImage from './ReadImage';

function Store() {
    const Navigate = useNavigate();
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
    const [modalimage, setImage] = useState(null);

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
        // console.log(file.url)
        Navigate(`/readfile/${file.name}`)
    }
    async function deleteImage(Image) {
        let deleteImg = window.confirm("Are you sure want to delete this image ?")
        if (deleteImg) {
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
    function handlefolder(folder) {
        Navigate(`/${folder.folderName}`)
    }
    useEffect(() => {
        if (!token) {
            Navigate("/login")
        }
        else {
            getFolders()
            getFiles()
            getImages()
        }
    }, [grandchildValue])

    return (
        <>
            <ReadImage modalImage={modalimage} />

            <div className="d-flex store">
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
                                        <span key={folder.folderName} onClick={() => handlefolder(folder)} className='single-folder'>{folder.folderName}</span>
                                    ))
                                )
                                :
                                (<h4>You have no folder </h4>)}


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
                                (<h4>You have no Files </h4>)}


                        </div>
                    </div>
                    <div className='images my-3'>
                        <h4> Images</h4>
                        <div className="d-flex flex-wrap frame-image-div" >
                            {allImages && allImages.length ?
                                (
                                    allImages.map((Image) => (
                                        <div className='m-2' key={Image.name} >
                                            <button type="button" className="btn mx-0 the-img-button" data-toggle="modal" data-target="#openimagemodal" id='openimagemodal'  onClick={() => {   setImage(Image.url) }}>
                                                <img src={Image.url} className='img-thumbnail store-image' loading='lazy' alt={Image.name} height="200" width="200" style={{ cursor: "pointer" }} />
                                            </button>
                                            <span className="badge badge-danger" onClick={() => deleteImage(Image)}>&#10006;</span>
                                            <a className="badge badge-success download" download href={Image.url}><img src={downloadImg} alt="" width="20" height="20" /> </a>

                                        </div>
                                    ))
                                )
                                :
                                (<h4>You have no Images </h4>)}


                        </div>
                    </div>

                </div>
            </div>


        </>
    )
}

export default Store