import * as React from 'react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authUser } from '../redux/userHandle';
import Popup from '../components/Popup';
import '../index.css';

const AuthenticationPage = ({ mode, role }) => {

    const bgpic = "https://img.freepik.com/free-photo/3d-rendering-cartoon-shopping-cart_23-2151680623.jpg?t=st=1740213618~exp=1740217218~hmac=db41624a6512f685d032d5c6ffd09d0d956e089793703f7a31ab759990f2c5f8&w=1380"

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { status, currentUser, response, error, currentRole } = useSelector(state => state.user);

    const [toggle, setToggle] = useState(false)
    const [loader, setLoader] = useState(false)
    const [showPopup, setShowPopup] = useState(false);
    const [message, setMessage] = useState("");

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [userNameError, setUserNameError] = useState(false);
    const [shopNameError, setShopNameError] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        const email = event.target.email.value;
        const password = event.target.password.value;

        if (!email || !password) {
            if (!email) setEmailError(true);
            if (!password) setPasswordError(true);
            return;
        }

        if (mode === "Register") {
            const name = event.target.userName.value;

            if (!name) {
                setUserNameError(true);
                return;
            }

            if (role === "Seller") {
                const shopName = event.target.shopName.value;
                if (!shopName) {
                    setShopNameError(true);
                    return;
                }
                dispatch(authUser({ name, email, password, role, shopName }, role, mode));
            } else {
                dispatch(authUser({ name, email, password, role }, role, mode));
            }
        } else {
            dispatch(authUser({ email, password }, role, mode));
        }
        setLoader(true);
    };

    const handleInputChange = (event) => {
        const { name } = event.target;
        if (name === 'email') setEmailError(false);
        if (name === 'password') setPasswordError(false);
        if (name === 'userName') setUserNameError(false);
        if (name === 'shopName') setShopNameError(false);
    };

    useEffect(() => {
        if (status === 'success' && currentRole !== null) {
            navigate('/');
        } else if (status === 'failed' || status === 'error') {
            setMessage(status === 'failed' ? response : "Network Error");
            setShowPopup(true);
            setLoader(false);
        }
    }, [status, currentUser, currentRole, navigate, error, response]);

    return (
        <>
            <div className="auth-container">
                <div className="auth-box">
                    <h2 className="auth-title">{role} {mode}</h2>
                    {role === "Seller" && mode === "Register" && <p className="auth-info">Create your own shop by registering as a seller.</p>}
                    {role === "Customer" && mode === "Register" && <p className="auth-info">Register now to explore and buy products.</p>}
                    {mode === "Login" && <p className="auth-info">Welcome back! Please enter your details</p>}
                    <form className="auth-form" onSubmit={handleSubmit}>
                        {mode === "Register" && <input className="auth-input" type="text" name="userName" placeholder="Enter your name" onChange={handleInputChange} />}
                        {mode === "Register" && role === "Seller" && <input className="auth-input" type="text" name="shopName" placeholder="Create your shop name" onChange={handleInputChange} />}
                        <input className="auth-input" type="email" name="email" placeholder="Enter your email" onChange={handleInputChange} />
                        <input className="auth-input" type={toggle ? "text" : "password"} name="password" placeholder="Password" onChange={handleInputChange} />
                        <button className="auth-button" type="submit">{loader ? "Loading..." : mode}</button>
                    </form>
                    <p className="auth-switch">
                        {mode === "Register" ? "Already have an account?" : "Don't have an account?"} 
                        <Link className="auth-link" to={`/${role}${mode === "Register" ? "login" : "register"}`}>{mode === "Register" ? "Log in" : "Sign up"}</Link>
                    </p>
                </div>
                <div className="auth-bg" style={{ backgroundImage: `url(${bgpic})` }}></div>
            </div>
            <Popup message={message} setShowPopup={setShowPopup} showPopup={showPopup} />
        </>
    );
}

export default AuthenticationPage;
