import axios from 'axios';
import React, { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode';
import { useParams } from 'react-router-dom';
import {Carousel} from 'react-bootstrap';
import {FaHome, FaRupeeSign, FaMobile, FaBed, FaPlusCircle} from 'react-icons/fa';
import '../css/Account.css';

const Account = () => {

  const {id} = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async() => {
            if(id)
            {
              await axios.get(`http://localhost:8000/mypost/${id}`)
              .then(res => {
                setPosts(res.data);
                console.log(res.data);
              })
            }
            else{
              window.location.href = '/home';
            }
    }
    fetchPosts();
  },[])

  const deletePost = async(postId) => {
    await axios.delete(`http://localhost:8000/delete-post/${postId}`)
    .then(res => window.location.href = `/account/${id}`)
    .catch(err => console.log(err))
  }

  return (
    <div className='account-container'>
      <h1>My <span style={{color: "black"}} >Account</span></h1>
      <h3 style={{textAlign: "center"}} ><a href={`/account/${id}/new-post`}>Add New Post <FaPlusCircle/></a></h3>
      <hr />
      <div className="container-fluid account-details">
        <h1>Your <span style={{color: "black"}}>Posts</span></h1>
        <div className="row mypost">
        {posts.map(p => (
          <div className="card display-post col-5">
            <Carousel>
            {p.imgUrl.map(i => (
                  <Carousel.Item className='account-carousel-item'>
                    <img src={i.url} alt="..." className='carousel-img' />
                  </Carousel.Item>
                ))}
            </Carousel>
            <div className="card-body">
              <p><span>Location <FaHome/></span> : {p.address}</p>
              <p><span>Contact Number <FaMobile/></span> : {p.mobile}</p>
              <p><span>Rent <FaRupeeSign/></span> : {p.rent}</p>
              <p><span>Bed Rooms <FaBed/></span> : {p.description}</p>
              <button className='details-btn' onClick={() => {window.location.href = `/account/${p._id}/edit-post`}}>Edit</button><br />
              <button className='details-btn' onClick={() => deletePost(p._id)}>Delete</button>
            </div>
          </div>
        ))}
        </div>
      
    </div>
    </div>
  )
}

export default Account;