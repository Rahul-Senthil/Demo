import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import '../css/Post.css';
import {Carousel} from 'react-bootstrap';
import {FaHome, FaRupeeSign, FaPhoneAlt, FaBed} from 'react-icons/fa';
const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState([]);
  const [user, setUser] = useState();
  const [img, setImg] = useState([]);

  useEffect(() => {
    const fetchPost= async() => {
    console.log("Post id: ", id);
    const token = sessionStorage.getItem("secretToken");
    console.log(token);
    if(token)
    {
        const user = jwtDecode(token);
        console.log("user id: ", user.currentUser);
        setUser(user.currentUser);
    }
    await axios.get(`http://localhost:8000/specific-post/${id}`)
    .then(res => {
        setPost(res.data);
        setImg(res.data.imgUrl)
        console.log(res.data);
    }
    )
    .catch(err => console.log(err));
}
fetchPost()
},[])

const deletePost = async(id) => {
  await axios.delete(`http://localhost:8000/delete-post/${id}`)
  .then(res => window.location.href = `/account/${user}`)
  .catch(err => console.log(err))
}

  return (
    <div className="container-fluid post-details">
      <div className="row">
        <div className="col-7">
          <Carousel>
          {img.map(i => (
                <Carousel.Item className='carousel-item'>
                  <img src={i.url} alt="..." className='carousel-img' />
                </Carousel.Item>
              ))}
          </Carousel>
        </div>
        <div className='col-5 details'> 
            <h1>Details</h1>
            <p><span>Location <FaHome/></span> : {post.address}</p>
            <p><span>Contact Number <FaPhoneAlt/></span> : {post.mobile}</p>
            <p><span>Rent <FaRupeeSign/></span> : {post.rent}</p>
            <p><span>Bed Rooms <FaBed/></span> : {post.description}</p>
            {post.author_id === user? 
              <div>
                <button onClick={() => {window.location.href = `/account/${id}/edit-post`}}>Edit</button><br />
                <button onClick={() => deletePost(post._id)}>Delete</button>
              </div>: ''}
        </div>
      </div>
    </div>
  )
}

export default Post
