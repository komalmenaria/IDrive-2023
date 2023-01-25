import React from 'react'

function UploadFile() {
  return (
   <>
   
<div className="modal fade" id="uploadFiles" tabindex="-1" aria-labelledby="uploadFiles" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="uploadFiles">Upload Files</h5>
        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
      <div className="form-group">
      <div className="custom-file">
    <input type="file" accept='.txt ,.jpg ,.jpeg ,.png ,.py , .mp3 ,.mp4' className="custom-file-input" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" />
    <label className="custom-file-label" for="inputGroupFile04">Choose file</label>
    </div>
  </div>
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
        <button type="button" className="btn btn-primary">Save changes</button>
      </div>
    </div>
  </div>
</div>
   </>
  )
}

export default UploadFile