import React from 'react';

const DeleteModalLive = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] p-8 w-[450px] flex flex-col items-center">
        <img src="/delete.svg" alt="Delete" className="h-20 mb-4" />
        <h2 className="text-xl font-semibold mb-6">Are you sure?</h2>
        <p className="text-center text-gray-400 mb-6">
          This step can't be undone, please proceed with caution.
        </p>
        
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="bg-[#5856D6] text-white px-8 py-2 rounded-lg font-medium"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="bg-[#5856D624] text-[#5856D6] px-8 py-2 rounded-lg font-medium"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModalLive;