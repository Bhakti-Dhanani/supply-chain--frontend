import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../apis/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole: string) => {
    setRole(selectedRole);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register({ ...formData, role });
      toast.success('Successfully Registered! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
      toast.error('Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4 sm:p-6">
      {/* Decorative elements */}
      <div className="fixed inset-0 pointer-events-none opacity-10 -z-10">
        <div className="absolute top-20 left-4 sm:left-20 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-[#EADCD6] mix-blend-overlay"></div>
        <div className="absolute bottom-20 right-4 sm:right-20 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-[#B3D5CF] mix-blend-overlay"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="relative z-10 border-4 border-[#1E3B3B] rounded-xl overflow-hidden bg-white shadow-lg">
          <ToastContainer position="top-center" autoClose={5000} />

          <div className="bg-[#D6ECE6] shadow-2xl transition-all duration-300">
            {/* Header with accent color */}
            <div className="bg-[#6E8F89] py-4 sm:py-6 px-6 sm:px-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A] text-center">
                SupplyChainPro
              </h1>
              <p className="text-[#1E3B3B] text-center mt-1 sm:mt-2 text-xs sm:text-sm">
                Create your account
              </p>
            </div>

            <div className="p-5 space-y-4 sm:p-6 sm:space-y-5">
              {!role ? (
                <div className="space-y-3 sm:space-y-4">
                  <h2 className="text-base sm:text-lg font-medium text-center text-[#1A1A1A]">
                    Select Your Role
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <button
                      onClick={() => handleRoleSelection('Admin')}
                      className="px-3 sm:px-4 py-2 sm:py-3 border border-[#6E8F89] rounded-lg hover:bg-[#6E8F89] hover:text-white transition-all bg-white text-[#1A1A1A] text-sm sm:text-base"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium">Admin</span>
                        <span className="mt-1 text-xs">System Management</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleSelection('Vendor')}
                      className="px-3 sm:px-4 py-2 sm:py-3 border border-[#6E8F89] rounded-lg hover:bg-[#6E8F89] hover:text-white transition-all bg-white text-[#1A1A1A] text-sm sm:text-base"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium">Vendor</span>
                        <span className="mt-1 text-xs">Product Supplier</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleSelection('Transporter')}
                      className="px-3 sm:px-4 py-2 sm:py-3 border border-[#6E8F89] rounded-lg hover:bg-[#6E8F89] hover:text-white transition-all bg-white text-[#1A1A1A] text-sm sm:text-base"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium">Transporter</span>
                        <span className="mt-1 text-xs">Shipment Delivery</span>
                      </div>
                    </button>
                    <button
                      onClick={() => handleRoleSelection('WarehouseManager')}
                      className="px-3 sm:px-4 py-2 sm:py-3 border border-[#6E8F89] rounded-lg hover:bg-[#6E8F89] hover:text-white transition-all bg-white text-[#1A1A1A] text-sm sm:text-base"
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-medium">Warehouse</span>
                        <span className="mt-1 text-xs">Inventory Management</span>
                      </div>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2 sm:mb-3">
                    <h2 className="text-base sm:text-lg font-medium text-[#1A1A1A]">
                      Register as <span className="text-[#1E3B3B] capitalize">{role.toLowerCase().replace('manager', '')}</span>
                    </h2>
                    <button 
                      onClick={() => setRole('')}
                      className="text-xs sm:text-sm text-[#6E8F89] hover:text-[#1E3B3B]"
                    >
                      Change role
                    </button>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-[#6E8F89] rounded-lg focus:ring-2 focus:ring-[#6E8F89] focus:border-[#6E8F89] transition-all bg-white text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-[#6E8F89] rounded-lg focus:ring-2 focus:ring-[#6E8F89] focus:border-[#6E8F89] transition-all bg-white text-sm sm:text-base"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                        Password
                      </label>
                      <input
                        id="password"
                        type="password"
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-[#6E8F89] rounded-lg focus:ring-2 focus:ring-[#6E8F89] focus:border-[#6E8F89] transition-all bg-white text-sm sm:text-base"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6E8F89] transition-colors bg-[#1E3B3B] hover:bg-[#2A4D4D] text-sm sm:text-base"
                    >
                      Register
                    </button>
                  </form>
                </>
              )}

              {error && (
                <div className="p-2 sm:p-3 bg-[#EADCD6] text-[#1A1A1A] rounded-lg text-xs sm:text-sm border border-[#EADCD6]">
                  {error}
                </div>
              )}

              <div className="text-center text-xs sm:text-sm text-[#1E3B3B] pt-1">
                Already have an account?{' '}
                <a href="/login" className="font-medium text-[#6E8F89] hover:text-[#1E3B3B]">
                  Sign in
                </a>
              </div>
            </div>

            <div className="bg-[#B3D5CF] px-4 sm:px-6 py-2 sm:py-3 border-t border-[#6E8F89]">
              <p className="text-xs text-[#1E3B3B] text-center">
                © {new Date().getFullYear()} CargoShipment Pro. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;