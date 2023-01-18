import registerScreen from "../../assets/registerScreen.jpg";
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { useAlert } from "react-alert";

function Register() {
  const alert = useAlert();
    const Navigation = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
        Navigation("/about")
     }
        }, []);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const register = async (e) => {
        e.preventDefault()
       
        let item = { name, email, password }
        console.log(item)
try {
    let result = await fetch("http://localhost:4000/api/register", {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    })
    if (result.status == 200) {
        alert.success(`${name} you are registered successfully`)
        result = await result.json()
        localStorage.setItem("token", result.token)
        localStorage.setItem("user-info", JSON.stringify(result.user))
        Navigation("/about")
        console.log(result)
    }else{
        result = await result.json()
        alert.error(result.msg)
    }
} catch (error) {
    console.log('error', error)
    alert.error(error)
}   }
  return (
    <>
      <div className="d-flex justify-content-around align-item-center register-background">

        <div className='register-form'>
          <h2><center>User Registration</center></h2>
          <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="form-control" id="name" autoComplete='false' required />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" aria-describedby="emailHelp" autoComplete='false' required />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" autoComplete='false' required />
                </div>
                <button onClick={register} className="btn btn-primary">Submit </button>
          <br />
          <br />
          <Link to="/login"> Already have Account ? <b>Login</b></Link>
        </div>
        <img src={registerScreen} alt="" />
      </div>
    </>
  )
}

export default Register