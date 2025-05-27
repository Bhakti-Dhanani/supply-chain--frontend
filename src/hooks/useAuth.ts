import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState } from '../redux/store';

const useAuth = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
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