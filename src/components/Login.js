import { Room, Cancel } from '@material-ui/icons';
import axios from "axios"
import React, { useState, useRef } from 'react'
import { LOGIN_URL } from '../config/dev';
import "./login.css";

const Login = ({ setShowLogin, myStorage,setCurrentUser ,setShowRegister}) => {

    const [error, setError] = useState(false)
    const nameRef = useRef()
    const passRef = useRef();


    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: nameRef.current.value,
            password: passRef.current.value,
        }

        try {
            const res = await axios.post(LOGIN_URL, user);
            myStorage.setItem("user", res.data.username)
            setCurrentUser(res.data.username)
            setShowLogin(false)
            setError(false)
        } catch (error) {
            setError(true)
        }
    }

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room style={{ fontSize: "29px" }} /> Login
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={nameRef}></input>
                <input type="password" placeholder="password" ref={passRef}></input>
                <button className="loginBtn">Login</button>
                {error && (
                    <span className="fail">Username or password wrong</span>
                )}

            </form>
            <Cancel className="registerCancel" onClick={() => setShowLogin(false)} />
        </div>
    )
}

export default Login
