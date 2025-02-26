import React from 'react';
import { useSelector } from 'react-redux';
import ShippingPage from '../components/ShippingPage';


const Profile = () => {
  const { currentUser } = useSelector(state => state.user);

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {currentUser ? currentUser.name[0].toUpperCase() : ''}
          </div>
          <h2 className="profile-name">{currentUser ? currentUser.name : ''}</h2>
          <p className="profile-text">Email: {currentUser ? currentUser.email : ''}</p>
          <p className="profile-text">Role: {currentUser ? currentUser.role : ''}</p>
        </div>
      </div>
      <div className="container">
        <div className="profile-header">
          <ShippingPage profile="Profile" />
        </div>
      </div>
    </>
  );
};

export default Profile;
