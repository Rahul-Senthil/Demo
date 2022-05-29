import React from 'react';
import { useEffect , useState } from 'react';
import '../css/Home.css';
import jwtDecode from 'jwt-decode';
import banner from '../images/jacques-bopp-Hh18POSx5qk-unsplash.jpg';

const Home = () => {

    const[user, setUser] = useState();
    useEffect(() => {
        const fetchToken = () => {
            const token = sessionStorage.getItem("secretToken");
            console.log(token);
            if(token)
            {
                const user = jwtDecode(token);
                console.log(user.currentUser);
                setUser(user.currentUser);
            }
        }
        fetchToken();
    },[])

    const handleNavigate = () => {
        if(user)
        {
            window.location.href = `/account/${user}`;
        }
        else
        {
            window.location.href = '/login';
        }
    }


  return (
    <div className='container-fluid'>
        <div className="banner row">
        <div className='col-lg-6 col-md-4 col-sm-12 banner-left'>
            <div className="banner-description">
            <h1><span style={{color: "rgb(236, 89, 138)"}}>Rent a house</span> from the most genuine owners </h1>
            <h1>&</h1> 
            <h1><span style={{color: "rgb(236, 89, 138)"}}>Lease your house</span> to the needy!!</h1>
            </div>

            <div className="banner-buttons">
                <button onClick={() => {window.location.href='/posts'}}>Rent Houses</button>
                <button onClick={handleNavigate}>Lease Houses</button>
            </div>
        </div>

        <div className='col-lg-6 col-md-8 col-sm-12 banner-right'>
        <img className='img-fluid' src={banner} alt="" width="100%"/>
        </div>
        </div>
    </div>
  )
}

export default Home
