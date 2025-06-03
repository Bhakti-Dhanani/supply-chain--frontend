import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout as logoutAction } from '../../redux/slices/authSlice';
import type { RootState } from '../../redux/store';

const Logout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUserId = useSelector((state: RootState) => state.auth.currentUserId);

  const handleLogout = () => {
    if (currentUserId) {
      dispatch(logoutAction(currentUserId));
      navigate('/login');
    }
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
