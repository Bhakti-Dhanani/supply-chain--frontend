import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';

const useAuth = () => {
  const { users, currentUserId, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const user = currentUserId ? users[currentUserId] : null;
  const navigate = useNavigate();

  const redirectToDashboard = () => {
    if (user) {
      switch (user.role) {
        case 'Admin':
          navigate('/dashboard/admin');
          break;
        case 'Vendor':
          navigate('/dashboard/vendor');
          break;
        case 'Transporter':
          navigate('/dashboard/transporter');
          break;
        case 'WarehouseManager':
          navigate('/dashboard/warehouse');
          break;
        default:
          navigate('/login');
      }
    }
  };

  return { user, isAuthenticated, redirectToDashboard };
};

export default useAuth;