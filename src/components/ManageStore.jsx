import React from "react";
import logo from "../assets/logo.png";
import { Plus, ChevronRight } from "lucide-react";
import { Store, X, Upload,Pencil} from "lucide-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DrawCanvasDrawer from "./DrawCanvasDrawer";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="mb-2">
      <div className={`bg-[#EFF4FE] rounded-lg overflow-hidden ${isOpen ? '' : ''}`}>
        <button
          className="w-full p-3 flex justify-between items-center focus:none"
          onClick={onClick}
        >
          <span className="font-medium text-sm text-gray-700">{title}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-600" />
          )}
        </button>
        {isOpen && (
         
          <div className="p-4 bg-white rounded-lg m-1 shadow-sm">
          <p className="text-sm text-gray-600">{content}</p>
        </div>
        )}
      </div>
    </div>
  );
};


const INSTRUCTIONS_DATA = [
  {
    id: "store",
    title: "Store Details",
    content: "Enter the store name and unique store ID. For existing stores, the ID field will be disabled."
  },
  {
    id: "tsm",
    title: "TSM Information",
    content: "Enter the Territory Sales Manager (TSM) name who is responsible for this store."
  },
  {
    id: "planogram",
    title: "Planogram Upload",
    content: "Upload a clear image of the store planogram. You can either upload an existing image or draw a new one using the Draw feature."
  },
  {
    id: "firestore",
    title: "Start Point12we",
    content: "After uploading the planogram, select a start point by clicking the 'Pick Start Point' button and then clicking on the desired location in the image."
  }
  ,
  {
    id: "startpoint1",
    title: "Start Point1223",
    content: "After uploading the planogram, select a start point by clicking the 'Pick Start Point' button and then clicking on the desired location in the image."
  },
  {
    id: "startpoint2",
    title: "Start Point122",
    content: "After uploading the planogram, select a start point by clicking the 'Pick Start Point' button and then clicking on the desired location in the image."
  },
  {
    id: "startpoint3",
    title: "Start Point12",
    content: "After uploading the planogram, select a start point by clicking the 'Pick Start Point' button and then clicking on the desired location in the image."
  },
  {
    id: "startpoint8",
    title: "Start Point12",
    content: "After uploading the planogram, select a start point by clicking the 'Pick Start Point' button and then clicking on the desired location in the image."
  },
  // {
  //   id: "startpoint5",
  //   title: "Start Point12",
  //   content: "After uploading the planogram, select a start point by clicking the 'Pick Start Point' button and then clicking on the desired location in the image."
  // },
  // {
  //   id: "startpoint5",
  //   title: "Start Point12",
  //   content: "After uploading the planogram, select a start point by clicking the 'Pick Start Point' button and then clicking on the desired location in the image."
  // },
];


