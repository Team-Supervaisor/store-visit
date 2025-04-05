import React from 'react';

const OverlayAddStore = ({ isOpen, onClose, isSuccess, message, setErrorMessage, successMessage}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] p-8 w-[400px] flex flex-col items-center">
        {!isSuccess ? (
          <>
            <img src="/alert.svg" alt="Alert" className="h-20 mb-4" />
            <h2 className="text-[#B3261E] text-xl font-semibold mb-2">Required*</h2>
            <p className="text-center text-gray-600 mb-6">
            { message? message:  'Please fill up the required details.'}
            </p>
            <button
              onClick={ () =>  {
                setErrorMessage("");
                onClose();
              }}
                
              
              className="bg-[#5856D6] text-white px-8 py-2 rounded-lg font-medium"
            >
              Fill up
            </button>
          </>
        ) : (
          <>

            <img src="/complete.svg" alt="Success" className="h-30 mb-4" />
            <h2 className="text-[#34C759] text-xl font-semibold mb-2">Thank You</h2>
            <p className="text-center text-gray-600 mb-6">
             Your details have been submitted successfully.
            </p>
            <button
              onClick={onClose}
              className="bg-[#5856D6] text-white px-8 py-2 rounded-lg font-medium"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OverlayAddStore;