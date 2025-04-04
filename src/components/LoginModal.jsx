import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context';

const LoginModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAppContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (email.trim() === 'admin' && password === 'admin') {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setLoading(false);
      login(); // Set authenticated state
      navigate('/'); // Redirect to home page
    } else {
      alert('Invalid credentials');
    }
  };


  return (
    <div className="fixed inset-0 bg-white z-50">
      <div className="flex h-screen">
        {/* Left side - Login Form */}
        <div className="w-1/2 flex items-center justify-center p-10">
          <div className="w-full max-w-md">
     
            <div className="flex items-center mb-12 gap-4">
            <div className="relative h-12 w-12 rounded-lg" style={{
                background: 'linear-gradient(140.58deg, #4F4FDC 4.02%, #717AEA 95.98%)'
            }}>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-10 w-10 rounded-lg flex items-center justify-center" style={{
                background: 'linear-gradient(142.73deg, #4F4FDC -43.15%, #717AEA 86.77%)'
            }}>
                <img 
                src="/logo.svg" 
                alt="arrow" 
                className='h-8 w-8 object-contain'
                />
            </div>
            </div>
            <div className="flex flex-col">
            <span className="font-bold text-xl text-black">Store Visit Tracking</span>
            <span className="text-gray-500">Supervaisor.ai</span>
            </div>
            </div>
    


            <h2 className="text-3xl  mb-2 text-black font-bold">Login to Dashboard</h2>
            <p className="text-lg text-gray-600 mb-16">Fill details below to login</p>

            <form onSubmit={handleSubmit} className="space-y-6" autocomplete="off">
              <div>
                <label className="block text-black font-semibold mb-2 ">
                  Username
                </label>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none  text-black"
                  placeholder="Enter your username"
                    autocomplete="off"
                  required
                />
              </div>
              <div>
                <label className="block text-black font-semibold mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:outline-none  text-black"
                  placeholder="Enter your password"
                  autoFocus="off"
                  required
                />
              </div>
              <p className='text-[#4F4FDC] cursor-pointer'>Forgot Password?</p>
              <button
            type="submit"
            disabled={loading}
             className="w-full py-3 px-4 rounded-lg text-white relative"
            style={{
              background: 'linear-gradient(90.84deg, #5D61E2 9.55%, #727BEA 90.45%)',
              border: '1.6px solid transparent',
              borderImageSlice: 1,
            }}
              >
                {loading ? (
              <span className="flex items-center justify-center">
                Authenticating...
              </span>
            ) : (
              'Login'
            )}
              </button>
            </form>
          </div>
        </div>

        {/* Right side - Image */}
        <div className="w-1/2 p-16 flex items-center justify-center">
          <div className="w-full h-full relative">
          <img src="/sample-store.svg" alt="arrow" className='h-full w-full' />
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;


