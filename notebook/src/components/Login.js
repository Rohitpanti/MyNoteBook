import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/login.css'

const Login = (props) => {
    const [credentials, setCredentials] = useState({email:"", password:""})
    let navigate =useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',

            },
            body: JSON.stringify({email:credentials.email,password:credentials.password})
        });
        const json = await response.json();
        console.log(json);
        if (json.success){
            //Save The auth token and redirect
            localStorage.setItem('token',json.authtoken);
            props.showAlert("Logged in To Your Account Successfully","success");
            navigate("/");

        }
        else{
            props.showAlert("Invalid Creadentials","danger");
        }
    }

    const onChange = (e)=>{
        setCredentials({...credentials,[e.target.name]:e.target.value})
    };

    return (
        <div className='mt-3 login'>
            <h2 className='title'>Login to your NoteBook|</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.eamil} id="email" onChange={onChange} name='email' aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} id="password" onChange={onChange} name='password' />
                </div>
                <button type="submit" className="btn btn-dark" >Log In</button>
            </form>
        </div>
    )
}

export default Login