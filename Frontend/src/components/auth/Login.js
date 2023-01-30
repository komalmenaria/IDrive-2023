import React, { useState, useEffect } from 'react';
import LoginImg from "../../assets/Login.svg";
import { Link } from "react-router-dom"
import { useNavigate } from 'react-router';
import { useAlert } from "react-alert";

function Login() {
    const alert = useAlert();
    const Navigation = useNavigate()
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
        Navigation("/about")
     }
        }, []);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
    async function login() {
        let item = { email, password }
        console.log(item)
        try {
            let result = await fetch("http://localhost:4000/api/login", {
                method: 'POST',
                body: JSON.stringify(item),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            });

            if (result.status === 200) {
                alert.success("Login Successfully")
                result = await result.json()
                localStorage.setItem("token", result.token)
                localStorage.setItem("user-info", JSON.stringify(result.user))
                Navigation("/store")
                console.log(result)
            }else{
                result = await result.json()
                alert.error(result.msg)
            }
        } catch (error) {
            console.log('error', error)
            alert.error(error)

        }
    }
    return (
        <>
            <div className="d-flex   align-items-center flex-wrap mx-3" style={{marginTop:"40px"}}>
                <img src={LoginImg} alt="Login to your account"  />

                <div className=' login-form' >
                    <h1>User Login</h1>
                    <br />
                    <div className="form-group">
                    <label htmlFor="email">Email </label>
                    <input type="email" onChange={(e) => setEmail(e.target.value)} className="form-control" id="email" aria-describedby="emailHelp" />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" onChange={(e) => setPassword(e.target.value)} className="form-control" id="password" />
                </div>

                    <button type="submit" onClick={login} className="btn btn-primary">LOGIN</button>
                    <br />
                    <Link to="/reset-password" type="button" className="text-danger" > Forget Password </Link>
                    <br />
                    <br />
                    <Link to="/register" >Not have any account ? <b>Register</b></Link>

                </div>
                
            </div>
        </>
    )
}

export default Login