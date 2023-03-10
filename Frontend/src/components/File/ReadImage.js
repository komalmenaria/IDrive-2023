import React, { useState } from 'react';


function ReadImage({modalImage}) {
   
  console.log(modalImage)

  return (
   <>
   <div class="modal fade " id="openimagemodal" tabindex="-1" aria-labelledby="openimagemodal" aria-hidden="true">
  <div class="modal-dialog  modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
      <center> <img src={modalImage} height={500} width={600}style={{objectFit:"contain"}} alt="" /></center>
      </div>
      
    </div>
  </div>
</div>
   </>
  )
}

export default ReadImage