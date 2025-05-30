import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as logoutAction } from '../../redux/slices/authSlice';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 w-full px-4 py-2 text-[#1E3B3B] hover:bg-[#B3D5CF] transition-colors"
    >
      <span>Logout</span>
    </button>
  );
};

export default Logout;
