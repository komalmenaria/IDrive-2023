import React from 'react'
import Header from './Header'

function Store() {
    return (
        <>


            <div className="d-flex ">
                <div className="col-sm-3 " style={{ backgroundColor: "#edf2fa" }}>
                    <Header />
                </div>
                <div className="col-sm-9">
                    <div className='folders my-3'>
                        <h4> Folders</h4>
                        <div className="d-flex flex-wrap">
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                            <span className='single-folder'>Personal_Document</span>
                        </div>
                    </div>
                    <div className='files my-3'>
                        <h4> Files</h4>
                        <div className="d-flex flex-wrap">
                            <span className='single-folder'>Personal_Document</span>
                           
                        </div>
                    </div>

                </div>
            </div>


        </>
    )
}

export default Store