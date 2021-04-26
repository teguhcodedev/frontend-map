import { Room, Cancel } from '@material-ui/icons';
import axios from "axios"
import React, { useState, useRef } from 'react'
import "./register.css";

const Register = ({ setShowRegister,setShowLogin }) => {
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState(false)
    const nameRef = useRef()
    const emailRef = useRef()
    const passRef = useRef();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passRef.current.value,
        }

        try {
            const res = await axios.post("http://localhost:9898/api/user/register", newUser);
            setError(false)
            setShowLogin(false)
        } catch (error) {
            setError(true)
        }
    }


    return (
        <div className="registerContainer">
            <div className="logo">
                <Room style={{ fontSize: "29px" }} />  Register
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef}></input>
                <input type="email" placeholder="email" ref={emailRef}></input>
                <input type="password" placeholder="password" ref={passRef}></input>
                <button className="registerBtn">Register</button>
                {success && (
                    <span className="success">Success full you can login now</span>
                )}
                {error && (
                    <span className="fail">Username hs already registered</span>
                )}

            </form>
            <Cancel className="registerCancel" onClick={() => setShowRegister(false)} />
        </div>
    )
}

export default Register
