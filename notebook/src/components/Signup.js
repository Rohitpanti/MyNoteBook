import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/signup.css'

const Signup = (props) => {
    const [credentials, setCredentials] = useState({name:"", email:"", password:"", cpassword:""})
    let navigate =useNavigate();

    const handleSubmit = async (e) => {
        if (credentials.password !== credentials.cpassword) {
            return props.showAlert("Your password does not match", "warning");
        }
        e.preventDefault();
        const{name,email,password}=credentials;
        const response = await fetch("http://localhost:5000/api/auth/createUser", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({name: credentials.name ,email : credentials.email, password : credentials.password})
        });
        const json = await response.json(name,email,password);
        console.log(json);
        if (json.success){
            //Save The auth token and redirect
            localStorage.setItem('token',json.authtoken);
            navigate("/");
            props.showAlert("Created Your Accont  Successfully","success");
        }
        else{
            props.showAlert("Invalid Detials","danger");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    };

    return (
        <div className='container mt-3 signUp'>
            <h2 className='title'>Sign Up |</h2>
            <form  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name='name' onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" name='password' onChange={onChange} minLength={5} required/>
                </div>
                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" id="cpassword" name='cpassword' onChange={onChange} minLength={5} required/>
                </div>
                <button type="submit" className="btn btn-primary">Create Acc</button>
            </form>
        </div>
    )
}

export default Signup