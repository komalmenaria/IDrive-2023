import React, { useState } from 'react';
import axios from 'axios';
import { useAlert } from 'react-alert';
import { useNavigate } from 'react-router-dom';

function Changepass() {
  const Navigate = useNavigate();
  const alert = useAlert();
  const [emailId, setEmailId] = useState("")
  const [password, setPassword] = useState("")
  const [otpcode, setOtpCode] = useState("");

  const formData = new FormData();
  formData.append("email", emailId);
  formData.append("otpCode", otpcode);
  formData.append("password", password);

  const changePassword = async e => {
    e.preventDefault();
    try {

      let result = await axios.post(`http://localhost:4000/api/change-password`, formData);

      if (result.status === 200) {
        alert.success(result.data.msg);
        Navigate('/login')
      }
      else {
        console.log(result)
        alert.error(result.msg)
      }

    } catch (error) {
      console.log(error.response.data.msg)
      alert.error(error.response.data.msg)
      // alert.error(error)
    }
  }
  return (
    <>
      <div className="form-group">
        <label htmlFor="emailId">Email address</label>
        <input type="email" name='emailId' className="form-control" id="emailId" onChange={(e) => setEmailId(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="otpcode">Otp Code</label>
        <input type="number" className="form-control" name='otpcode' id="otpcode" onChange={(e) => setOtpCode(e.target.value)} required />
      </div>
      <div className="form-group">
        <label htmlFor="newpassword">New Password</label>
        <input type="password" className="form-control" name='password' id="newpassword" onChange={(e) => setPassword(e.target.value)} required />
      </div>
      <button type='button' className="btn btn-primary" onClick={changePassword}>Change Password</button>
    </>
  )
}

export default Changepass