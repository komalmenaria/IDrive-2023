import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from 'react-alert';

function CreateFolder() {
    const alert = useAlert();
    const newUser = JSON.parse(localStorage.getItem("user-info"))
    const token = localStorage.getItem("token");
    const [folderName, setfolderName] = useState('')
    var FormData = require('form-data');
    var data = new FormData();
data.append('folderName', folderName);

    async function FolderCreate() {
        try {
            let result = await axios.post(`http://localhost:4000/api/createfolder/${newUser.id}/${newUser.folder}`, data, {
            headers: {
                'x-auth-token': token
            }
        })
        if (result.status == 200) {
            alert.success(result.data.msg);
        }else{
            console.log(result)
        }

        document.getElementById('createFolder-close').click()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>



            <div className="modal fade" id="createFolder" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Create Folder</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label htmlFor="foldername">Folder Name</label>
                                <input type="text" className="form-control" id="foldername" placeholder='eg. Myfolder , Personal_Document , Demo' onChange={(e) => { setfolderName(e.target.value) }} />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" id='createFolder-close' data-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={FolderCreate}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateFolder