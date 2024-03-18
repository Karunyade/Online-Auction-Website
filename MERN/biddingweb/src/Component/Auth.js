// Auth.js
import React, { useState } from "react";
import './Auth.css';
import axios from "axios"
import { useNavigate } from "react-router-dom";
function Auth(){
    return(
        <div className="auth">
          <Register/> <Login/> 
        </div>
    )
}

//Login
const Login=()=>{
    const [fname,setFname]=useState("")
    const [lname,setLname]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    
    const navigate=useNavigate()

    const onSubmit=async(event)=>{
         event.preventDefault();
         try{
            const res=await axios.post("http://127.0.0.1:4000/login",{
            fname,
            lname,
            email,
            password
           });
           if (res.data.message === "Check your Password") 
           {
             alert("Check your password");
             return;
           }
           else if(res.data.message=== "User not found SignIn first")
           {
             alert("User not found SignIn first");
             return;
           }
           else 
           {
            window.localStorage.setItem("email", res.data.email);
            navigate("/activelis");
          }
         }catch(err){
            console.log("error in  login")
         }
     }
    return(
        <Form fname={fname} setFname={setFname} 
        lname={lname} setLname={setLname} 
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        label="Login"
        onSubmit={onSubmit}/>
        );
}

//Registration
const Register=()=>{
    const [fname,setFname]=useState("")
    const [lname,setLname]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")
    
    //post("url",body to send to backend)
    const onSubmit=async(event)=>{
        event.preventDefault();
        try{
           const res=await axios.post("http://127.0.0.1:4000/signup",{
            fname,
            lname,
            email,
            password
           });
           if(res.data.message=== "Account has been created!! Please Login")
           {
             alert("Account has been created!! Please Login");
             return;
           }
           alert("Registration completed Now you can Login")
        }catch(err){
          console.log(err)
        }
    }
    return(
    <Form fname={fname} setFname={setFname} 
    lname={lname} setLname={setLname} 
    email={email} setEmail={setEmail}
    password={password} setPassword={setPassword}
    label="SignUp"
    onSubmit={onSubmit}/>
    );
};


//to use this form repeatedly
const Form=({fname,setFname,lname,setLname,email,setEmail,password,setPassword,label,onSubmit})=>{
    return(
        <div className="auth-container">
        <form onSubmit={onSubmit}>
            <div className="ef border border-primary rounded">
                <fieldset>
                    <center><legend>{label}</legend></center>

                    <div className="input-group pad">
                        <span className="input-group-text">First Name</span>
                        <input type="text" aria-label="First Name" id='fname' value={fname} onChange={(event)=>setFname(event.target.value)}/>
                    </div>

                    <div className="input-group pad">
                        <span className="input-group-text">Last Name</span>
                        <input type="text" aria-label="Last Name" id='lname' value={lname} onChange={(event)=>setLname(event.target.value)}/>
                    </div>

                    <div className="input-group pad">
                        <span className="input-group-text">Email</span>
                        <input type="text" aria-label="Email" id='email' value={email} onChange={(event)=>setEmail(event.target.value)}/>
                    </div>

                    <div className="input-group pad">
                        <span className="input-group-text">Password</span>
                        <input type="password" aria-label="Password" id='password' value={password} onChange={(event)=>setPassword(event.target.value)}/>
                    </div>

                    <div className="btdiv">
                        <button className="btn btn-warning" type="submit">Submit</button>
                    </div>
                </fieldset>
            </div>
        </form>
    </div>
    );
}
export default Auth;
