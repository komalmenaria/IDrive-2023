import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAlert } from 'react-alert';

function Checkout() {
    const Navigation = useNavigate();
    const alert = useAlert();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [storage, setStorage] = useState(0);
    const [amount, setAmount] = useState(0);


    const FormData = require('form-data');
    const formdata = new FormData();
    formdata.append('name', name);
    formdata.append('email', email);
    formdata.append('storage', storage);
    formdata.append('amount', amount);

    const token = localStorage.getItem("token");
    const newUser = JSON.parse(localStorage.getItem("user-info"))

    let item = { name, email, storage,amount }
    function loadScript(src) {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }

    async function verifyPayment(response){
        return new Promise(async (resolve,reject)=>{
          try{
            
            let {data} =  await axios.post(`http://localhost:4000/api/payment/${newUser.id}` ,
            response,
            {
             headers: {
               "x-auth-token":  token //the token is a variable which holds the token
             }
            }
             )
             console.log(data)
             if(data.signatureIsValid){
              alert.success("Payment Successfull")
              resolve("success")
             }
             else{
              reject(new Error("Payement verfication failed"))
             }
            
          }
          catch(error){
            reject(error)
          }
        })
      }

    async function handlePaymentProceed() {
       console.log(formdata)

        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
            
        );

        if (!res) {
            alert("Razorpay SDK failed to load. Are you online?");
            return;
        }

    try {
        let result = await fetch(`http://localhost:4000/api/checkout/${newUser.id}`,{
            method: 'POST',
            body:JSON.stringify(item),
            headers: {
              "x-auth-token": token
            }});
            if (!result) {
              alert("Server error. Are you online?");
              return;
          }
          
          result = await result.json();
             // Getting the order details back
      //  const { amount, id: order_id, currency } = result.data;
      if(result.status !== 200){
        alert.error(result.response.data.msg)
      }
      let options = {
        "key": "rzp_test_MZKmCG9d2PjRde",
        "amount": amount,
        "name": "Inotebook",
        "currency":"INR",
        "order_id": result.id,    
        "handler": async function (response){
          console.log(JSON.stringify(response))
          // alert.success(response.razorpay_payment_id);
          // alert.success(response.razorpay_order_id);
          // alert.success(response.razorpay_signature)
          try{
           await verifyPayment(response)

          }
          catch(error){
            console.log(error)
          }
        },
        "prefill": {
            "email": result.receipt
        },
        "theme": {
            "color": "#61dafb"
        }
    };
    console.log(options)
    const rzp1 = new window.Razorpay(options); //instead of new Razorpay(options)
    rzp1.on('payment.failed', function (response){
      alert.error(response.error.code);
      alert.error(response.error.description);
      alert.error(response.error.source);
      alert.error(response.error.step);
      alert.error(response.error.reason);
      alert.error(response.error.metadata.order_id);
      alert.error(response.error.metadata.payment_id);
  });
    rzp1.open();

    console.log(rzp1)
      if(!result){
        alert.error(result.msg)
      }   
    }
    catch (error) {
      alert.error(error)
    }
    }
    useEffect(() => {
      
        if (!token) {
            Navigation("/login")
        }
    }, []);
    return (
        <>
           
            <div className="container my-4">
                <center><h1>Billing For Buy Storage</h1></center>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input type="text" className="form-control" id="name" onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="storage">Storage Size</label>
                    <select className="form-control" id="storage" value={storage} onChange={(e) => setStorage(e.target.value)} >
                        <option  value={1}>1 GB</option>
                        <option  value={2}>2 GB</option>
                        <option  value={3}>3 GB</option>
                        <option  value={4}>4 GB</option>
                        <option  value={5}>5 GB</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" className="form-control" id="amount" onChange={(e) => setAmount(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary" onClick={handlePaymentProceed}>Proceed to Buy</button>

            </div>
        </>
    )
}

export default Checkout