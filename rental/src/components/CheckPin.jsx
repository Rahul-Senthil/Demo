import axios from 'axios';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

const CheckPin = () => {
  const {state} = useLocation();
  console.log(state);
  const [userCredentials, setUserCredentials] = useState(state);
  const [customError, setCustomError] = useState();
  
  const checkCode = React.createRef();

  console.log(userCredentials.sixDigitCode);

  const handleRegister = async() => {
    if(checkCode.current.value == userCredentials.sixDigitCode)
    {
        await axios.post("http://localhost:8000/auth/register", userCredentials)
        .then(res => {
          console.log(res.data);
          const jwt = res.data.token;
          sessionStorage.setItem("secretToken", jwt);
          window.location.href = '/home';
        })
        .catch(err => console.log(err));
    }
    else{
        setCustomError("Wrong Pin")
    }
  }
  return (
    <div style={{backgroundColor: "#e8e8e8" , height: "690px"}}>
      <h3 style={{textAlign: "center", fontFamily: "'Poppins', sans-serif", fontWeight: "bold"}}>Enter the 6 Digit Code</h3>
      <div style={{display:"flex", justifyContent: "center", alignItems: "center"}}>
      {/* <h1>{userCredentials.sixDigitCode}</h1> */}
      <div>
      <input type="text" placeholder='6 Digit Code' ref={checkCode} required style={{width: "200px", height: "40px", border: "1px solid rgb(236, 89, 138)", outline: "none", borderRadius: "8px", paddingLeft: "10px", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", marginTop: "20px"}}/><br /><br />
      {customError? <p style={{color: "red", fontFamily: "'Poppins', sans-serif", fontWeight: "bold" }}>{customError}</p> : ''}
      <button onClick={handleRegister} style={{width: "200px", height: "40px", border: "none", outline: "none", backgroundColor: "rgb(236, 89, 138)", fontFamily: "'Poppins', sans-serif", fontWeight: "bold", borderRadius: "8px"}}>Confirm</button>
      </div>
    </div>
    </div>
  )
}

export default CheckPin