export default function ManageStore() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateStore, setUpdateStore] = useState(false);
  const [image, setImage] = useState(null);
  const [allowClickPosition, setAllowClickPosition] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [storeId, setStoreId] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [storeData, setStoreData] = useState([]);
  const [clickPosition, setClickPosition] = useState();
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [tsmName, setTsmName] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      // Convert file to URL for preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleCreate = async () => {
    if (!storeName || !storeId) {
      alert("Please fill all the fields");
      return;
    }
    if (!image) {
      alert("Please select an image to upload");
      return;
    }
    if (!clickPosition) {
      alert("Please click on the image to set the start point");
      return;
    }

    const formData = {
      name: storeName,
      store_id: storeId,
      planogram: image,
      TSM_name: tsmName,
      transform: JSON.stringify({
        scale: 1.0,
      }),
      startpoint: JSON.stringify(clickPosition),
    };

    const url = updateStore
      ? `https://store-visit-85801868683.us-central1.run.app/updatestore`
      : "https://store-visit-85801868683.us-central1.run.app/addstores";
    axios
      .post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log(res.data);
        if (updateStore) alert("Store updated successfully");
        else alert("Store added successfully");
        handleClose();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setStoreName("");
    setStoreId("");
    setPreviewImage(null);
    setClickPosition(null);
    setImage(null);
    setAllowClickPosition(false);
    setUpdateStore(false);
    setTsmName("");
  };

  const handleImageClick = (event) => {
    if (!allowClickPosition) return;
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert to desired coordinate system
    const mappedX = (x / rect.width) * 1000 - 500;
    const mappedY = (y / rect.height) * 500 - 250;
    setClickPosition({ x: mappedX, y: mappedY });
  };

  useEffect(() => {
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://store-visit-85801868683.us-central1.run.app/stores",
      headers: {},
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setStoreData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="bg-[#F7FAFF] p-5 h-fit font-[Urbanist]">
        {/* Flex container for image and text */}
        <div className="flex justify-between">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: 15,
              marginTop: "15px",
            }}
            className="hover:cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: "25px", marginRight: "10px" }}
            />
            <h1 style={{ margin: 0, color: "black", fontWeight: 500 }}>
              Store Management
            </h1>
          </div>
          <img src="/profile.svg" alt="" srcset="" />
        </div>

        <div className="bg-white shadow-md rounded-[26px] p-8 mt-8">
          {/* Header Section */}
          {storeData.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[26px] text-black font-medium">
                  Store Data{" "}
                  <span className="text-[26px] text-black  ">
                    ({storeData.length})
                  </span>
                </h2>
                <button
                  className="flex items-center gap-2 bg-[#717AEA] text-white px-4 py-2 rounded-lg transition"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Plus size={16} /> Add Store
                </button>
              </div>

              {/* Table Section */}
              <div className="overflow-x-auto mt-4 rounded-lg">
                <table className="w-full text-sm text-left bg-white  rounded-[12px] border-[2px] border-[#EFF4FE] pt-[20px] pb-[20px] pr-[32px] pl-[32px]">
                  <thead className="bg-[#EFF4FE] text-[#717AEA] text-[16px] font-[600]">
                    <tr>
                      <th className="p-4 text-[16px]">Store Name</th>
                      <th className="p-4 text-[16px]">Store ID</th>
                      <th className="p-4 text-[16px]">Store Planogram</th>
                      <th className="p-4 text-[16px]">TSM Name</th>
                      <th className="p-4 text-[16px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {storeData.map((store, index) => (
                      <tr
                        key={index}
                        className="border-[#EFF4FE] border-[2px] text-[14px] font-[400] text-[#000000] p-[5px] hover:bg-[#F6F9FF] transition duration-200"
                        onClick={() => {
                          setIsModalOpen(true);
                          setUpdateStore(true);
                          setStoreName(store.name);
                          setStoreId(store.store_id);
                          setTsmName(store.TSM_name);
                        }}
                      >
                        <td className="px-6 py-2 text-[14px]">{store.name}</td>
                        <td className="px-6 py-2 text-[14px]">
                          {store.store_id}
                        </td>
                        <td className="px-6 py-2 text-[14px]">
                          <img
                            src="/sample.svg"
                            alt="Store Planogram"
                            className="h-20 w-30 rounded-md"
                          />
                        </td>
                        <td className="px-6 py-2 text-[14px]">
                          {store.TSM_name || "N/A"}
                        </td>
                        <td className="px-6 py-2 text-[14px] text-gray-500">
                          <ChevronRight size={20} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center h-screen">
                <Loader2 className="animate-spin text-blue-500" size={48} />
              </div>
            </>
          )}
        </div>
      </div>
      {isModalOpen && (
        <div className="backdrop-blur-sm fixed inset-0 bg-black/30 flex items-center justify-center font-[Urbanist]">
          <div className="bg-white rounded-[33px] shadow-lg w-full max-w-5xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="bg-[#EFF4FE] p-2 rounded-full">
                  <img
                    src="/store.svg"
                    alt="store"
                    className="h-6 w-6 font-bold text-[#4F4FDC]"
                  />
                </div>
                <h1 className="text-lg font-medium text-black ml-2">
                  {updateStore ? "Update Store Details" : "Add Store Details"}
                </h1>
              </div>
              <button
                className="text-gray-500 hover:text-gray-700 bg-[#F8F8F8] p-[4px] rounded-full"
                onClick={() => handleClose()}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Content Container */}
            <div className="p-4 flex gap-6">
              {/* Existing Form Content */}
              <div className="space-y-6">
         
                 <div>
                <div className="flex items-center w-[450px]">
                  <label
                    htmlFor="storeName"
                    className="text-sm font-medium text-gray-700 w-40"
                  >
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
                  <label
                    htmlFor="storeId"
                    className="text-sm font-medium text-gray-700 w-40"
                  >
                    Store ID:
                  </label>
                  <input
                    id="storeId"
                    disabled={updateStore}
                    type="text"
                    value={storeId}
                    onChange={(e) => setStoreId(e.target.value)}
                    className="flex-1 w-md border-b border-gray-300 px-1 py-1 focus:outline-none focus:border-indigo-500 text-black"
                  />
                </div>

                <div className="flex items-center w-[450px]">
                  <label
                    htmlFor="tsmName"
                    className="text-sm font-medium text-gray-700 w-40"
                  >
                    TSM Name:
                  </label>
                  <input
                    id="tsmName"
                    type="text"
                    value={tsmName}
                    onChange={(e) => setTsmName(e.target.value)}
                    className="flex-1 w-md border-b border-gray-300 px-1 py-1 focus:outline-none focus:border-indigo-500 text-black"
                  />
                </div>


                 </div>

              



                <div className="flex items-center justify-around">
                  {/* Upload Label & Button */}
                  <div className="flex items-center">
                    <label
                      className="text-sm font-medium text-gray-700 w-40"
                      htmlFor="fileUpload"
                    >
                      Upload Planogram:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      id="fileUpload"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="fileUpload"
                      className="border border-gray-400 flex items-center gap-2 text-indigo-600 px-5 py-1 rounded-lg cursor-pointer p-[2px] bg-[#F2F2FF] hover:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      role="button"
                      tabIndex={0}
                      aria-label="Upload planogram image"
                    >
                      <Upload className="h-4 w-4 text-[#717AEA]" />
                      <span className="text-black text-sm">Upload</span>
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDrawerOpen(true)}
                   
                    className="border border-gray-400 flex items-center gap-2 text-indigo-600 px-5 py-1 rounded-lg cursor-pointer bg-[#F2F2FF]"
                  >
                    <Pencil className="h-4 w-4 text-[#717AEA]" />
                    <span className="text-black text-sm">Draw</span>
                  </button>
                </div>

                {/* Planogram Preview Area */}
                <div className="border border-gray-400 bg-[#EFF4FE] rounded-lg w-md h-56 flex items-center justify-center overflow-hidden mb-4">
                  {previewImage ? (
                    <div className="relative w-full h-full" ref={imageRef}>
                      <img
                        src={previewImage}
                        onClick={handleImageClick}
                        alt="Planogram Preview"
                      />
                      {clickPosition && (
                        <img
                          src="/pointer.svg"
                          className="absolute w-5 h-5"
                          style={{
                            left: `${((clickPosition.x + 500) / 1000) * 100}%`,
                            top: `${((clickPosition.y + 250) / 500) * 100}%`,
                            transform: "translate(-50%, -50%)",
                          }}
                        ></img>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">Upload to view</p>
                  )}
                </div>
                {previewImage && (
                  <div className="flex items-center">
                    <button
                      className="flex items-center bg-[#EFF4FE] text-[#4F4FDC] border border-[#4F4FDC] px-4 py-2 rounded-lg font-bold"
                      onClick={() => setAllowClickPosition(true)}
                    >
                      <Plus size={16} /> Pick Start Point
                    </button>
                  </div>
                )}
              </div>

              <div>

              

              <div className="w-[400px]">
            <h2 className="text-lg font-medium text-black mb-4">
              Instructions
            </h2>
            <div className="max-h-[400px] overflow-y-auto pr-2 hide-scrollbar">
              {INSTRUCTIONS_DATA.map((item) => (
                <Accordion
                  key={item.id}
                  title={item.title}
                  content={item.content}
                  isOpen={openAccordion === item.id}
                  onClick={() =>
                    setOpenAccordion(openAccordion === item.id ? null : item.id)
                  }
                />
              ))}
            </div>
          </div>
              </div>

               

             
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 p-4 border-t border-gray-200">
              <button
                className="px-4 py-2 rounded text-gray-700 text-sm font-bold w-[120px] border border-gray-500 hover:bg-gray-50"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                className="px-4 py-2 bg-indigo-400 text-white rounded text-sm font-bold w-[120px] hover:bg-indigo-500"
                onClick={() => {
                  handleCreate();
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
      {isDrawerOpen && isModalOpen && (
        <div className="backdrop-blur-sm fixed inset-0 bg-black/30 flex items-center justify-center font-[Urbanist]">

      <DrawCanvasDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
      </div>

      )}
    </>
  );
}
