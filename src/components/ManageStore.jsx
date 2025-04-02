import React from 'react'
import logo from '../assets/logo.png'
import { ArrowRight, Plus, UploadCloudIcon } from 'lucide-react'
import image_plan from '../assets/samsung.png'
import { useState } from "react";
export default function ManageStore() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [image, setImage] = useState(null);

    const handleImageChange = (event) => {
      if (event.target.files && event.target.files[0]) {
        const file = event.target.files[0];
        setImage(URL.createObjectURL(file)); // Create a preview URL
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
        <div className="flex items-center justify-between pb-4 ">
            <h2 className="text-[26px] text-black-500">
            Store Data <span className="text-[26px] text-black-500">(14)</span>
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
        <div className="fixed inset-0  bg-opacity-20 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-[20px] shadow-lg w-[600px]">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Store Details</h3>
              <button onClick={() =>{ setIsModalOpen(false);setImage(null)}} className="text-gray-500">
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div>
              <label className="block text-gray-600">Store Name:</label>
              <input type="text" className="w-full p-2 border rounded mt-1" placeholder="Enter store name" />

              <label className="block text-gray-600 mt-3">Store ID:</label>
              <input type="text" className="w-full p-2 border rounded mt-1" placeholder="Enter store ID" />

              <label className="block text-gray-600 mt-3">Upload Planogram:</label>
{/* Label linked to file input */}
                <label 
                    htmlFor="fileUpload" 
                    className="flex items-center gap-2 bg-[#717AEA] text-white px-4 py-2 rounded-lg mt-2 cursor-pointer"
                >
                    <UploadCloudIcon /> Upload
                </label>
                <input
                    type="file"
                    accept="image/*"
                    id="fileUpload"
                    onChange={handleImageChange}
                    className="hidden"
                />
                {/* Image Preview */}
      {image && (
        <div className="mt-4">
          <img src={image} alt="Preview" className="w-40 h-40 rounded-lg shadow-lg object-cover" />
        </div>
      )}
              {/* Upload Preview Box */}
              {/* <div className="mt-4 p-6 border-dashed border-2 border-gray-300 text-center rounded-lg">
                Upload to view
              </div> */}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end mt-4 gap-2">
              <button onClick={() =>{ setIsModalOpen(false);setImage(null)}} className="px-4 py-2 rounded-lg border">
                Close
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#A5A6F6] text-white">Done</button>
            </div>
          </div>
        </div>
      )}
          
        
        </>
  )
}
