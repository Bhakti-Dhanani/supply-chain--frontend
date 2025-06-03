import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../apis/auth';
import { login as loginAction } from '../../redux/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const data = await login({ email, password });

      if (data && data.userId && data.access_token && data.role && data.name) {
        // Store token and user in Redux (persisted by redux-persist/sessionStorage)
        dispatch(loginAction({
          user: { id: data.userId, role: data.role, name: data.name, email },
          token: data.access_token,
        }));
        toast.success('Successfully Logged In! Redirecting...');
        switch (data.role) {
          case 'Admin': navigate('/dashboard/admin'); break;
          case 'Vendor': navigate('/dashboard/vendor'); break;
          case 'Transporter': navigate('/dashboard/transporter'); break;
          case 'Manager': navigate('/dashboard/warehouse'); break;
          default:
            setError('Invalid role. Please contact support.');
            toast.error('Invalid role. Please contact support.');
        }
      } else {
        setError('Unexpected server response. Please try again.');
        toast.error('Unexpected server response. Please try again.');
      }
    } catch (err: any) {
      console.error('Login Error:', err);
      if (err.message === 'Unable to fetch data. Please try again later.') {
        setError(err.message);
        toast.error(err.message);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please try again.');
        toast.error('Invalid email or password. Please try again.');
      } else if (err.response?.status === 500) {
        setError('Server error. Please try again later.');
        toast.error('Server error. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again.');
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md mx-auto">
        <div className="relative z-10 border-4 border-[#1E3B3B] rounded-xl overflow-hidden shadow-lg bg-white">
          <ToastContainer position="top-center" autoClose={5000} />
          <div className="bg-[#D6ECE6] shadow-2xl transition-all duration-300">
            {/* Header with accent color */}
            <div className="bg-[#6E8F89] py-4 sm:py-6 px-6 sm:px-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] text-center">
               SupplyChainPro
              </h1>
              <p className="text-[#1E3B3B] text-center mt-1 sm:mt-2 text-xs sm:text-sm">
                Secure access to your shipment dashboard
              </p>
            </div>
            
            <div className="p-6 space-y-4 sm:p-8 sm:space-y-6">
              <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-[#1A1A1A]">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#6E8F89] rounded-lg focus:ring-2 focus:ring-[#6E8F89] focus:border-[#6E8F89] transition-all bg-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A1A]">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-[#6E8F89] rounded-lg focus:ring-2 focus:ring-[#6E8F89] focus:border-[#6E8F89] transition-all bg-white text-sm sm:text-base"
                    required
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#6E8F89] focus:ring-[#6E8F89] border-[#6E8F89] rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-[#1A1A1A]">
                      Remember me
                    </label>
                  </div>
                  
                  <div className="text-xs sm:text-sm">
                    <Link to="/forgot-password" className="font-medium text-[#6E8F89] hover:text-[#1E3B3B]">
                      Forgot password?
                    </Link>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-2 sm:py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6E8F89] transition-colors ${
                    isLoading ? 'bg-[#6E8F89]' : 'bg-[#1E3B3B] hover:bg-[#2A4D4D]'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="w-4 h-4 mr-2 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : 'Sign in'}
                </button>
              </form>
              
              {error && (
                <div className="p-2 sm:p-3 bg-[#EADCD6] text-[#1A1A1A] rounded-lg text-xs sm:text-sm border border-[#EADCD6]">
                  {error}
                </div>
              )}
              
              <div className="text-center text-xs sm:text-sm text-[#1E3B3B]">
                New to our platform?{' '}
                <Link to="/register" className="font-medium text-[#6E8F89] hover:text-[#1E3B3B]">
                  Create an account
                </Link>
              </div>
            </div>
            
            <div className="bg-[#B3D5CF] px-4 sm:px-6 py-3 sm:py-4 border-t border-[#6E8F89]">
              <p className="text-xs text-[#1E3B3B] text-center">
                © {new Date().getFullYear()} CargoShipment Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="fixed inset-0 pointer-events-none select-none opacity-10 -z-10">
          <div className="absolute top-20 left-4 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-[#EADCD6] mix-blend-overlay"></div>
          <div className="absolute bottom-20 right-4 sm:right-20 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-[#B3D5CF] mix-blend-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default Login;