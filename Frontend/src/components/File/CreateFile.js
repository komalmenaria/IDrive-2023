import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from 'react-alert';

function CreateFile({ onUpdate }) {
  
    const alert = useAlert();
    const newUser = JSON.parse(localStorage.getItem("user-info"))
    const token = localStorage.getItem("token");
    const [fileName, setFileName] = useState('')
    var FormData = require('form-data');
    var data = new FormData();
    data.append('fileName', fileName);

    async function FileCreate() {

        try {
 
            let result = await axios.post(`http://localhost:4000/api/createFile/${newUser.id}`, data, {
                headers: {
                    'x-auth-token': token
                }
            })
            if (result.status === 200) {
                alert.success(result.data.msg);
                
            }else {
                console.log(result.response.data.msg)
                alert.error(result.response.data.msg)
              }

            
        } catch (error) {
            console.log(error)
            alert.error(error.response.data.msg)
        }
        document.getElementById('createFile-close').click()
        onUpdate(fileName)
    }
    return (
        <>

            <div className="modal fade" id="creareFile" tabIndex="-1" aria-labelledby="creareFile" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="creareFile">Create File</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="filename">File Name</label>
                                <input type="text" className="form-control" id="filename" placeholder='eg. myfile.txt, file.py index.html' onChange={(e) => { setFileName(e.target.value) }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" id="createFile-close">Close</button>
                            <button type="button" className="btn btn-primary" onClick={FileCreate}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateFile