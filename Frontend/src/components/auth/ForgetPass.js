import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from 'react-alert';
import ChangePass from './ChangePass';

function ForgetPass() {
  const alert = useAlert();

  const [otpForm, setotpForm] = useState(true);

  const [email, setEmail] = useState("")
  const formData = new FormData();
  formData.append("email", email);

  async function sendOtp() {
    try {

      let result = await axios.post(`http://localhost:4000/api/email-send`, formData);

      if (result.status === 200) {
        alert.success(result.data.msg);
        setotpForm(false)
      }
      else {
        console.log(result)
        alert.error("User not exist")
      }

    } catch (error) {
      console.log(error)
      alert.error(error.response.data.msg)
    }
  }


  return (
    <>
      <div className="container">
        <div className="row justify-content-md-cente m-3">
          <div className="col-sm-3">

          </div>
          <div className='col-sm-6 email-verify-form'>
            <h3>Verify Email</h3>
            {otpForm ?
              <>
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Email address</label>
                  <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} id="email" aria-describedby="emailHelp" required />

                </div>
                <button type="button" className="btn btn-primary" onClick={sendOtp}>Send OTP</button>
              </>
              : <ChangePass />

            }
          </div>
          <div className="col-sm-3">

          </div>
        </div>
      </div>
    </>
  )
}

export default ForgetPass