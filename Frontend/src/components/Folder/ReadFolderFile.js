import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAlert } from 'react-alert';
import { Link } from 'react-router-dom';


function ReadFolderFile() {
    const Navigate = useNavigate();
    const { folderName,fileName } = useParams();
    const alert = useAlert();
    const newUser = JSON.parse(localStorage.getItem("user-info"))
    const token = localStorage.getItem("token");
    const [disabled, setDisable] = useState(true)

    const [fileData, setFileData] = useState("")
    async function getFileData() {
        try {
            let result = await axios.get(`http://localhost:4000/api/readFile_folder/${newUser.id}/${folderName}/${fileName}`, {
                headers: {
                    'x-auth-token': token
                }
            })
            if (result.status === 200) {
                setFileData(result.data.fileContent)
            }

        } catch (error) {
            console.log(error)
        }
    }


    var FormData = require('form-data');
    var data = new FormData();
    data.append('contentFile', fileData);

    async function postfileUpdate() {
        try {
            let result = await axios.put(`http://localhost:4000/api/updateFile_folder/${newUser.id}/${folderName}/${fileName}`, data, {
                headers: {
                    'x-auth-token': token
                }
            })
            if (result.status === 200) {
                alert.success(result.data.msg);
                setDisable(true)
                getFileData()
            } else {
                console.log(result.response.data.msg)
                alert.error(result.response.data.msg)
            }


        } catch (error) {
            console.log(error)
            alert.error(error.response.data.msg)
        }

    }


    async function deleteFile() {
        try {
            let result = await axios.delete(`http://localhost:4000/api/deleteFile_folder/${newUser.id}/${folderName}/${fileName}`, {
                headers: {
                    'x-auth-token': token
                }
            })
            if (result.status === 200) {
                alert.success(result.data.msg);
                Navigate(`/${folderName}`)
            } else {
                console.log(result.response.data.msg)
                alert.error(result.response.data.msg)
            }


        } catch (error) {
            console.log(error)
            alert.error(error.response.data.msg)
        }

    }
     function backToFolder() {
        Navigate(-1)
    }

    useEffect(() => {
        getFileData()
    }, [])
    return (
        <>
        {fileName ?
        <> 
        <div className="m-3 single-file-reade">
                <div className="d-flex justify-content-between">
                    <div>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                                <li className="breadcrumb-item active" ><Link to="/store">Store</Link></li>
                                <li className="breadcrumb-item active" ><Link onClick={backToFolder}>{folderName}</Link></li>
                           
                            </ol>
                        </nav>
                    </div>
                    <div><button type="button" className="btn btn-success mx-2" disabled={disabled} onClick={postfileUpdate} >Update File</button>
                        <button type="button" className="btn btn-danger mx-2" onClick={deleteFile}>Delete File</button></div>
                </div>
                <div className="form-group">
                    <label htmlFor="exampleFormControlTextarea1" className='single-file'>{fileName} </label>
                    <textarea className="form-control" id="exampleFormControlTextarea1" value={fileData} placeholder='Write Something in your file' onChange={(e) => {
                        setFileData(e.target.value)
                        setDisable(false)
                    }} rows="20" ></textarea>
                </div>
            </div>
        </>
    
    : "Page not found"}
            
        </>
    )
}

export default ReadFolderFile