import axios from 'axios';
import jwtDecode from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaFileUpload } from 'react-icons/fa';
import '../css/EditPost.css';

const EditPost = () => {

    const {id} = useParams();
    const [post, setPost] = useState([]);
    const [user, setUser] = useState();
    const [files, setFiles] = useState([]);
    const [img, setImg] = useState([]);
    const updatedImg = useState([]);
    const doDeleteImg = useState([]);
    const [customError, setCustomError] = useState();

    const address = React.createRef();
    const mobile = React.createRef();
    const rent = React.createRef();
    const description = React.createRef();

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
            else{
                window.location.href = '/home';
            }
            await axios.get(`http://localhost:8000/specific-post/${id}`)
            .then(res => {
                setPost(res.data);
                setImg(res.data.imgUrl);
            })
            .catch(err => console.log(err));
        }
        fetchPost()
    },[])

    const onFileUpload = (e) => {
        setFiles(e.target.files);
        if(e.target.files.length>1)
        {
            document.getElementById("filename").innerHTML = e.target.files.length + " files selected";
        }
        else{
            document.getElementById("filename").innerHTML = e.target.files.length + " file selected";
        }
    }

    const validation = (addressValue, mobileValue, rentValue, descriptionValue, updatedImgLength) => {
        const mobilePattern = '[6789][0-9]{9}';
        const rentPattern = '^[1-9]+[0-9]*$';
        console.log(files.length+updatedImgLength);
        let c=0;
        if(files.length>0){
        for(let i=0;i<files.length;i++)
        {
            if(files[i].type.split("/")[1] !== 'jpeg' && files[i].type.split("/")[1] !== 'jpg' && files[i].type.split("/")[1] !== 'png')
            {
                setCustomError("*Only Image can be uploaded");
                console.log(files[i].type.split("/")[1]);
                c++;
                return false;
            }
        }
        }
        if(c==0){
        if(files.length+updatedImg == 0)
        {
            setCustomError("*Atleat 1 image is required");
            return false;
        }
        if(files.length+updatedImgLength>4)
        {
            setCustomError("*Only 4 Images can be uploaded");
            return false;
        }
        if(!addressValue)
        {
            setCustomError("*Address is required");
            return false;
        }
        else if(addressValue.length<10)
        {
            setCustomError("*Address should be more than 10 characters");
            return false;
        }
        else if(!mobileValue)
        {
            setCustomError("*Mobile Number is required");
            return false;
        }
        else if(!mobileValue.match(mobilePattern) || mobile.current.value.length != 10)
        {
            setCustomError("*Mobile Number should be 10 digits");
            return false;
        }
        else if(!rentValue)
        {
            setCustomError("*Rent is required");
            return false;
        }
        else if(!rentValue.match(rentPattern))
        {
            setCustomError("*Rent should not be negative");
            return false;
        }
        else if(!descriptionValue)
        {
            setCustomError("*Description is Required");
            return false;
        }
        else{
            setCustomError(" ")
            return true;
        }
    }
    }
    const editPost = async(e) => {
        e.preventDefault();
        const addressValue = address.current.value;
        const mobileValue = mobile.current.value;
        const rentValue = rent.current.value;
        const descriptionValue = description.current.value;
        console.log("Clicked");
        updatedImg.length = 0;
        doDeleteImg.length = 0;
        const imgs = document.getElementsByName("deleteImg");
        for(let i=0;i<img.length;i++)
        {
            console.log(imgs[i].checked);
            if(imgs[i].checked !== true)
            {
                console.log(img[i]);
                updatedImg.push(img[i]);
            }
            else
            {
                doDeleteImg.push(img[i]);
            }
        }
        console.log(doDeleteImg);
        console.log(updatedImg);
        let isValidated = validation(addressValue, mobileValue, rentValue, descriptionValue, updatedImg.length);
        if(isValidated)
        {
            document.getElementById("btn").value = "Saving...";
            if(files.length>0)
            {
                const formData = new FormData();
                for(let i=0;i<files.length;i++)
                {
                    formData.append("image", files[i]);
                }
                const config = {
                    headers: {
                        'content-type' : 'multipart/form-data'
                    }
                }
                await axios.post("http://localhost:8000/generate-url", formData, config)
                .then(res => {
                    console.log(res.data);
                    for(let i=0;i<res.data.length;i++)
                    {
                        updatedImg.push({
                            filename: res.data[i].filename,
                            url: res.data[i].path
                        });
                    }
                })
                .catch(err => console.log(err));
            }
            const newPost = {
                author_id: user,
                address: addressValue,
                mobile: mobileValue,
                rent: rentValue,
                description: descriptionValue,
                imgUrl: updatedImg,
                date: new Date()
            }
            console.log(newPost);

            if(doDeleteImg.length>0)
            {
                // FIXME: delete from cloudinary
                // axios.post('http://localhost:8000/delete-img-cloudinary', doDeleteImg)
                // .then(res => {
                    // console.log(res);
                    axios.post(`http://localhost:8000/edit-post/${id}`, newPost)
                    .then(res => {
                        console.log(res.data);
                        window.location.href = `/account/${user}`;
                    })
                    .catch(err => console.log(err));
            }
            else
            {
                axios.post(`http://localhost:8000/edit-post/${id}`, newPost)
                .then(res => {
                    if(typeof(res.data) == 'object')
                    {
                        console.log(res.data);
                        setCustomError(res.data.error);
                    }
                    else
                    {
                        window.location.href = `/account/${user}`;
                    }
                })
                .catch(err => console.log(err));
            }
        }
    }

  return (
    <div className='edit-form-page'>
      <h1>Edit <span style={{color: "black"}}>Post</span></h1>
      <div className="edit-form-container">
      <div className='edit-post-form'>
        <form action="" onSubmit={editPost}>
        <label for="uploadfile" className='upload-label'>Select Image from device <FaFileUpload/>   <span style={{color: "red"}} id="filename">0 file selected</span></label>
        <input type="file" name="image" accept='image/*' id="uploadfile" onChange={onFileUpload} multiple/><br /><br />
        <input type="text" placeholder='Address' defaultValue={post.address} ref={address}/><br /><br />
        <input type="text" placeholder='Mobile Number' defaultValue={post.mobile} ref={mobile}/><br /><br />
        <input type="text" placeholder='Rent' defaultValue={post.rent} ref={rent}/><br /><br />
        <select name="" id="" ref={description}>
            <option defaultValue={post.description}>{post.description}</option>
            <option value="1 Bedroom">1 Bed Room</option>
            <option value="2 Bedroom">2 Bed Room</option>
            <option value="3 Bedroom">3 Bed Room</option>
            <option value="4 Bedroom">4 Bed Room</option>
        </select><br /><br />
        {img.map((i) => (
            <div className='del-img'>
                <div>
                <img src={i.url} alt="" width={300}/><br/>
                <input type="checkbox" name="deleteImg" id=""/>
                <p>Click the checkbox to delete the image</p>
                </div>
            </div>
        ))}
        {customError? <p style={{color: 'red'}}>{customError}</p>: ''}
        <input type="submit" value="Edit Post" id='btn' style={{backgroundColor: "rgb(236, 89, 138)", border: "none"}}/>
      </form>
      </div>
      </div>
    </div>
  )
}

export default EditPost
