import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { NavLink } from 'react-bootstrap';
import '../css/Navbar.css';
import { FaHamburger } from 'react-icons/fa';
 
const Navbar = () => {

    const [user, setUser] = useState({});

    useEffect(() => {
        const fetchToken = () => {
            const token = sessionStorage.getItem("secretToken");
            console.log(token);
            if(token)
            {
                const user = jwtDecode(token);
                setUser({user_id: user.currentUser, username: user.username});
            }
        }
        fetchToken();
    },[])

    const handleLogout = () => {
        sessionStorage.removeItem("secretToken");
    }
    return ( 
        <div>
        <nav class="navbar navbar-expand-lg">
        <div class="container-fluid">
            <a class="navbar-brand" href="#">Rently</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <FaHamburger className='hamburger'/>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav">
                <li class="nav-item">
                <NavLink class="nav-link" aria-current="page" href="/home">Home</NavLink>
                </li>
                <li class="nav-item">
                <NavLink class="nav-link" aria-current="page" href="/posts">Post</NavLink>
                </li>
                {user.username?
                <li class="nav-item">
                <NavLink class="nav-link" href={`/account/${user.user_id}`}>{user.username}</NavLink>
                </li>:''}
                {user.username?
                <li class="nav-item">
                <NavLink class="nav-link" href='/'><span onClick={handleLogout}>Logout</span></NavLink>
                </li>:
                <li class="nav-item">
                <NavLink class="nav-link" href="/login">Login</NavLink>
                </li>}
            </ul>
            </div>
        </div>
        </nav>
        {/* <div>
            <ul>
                <li><a href="/">Home</a></li>
                { user.username? 
                <div>
                <li><a href={`/account/${user.user_id}`}>{user.username}</a></li> 
                <li><a href="/"><span onClick={handleLogout}>Logout</span></a></li>
                </div> :
                <li><a href="/login">Login</a></li> }
            </ul>
        </div> */}
        </div>
     );
}
 
export default Navbar;