import React from 'react'

function CreateFile() {
    return (
        <>

            <div className="modal fade" id="creareFile" tabindex="-1" aria-labelledby="creareFile" aria-hidden="true">
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
                                <label for="filename">File Name</label>
                                <input type="text" className="form-control" id="filename" placeholder='eg. myfile.txt, file.py, file.doc' />
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

export default CreateFile