
import React from 'react';
import { useNavigate } from 'react-router-dom';
const ConnectionErrorModal = ({ isOpen }) => {
    const navigate = useNavigate();
  if (!isOpen) return null;

  const handleRefresh = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] p-8 w-[400px] flex flex-col items-center">
        <img src="/down.svg" alt="Connection Error" className="h-20 mb-4" />
        <h2 className="text-[#B3261E] text-xl font-semibold mb-2">Feed Disconnected</h2>
        <p className="text-center text-gray-600 mb-6">
          Please check the connection or try again later
        </p>
        <button
          onClick={handleRefresh}
          className="bg-[#5856D6] text-white px-8 py-2 rounded-lg font-medium"
        >
          Refresh
        </button>
      </div>
    </div>
  );
};

export default ConnectionErrorModal;