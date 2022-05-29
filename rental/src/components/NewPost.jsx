import React, { useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import jwtDecode from 'jwt-decode';
import '../css/NewPost.css';
import {FaFileUpload} from 'react-icons/fa'

const NewPost = () => {
    const address = React.createRef();
    const mobile = React.createRef();
    const rent = React.createRef();
    const description = React.createRef();

    const[user, setUser] = useState();
    const [files, setFiles] = useState([]);
    const [imageLink, setImageLink] = useState([]);
    const [customError, setCustomError] = useState();

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
            else{
                window.location.href = '/home';
            }
        }
        fetchToken();
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

    const validation = (addressValue, mobileValue, rentValue, descriptionValue) => {
        const mobilePattern = '[6789][0-9]{9}';
        const rentPattern = '^[1-9]+[0-9]*$';
        let c=0;
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
        if(c==0){
        if(!files.length)
        {
            setCustomError("*Image is required");
            return false;
        }
        else if(files.length>4)
        {
            setCustomError("*Only 4 Images can be uploaded");
            return false;
        }
        else if(!addressValue)
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
            setCustomError("*Enter a valid Mobile Number");
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
    
    const addPost = async(e) => {
        e.preventDefault();
        const addressValue = address.current.value;
        const mobileValue = mobile.current.value;
        const rentValue = rent.current.value;
        const descriptionValue = description.current.value;
        console.log("Clicked");
        let isValidated = validation(addressValue, mobileValue, rentValue, descriptionValue);
        console.log(isValidated);
        if(isValidated)
        {
            document.getElementById("btn").value = "Saving...";
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
                imageLink.length = 0;
                for(let i=0;i<res.data.length;i++)
                {
                    imageLink.push({
                        filename: res.data[i].filename,
                        url: res.data[i].path
                    });
                }
                
                console.log(addressValue);
                const newPost = {
                    author_id: user,
                    address: addressValue,
                    mobile: mobileValue,
                    rent: rentValue,
                    description: descriptionValue,
                    imgUrl: imageLink,
                    date: new Date()
                }
                console.log(newPost);
            
                axios.post("http://localhost:8000/new-post", newPost)
                .then(res => {
                        if(typeof(res.data) == 'object')
                        {
                            console.log(res.data);
                            setCustomError(res.data.error);
                        }
                        else{
                            window.location.href = `/account/${user}`;
                        }
                    })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        }
    }
    
    return ( 
            <div className='form-page'>
            <h1>Add <span style={{color: "black"}}>Post</span></h1>
            <div className='form-container'>
            <div className='post-form'>
            <form action="" onSubmit={addPost}>
            <label for="uploadfile" className='upload-label'>Select Image from device <FaFileUpload/>   <span style={{color: "red"}} id="filename">0 file selected</span></label>
            <input type="file" name="image" accept='image/*' id="uploadfile" onChange={onFileUpload} multiple />
            <br /><br />
            <input type="text" placeholder='Address' ref={address} /><br /><br />
            <input type="text" name="" id="" placeholder='Mobile Number' ref={mobile} /><br /><br />
            <input type="text" placeholder='Rent' ref={rent} /><br /><br />
            <select name="" id="" ref={description}>
                <option value="1 Bedroom">1 Bed Room</option>
                <option value="2 Bedroom">2 Bed Room</option>
                <option value="3 Bedroom">3 Bed Room</option>
                <option value="4 Bedroom">4 Bed Room</option>
            </select><br /><br />
            {customError? <p style={{color: "red"}}>{customError}</p>:''}
            <input type="submit" value="Add Post" id="btn" style={{backgroundColor: "rgb(236, 89, 138)", border: "none"}}/>
            </form>
            <br /><br />
        </div>
        </div>
        <h6 style={{textAlign: "center"}}><a href={`/account/${user}`}>Back to Account Page</a></h6>
        </div> 
        ) 
     
}
 
export default NewPost;