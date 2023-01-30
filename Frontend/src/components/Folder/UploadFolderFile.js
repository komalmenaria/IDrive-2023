import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { useParams } from 'react-router-dom';

function UploadFile({ onUpdate }) {
  const { folderName } = useParams();
  const alert = useAlert();
  const newUser = JSON.parse(localStorage.getItem("user-info"))
  const token = localStorage.getItem("token");
  const [allfiles, setAllfiles] = useState(null)
  var FormData = require('form-data');
  var data = new FormData();
  if (allfiles && allfiles.length) {
    for (let i = 0; i < allfiles.length; i++) {
      data.append('files', allfiles[i]);
    }
  }



  async function FilesUpload() {
    try {
      let result = await axios.post(`http://localhost:4000/api/uploadfiles_folder/${newUser.id}/${folderName}`, data, {
        headers: {
          'x-auth-token': token
        }
      })
      if (result.status === 200) {
        alert.success(result.data.msg);
      } else {
        console.log(result)
        alert.error(result.response.data.msg)
      }
      

    } catch (error) {
      console.log(error)
      alert.error(error.response.data.msg)
    }
    document.getElementById('uploadFolderFiles-close').click()      
      onUpdate(allfiles)
  }
  return (
    <>

      <div className="modal fade" id="uploadFolderFiles" tabIndex="-1" aria-labelledby="uploadFiles" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="uploadFolderFiles">Upload Files</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <div className="custom-file">
                  <input type="file" accept='.txt ,.jpg ,.jpeg ,.png ,.py  , .pdf , .doc' className="custom-file-input" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" multiple onChange={(e) => { setAllfiles(e.target.files) }} required />
                  <label className="custom-file-label" htmlFor="inputGroupFile04">Choose file</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal" id="uploadFolderFiles-close">Close</button>
              <button type="button" className="btn btn-primary" onClick={FilesUpload}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UploadFile