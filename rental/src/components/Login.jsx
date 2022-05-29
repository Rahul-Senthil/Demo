import axios from 'axios';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import '../css/Login.css';

const Login = () => {

  const [customError, setCustomError] = useState();
  const [loginCustomError, setLoginCustomError] = useState();
  const history = useHistory();
  const registerUsername = React.createRef();
  const registerMail = React.createRef();
  const registerPassword = React.createRef();

  const loginMail = React.createRef();
  const loginPassword = React.createRef();

  const handleRegister = async() => {
    const registerCredentials = {
        email_id: registerMail.current.value.trim(),
        username: registerUsername.current.value.trim(),
        password: registerPassword.current.value
    }

    await axios.post("http://localhost:8000/auth/validateRegister", registerCredentials)
    .then(async(res) => {
      if(typeof(res.data) == 'string'){
        console.log(res.data);
        setCustomError(res.data);
      }
      else{
        console.log(res.data);
        await axios.post("http://localhost:8000/auth/register", registerCredentials)
        .then(res => {
              console.log(res.data);
              const jwt = res.data.token;
              sessionStorage.setItem("secretToken", jwt);
              window.location.href = '/home';
        })
        .catch(err => console.log(err));
    }
    })
    .catch(err => console.log(err));

    // await axios.post("http://localhost:8000/auth/register", registerCredentials)
    // .then(res => {
    //   console.log(res.data);
    //   const jwt = res.data.token;
    //   sessionStorage.setItem("secretToken", jwt);
    //   window.location.href = '/posts';
    // })
    // .catch(err => console.log(err));
  }

  const handleLogin = async() => {
    const loginCredentials = {
        email_id: loginMail.current.value,
        password: loginPassword.current.value
    }
    await axios.post("http://localhost:8000/auth/login", loginCredentials)
    .then(res => {
      console.log(res.data);
      const jwt = res.data.token;
      if(jwt !== undefined)
      {
        sessionStorage.setItem("secretToken", jwt);
        window.location.href = '/home';
      }
      else{
        console.log(res.data);
        setLoginCustomError(res.data);
      }
    })
    .catch(err => console.log(err));
  }

  return (
    <div className='login-page'>
      <div className="login">
      <h1 style={{color: "black"}}>Login</h1>
      <div className='form-container'>
      <div className='login-form'>
      <div>
      <input type="text" placeholder='Email' ref={loginMail}/><br /><br />
      <input type="password" placeholder='Password' ref={loginPassword}/><br /><br />
      {loginCustomError ? <p style={{color: "red"}}>{loginCustomError}</p>: ''}
      <button style={{backgroundColor: "rgb(236, 89, 138)", border: "none", marginTop: "30px"}} onClick={handleLogin}>Login</button>
      </div>
      </div>
      </div>
      </div>

      <div className="register">
      <h1 style={{color: "black"}}>Register</h1>
      <div className='form-container'>
      <div className='register-form'>
      <div>
      <input type="text" placeholder='Email' ref={registerMail} required/><br /><br />
      <input type="text" placeholder='Username' ref={registerUsername} required/><br /><br />
      <input type="password" placeholder='Password' ref={registerPassword} required/><br /><br />
      {customError? 
      <p style={{color: "red"}}>{customError}</p>:''}
      <button style={{backgroundColor: "rgb(236, 89, 138)", border: "none", marginTop: "30px"}} onClick={handleRegister}>Register</button>
      </div>
      </div>
      </div>
      </div>
    </div>
  )
}

export default Login;
