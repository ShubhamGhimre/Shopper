import React, { useState } from 'react'
import './CSS/LoginSignup.css'

const LoginSignup = () => {

  const [state, setState] = useState("Sign Up");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const login = async () => {
    console.log("login", formData)
    let responseData;
    await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) =>{
      responseData = data;
    })
    if(responseData.success){
      localStorage.setItem("authToken", responseData.authToken);  
      window.location.replace("/");
    }else{
      alert(responseData.message);
    }

  }

  const signup = async () => {
    console.log("signup", formData);
    let responseData;
    await fetch("http://localhost:4000/signup", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((response) => response.json()).then((data) =>{
      responseData = data;
    })
    if(responseData.success){
      localStorage.setItem("authToken", responseData.authToken);  
      window.location.replace("/");
    }else{
      alert(responseData.message);
    }

  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state === "Sign Up" ? <input type="text" name="username" value={formData.username} onChange={changeHandler} id="" placeholder='Your Name' /> : <></>}
          <input type="email" placeholder='Email Adderss' name="email" value={formData.email} onChange={changeHandler} id="" />
          <input type="pasword" placeholder='Enter your password' name="password" value={formData.password} onChange={changeHandler} id="" />
        </div>
        <button onClick={() => { state === "login" ? login() : signup() }}>Continue</button>

        {state === "Sign Up" ? <p className='loginsignup-login'>Already have an account? <span onClick={() => { setState("login") }}>Login</span></p> : <></>}

        {state === "login" ? <p className='loginsignup-login'>Create an Account <span onClick={() => { setState("Sign Up") }}>Register</span></p> : <></>}


        <div className='loginsignup-agree'>
          <input type="checkbox" name='' id='' />
          <p>By contuning, i aggre to the terms of use and privacy</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignup