import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import '../css/AllPost.css';
import {FaSearch, FaHome, FaRupeeSign, FaBed, FaPhoneAlt} from 'react-icons/fa';

const AllPost = () => {
    const [posts, setPosts] = useState([]);
    const [sortBy, setSortBy] = useState('Address');
    
    useEffect(() =>{
        const fetchPost = async() => {
            await axios.get("http://localhost:8000/allpost")
            .then(res => {
                setPosts(res.data);
                console.log(res.data);
            })
            .catch(err => console.log(err));
        }
        fetchPost();
    },[])

    const handleSearchBy = async(e) => {
        setSortBy(e.target.value);
        console.log(e.target.value);
    }
    const searchKey = React.createRef();
    const handleSearch = async() =>{
        console.log('he');
        // const searchBy = {
        //     searchKey: searchKey.current.value,
        //     sortBy
        // }
        const key = searchKey.current.value;
        // console.log(searchBy);
        await axios.get(`http://localhost:8000/search?searchKey=${key}&sortBy=${sortBy}`)
        .then(res => setPosts(res.data))
        .catch(err => console.log(err));
    }


    return ( 
        <div className='container-fluid allpost'>
            <div className='row'>
                <div className='search col'>
                <select className='filter' onChange={handleSearchBy}>
                    <option value="Address">Location</option>
                    <option value="Rent">Rent</option>
                    <option value="Rooms">Bed Rooms</option>
                </select>
                <input className='search-bar' type="text" placeholder='Search' ref={searchKey} onKeyPress={event => event.key === 'Enter'? handleSearch() : ''}/>
                {/* <button className='search-btn' onClick={handleSearch}>Search</button> */}
                <FaSearch className='search-btn' onClick={handleSearch}/>
                </div>
            </div>
            <div className='post-container'>
                <h1>Rent a <span style={{color: "black"}}>House</span></h1>
                <div className="row posts">
                {posts.map(p => (
                    <div className="card each-post col-lg-4" >
                    <img src={p.imgUrl[0].url} className="card-img-top" alt="..."/>
                    <div className="card-body">
                        <p><span>Location <FaHome/></span> : {p.address}</p>
                        <p><span>Contact Number <FaPhoneAlt/></span> : {p.mobile}</p>
                        <p><span>Rent <FaRupeeSign/></span> : {p.rent}</p>
                        <p><span>Bed Rooms <FaBed/></span> : {p.description}</p>
                        <button className='details-btn' onClick={() => {window.location.href = `/post/${p._id}`}}>View Full Details</button>
                    </div>
                    </div>
                ))}
                </div>
                {/* {posts.map(p => (
                    <div onClick={() => {window.location.href = `/post/${p._id}`}}>
                        {p.imgUrl.map(i => (
                            <img src={i.url} alt="" width={300}/>
                        ))}
                        <p>{p.address}</p>
                        <p>{p.mobile}</p>
                        <p>{p.rent}</p>
                        </div>
                ))} */}
            </div>
        </div>
     );
}
 
export default AllPost;