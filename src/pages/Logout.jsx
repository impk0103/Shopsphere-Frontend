import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '../redux/userSlice';
import { updateCustomer } from '../redux/userHandle';


const Logout = () => {
  const { currentUser, currentRole } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //  useEffect(() => {
  //   if (currentRole === "Customer") {
  //     dispatch(updateCustomer(currentUser, currentUser.id));
  //   }
  // }, [currentRole, currentUser, dispatch]);

  const handleLogout = () => {
    dispatch(authLogout());
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="logout-container">
      <h1>{currentUser?.name}</h1>
      <p className="logout-message">Are you sure you want to log out?</p>
      <button className="logout-button logout-button-logout" onClick={handleLogout}>Log Out</button>
      <button className="logout-button logout-button-cancel" onClick={handleCancel}>Cancel</button>
    </div>
  );
};

export default Logout;
