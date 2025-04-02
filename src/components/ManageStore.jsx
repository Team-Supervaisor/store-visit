import React from 'react'
import logo from '../assets/logo.png'
import { ArrowRight, Plus, UploadCloudIcon } from 'lucide-react'
import image_plan from '../assets/samsung.png'
import { useState } from "react";
import { Store, X, Upload } from 'lucide-react';
export default function ManageStore() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState(null);
    const [storeName, setStoreName] = useState('');
  const [storeId, setStoreId] = useState('');
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Convert file to URL for preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };
    const StoreData=[
        {
          "id": 1,
          "storeName": "Queenstown",
          "store_id": "AR-23523612",
          "image": "https://via.placeholder.com/50",
          "TSM_name": "John Doe"
        },
        {
          "id": 2,
          "storeName": "Queenstown",
          "store_id": "AR-23523612",
          "image": "https://via.placeholder.com/50",
          "TSM_name": "John Doe"
        },
        {
          "id": 3,
          "storeName": "Queenstown",
          "store_id": "AR-23523612",
          "image": "https://via.placeholder.com/50",
          "TSM_name": "John Doe"
        },
        {
          "id": 4,
          "storeName": "Queenstown",
          "store_id": "AR-23523612",
          "image": "https://via.placeholder.com/50",
          "TSM_name": "John Doe"
        },
        {
          "id": 5,
          "storeName": "Queenstown",
          "store_id": "AR-23523612",
          "image": "https://via.placeholder.com/50",
          "TSM_name": "John Doe"
        },
        {
          "id": 6,
          "storeName": "Queenstown",
          "store_id": "AR-23523612",
          "image": "https://via.placeholder.com/50",
          "TSM_name": "John Doe"
        },
        {
          "id": 7,
          "storeName": "Queenstown",
          "store_id": "AR-23523612",
          "image": "https://via.placeholder.com/50",
          "TSM_name": "John Doe"
        }
    ]
      

    return (
    <>
    <div className='bg-[#F7FAFF] p-5 h-screen'>
    {/* Flex container for image and text */}
    <div className="flex items-center space-x-2">
        <img src={logo} className="w-[50px] h-[50px]" alt="Logo" />
        <span className="text-xl font-semibold text-black">Store Visit Tracking</span>
    </div>

    {/* <div className="flex items-center justify-between bg-white p-[3px] rounded-[20px] shadow-sm mt-[10px]">
    <div className="flex items-center justify-between w-full p-4">
        <h2 className="text-[26px] text-black-500 font-semibold">Stores Data <span className="text-[26px] text-black-500">(14)</span></h2>
        <button className="flex items-center gap-2 bg-[#717AEA] text-white px-4 py-2 rounded-lg  transition">
            <Plus size={16} /> Add Store
        </button>
        </div>

        
    </div>
    <div className="mt-5  bg-[#EFF4FE]">
        <div className="overflow-y-auto ">
            <table className="w-full text-sm text-left bg-white  rounded-[12px] border-[2px] border-[#EFF4FE] pt-[20px] pb-[20px] pr-[32px] pl-[32px] ">
            <thead className="bg-[#EFF4FE] text-[#717AEA] text-[16px] font-[600] uppercase ">
                <tr>
                <th className="p-4">Store Name</th>
                <th className="p-4">Store ID</th>
                <th className="p-4">Store Planogram</th>
                <th className="p-4">TSM Name</th>
                    <th className="p-4"></th>
                </tr>
            </thead>
            <tbody >
                {StoreData?.map((store, index) => (
                <>
                    <tr key={index} className="border-[#EFF4FE] border-[2px] text-[14px] font-[400] text-[#000000] p-[10px]">
                    
                    <td className="p-4">{store?.storeName||"N/A "}</td>
                    <td className="p-4">{store.store_id||"N/A "}</td>
                    <td className="pr-[28px] pl-[28px] pt-[9px] pb-[9px] ">
                        <img src={image} alt="store" className="h-16 w-24 rounded-md" 
                        />
                    </td>
                    <td className="p-4">{store.TSM_name||"N/A "}</td>
                        <td className="p-4"><ArrowRight/>
                            </td>
                    </tr>
                </>
                ))}
            </tbody>
            </table>
        </div>
        </div> */}

    <div className="bg-white shadow-md rounded-[26px] p-6 mt-6">
        {/* Header Section */}
        <div className="flex items-center justify-between ">
            <h2 className="text-[26px] text-black">
            Store Data <span className="text-[26px] text-black  ">(14)</span>
            </h2>
            <button className="flex items-center gap-2 bg-[#717AEA] text-white px-4 py-2 rounded-lg transition" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Store
            </button>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left bg-white  rounded-[12px] border-[2px] border-[#EFF4FE] pt-[20px] pb-[20px] pr-[32px] pl-[32px]">
            <thead className="bg-[#EFF4FE] text-[#717AEA] text-[16px] font-[600] uppercase">
                <tr>
                <th className="p-4">Store Name</th>
                <th className="p-4">Store ID</th>
                <th className="p-4">Store Planogram</th>
                <th className="p-4">TSM Name</th>
                <th className="p-4"></th>
                </tr>
            </thead>
            <tbody>
                {StoreData.map((store, index) => (
                <tr key={index} className="border-[#EFF4FE] border-[2px] text-[14px] font-[400] text-[#000000] p-[5px] hover:bg-[#F6F9FF] transition duration-200">
                    <td className="p-2">{store.storeName}</td>
                    <td className="p-2">{store.store_id}</td>
                    <td className="p-2">
                    <img
                        src={image_plan}
                        alt="Store Planogram"
                        className="h-16 w-24 rounded-md"
                    />
                    </td>
                    <td className="p-2">{store.TSM_name}</td>
                    <td className="p-2 text-gray-500">
                    <ArrowRight size={16} />
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        </div>
    </div>
    {isModalOpen && (
       <div className="backdrop-blur-sm fixed inset-0 bg-black/30 flex items-center justify-center">
       <div className="bg-white rounded-[33px] shadow-lg w-full max-w-5xl">
         {/* Header */}
         <div className="flex items-center justify-between p-4 border-b border-gray-200">
           <div className="flex items-center gap-2"> 
           <div className="bg-[#EFF4FE] p-2 rounded-full">
              <Store className="h-5 w-5 text-[#4F4FDC]" />
            </div>
             <h1 className="text-lg font-medium text-black">Add Store Details</h1>
           </div>
           <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsModalOpen(false)}>
             <X className="h-5 w-5" />
           </button>
         </div>
 
         {/* Form Content */}
         <div className="p-4 space-y-6">
           <div className="flex items-center w-[450px]">
             <label htmlFor="storeName" className="text-sm font-medium text-gray-700 w-40">
               Store Name:
             </label>
             <input
               id="storeName"
               type="text"
               value={storeName}
               onChange={(e) => setStoreName(e.target.value)}
               className="flex-1 border-b border-gray-300 px-1 py-1 focus:outline-none focus:border-indigo-500 text-black"
             />
           </div>
 
           <div className="flex items-center w-[450px]">
             <label htmlFor="storeId" className="text-sm font-medium text-gray-700 w-40">
               Store ID:
             </label>
             <input
               id="storeId"
               type="text"
               value={storeId}
               onChange={(e) => setStoreId(e.target.value)}
               className="flex-1 w-md border-b border-gray-300 px-1 py-1 focus:outline-none focus:border-indigo-500 text-black"
             />
           </div>
 
           <div className="flex items-center">
             <label className="text-sm font-medium text-gray-700 w-40">Upload Planogram:</label>
             {/* Hidden File Input */}
             <input type="file" accept="image/*" id="fileUpload" onChange={handleImageChange} className="hidden" />
             {/* Label for file input */}
             <label htmlFor="fileUpload" className="flex items-center gap-2 text-indigo-600 px-3 py-1 rounded cursor-pointer  p-[2px] bg-[#F2F2FF]">
               <Upload className="h-4 w-4 text-[#717AEA]" />
               <span className='text-black'>Upload</span>
             </label>
           </div>
 
           {/* Planogram Preview Area */}
           <div className="border border-gray-200 bg-[#EFF4FE] rounded-lg h-56 w-md flex items-center justify-center overflow-hidden">
             {previewImage ? (
               <img src={previewImage} alt="Planogram Preview" className="h-full w-full object-contain" />
             ) : (
               <p className="text-gray-500 text-sm">Upload to view</p>
             )}
           </div>
         </div>
 
         {/* Footer */}
         <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
           <button className="px-4 py-2 rounded text-gray-700 hover:bg-gray-50" onClick={() => setIsModalOpen(false)}>
             Close
           </button>
           <button className="px-4 py-2 bg-indigo-400 text-white rounded hover:bg-indigo-500" onClick={() => setIsModalOpen(false)}>
             Done
           </button>
         </div>
       </div>
     </div>
      )}
          
        
        </>
  )
}
