import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FolderHeader from './FolderHeader';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';

function Folder() {
    const Navigate = useNavigate();
    const { folderName } = useParams();
    const [grandchildValue, setGrandchildValue] = useState(0);
    const alert = useAlert();
    function handleGrandchildUpdate(newValue) {
        setGrandchildValue(newValue);
    }
    const newUser = JSON.parse(localStorage.getItem("user-info"))
    const token = localStorage.getItem("token");
    const [allFiles, setAllFiles] = useState("");
    const [allImages, setAllImages] = useState("");
    async function getFiles() {
        try {
            let result = await axios.get(`http://localhost:4000/api/getfiles_folder/${newUser.id}/${folderName}`, {
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
            let result = await axios.get(`http://localhost:4000/api/getimages_folder/${newUser.id}/${folderName}`, {
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
        Navigate(`/${folderName}/${file.name}`)
    }
    async function deleteImage(Image) {
        let deleteImg = window.confirm("Are you sure want to delete this image ?")
        if (deleteImg) {
            try {
                let result = await axios.delete(`http://localhost:4000/api/deleteImage_folder/${newUser.id}/${folderName}/${Image.name}`, {
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
        getFiles()
        getImages()
    }, [grandchildValue])
    return (

        <>


            <div className="d-flex folder">
                <div className="col-sm-3 " style={{ backgroundColor: "#edf2fa" }}>
                    <FolderHeader onGrandchildUpdate={handleGrandchildUpdate} />
                </div>
                <div className="col-sm-9">
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
                        <div className="d-flex flex-wrap frame-folder-image-div">
                            {allImages && allImages.length ?
                                (
                                    allImages.map((Image) => (
                                        <div className='m-2'>
                                            <img key={Image.name} src={Image.url} className='img-thumbnail store-image' loading='lazy' alt={Image.name} height="200" width="200" />
                                            <span className="badge badge-danger" onClick={() => deleteImage(Image)}>&#10006;</span>
                                            <span className="sr-only">unread messages</span>
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

export default Folder