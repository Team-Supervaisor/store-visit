import React from "react";
import logo from "../assets/logo.png";
import { Plus, ChevronRight } from "lucide-react";
import { Store, X, Upload, Pencil } from "lucide-react";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DrawCanvasDrawer from "./DrawCanvasDrawer";
import { ChevronDown, ChevronUp } from "lucide-react";

const Accordion = ({ title, content, isOpen, onClick }) => {
  return (
    <div className="mb-2">
      <div className={`bg-[#EFF4FE] rounded-lg overflow-hidden`}>
        <button
          className="w-full p-3 flex justify-between items-center focus:ring-0 focus:outline-none hover:bg-[#E5EDFD] transition-colors"
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
    id: "fridge",
    title: "Fridge – Whirlpool",
    type: "section",
    content: "Collect observations for Whirlpool refrigerators.",
    questions: [
      { question: "How many Whirlpool fridge SKUs are available in the store?", type: "integer" },
      { question: "Any damage to Whirlpool POSMs?", type: "string" },
      { question: "Is there any competitive offer from Hitachi or LG? Mention the offer.", type: "string" },
      { question: "How many Whirlpool fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "smartphone",
    title: "Smartphones – Google",
    type: "section",
    content: "Collect observations for Google smartphones.",
    questions: [
      { question: "How many Google smartphone SKUs are available in the store?", type: "integer" },
      { question: "Any damage to Google POSMs?", type: "string" },
      { question: "Is there any competitive offer from Apple or Samsung? Mention the offer.", type: "string" },
      { question: "How many Google fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "washingMachine",
    title: "Washing Machines – Whirlpool",
    type: "section",
    content: "Collect observations for Whirlpool washing machines.",
    questions: [
      { question: "How many Whirlpool washing machine SKUs are available in the store?", type: "integer" },
      { question: "Any damage to Whirlpool POSMs?", type: "string" },
      { question: "Is there any competitive offer from IFB or LG? Mention the offer.", type: "string" },
      { question: "How many Whirlpool fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "tv",
    title: "TV – Samsung",
    type: "section",
    content: "Collect observations for Samsung TVs.",
    questions: [
      { question: "How many Samsung TV SKUs are available in the store?", type: "integer" },
      { question: "Any damage to Samsung POSMs?", type: "string" },
      { question: "Is there any competitive offer from LG or Sony? Mention the offer.", type: "string" },
      { question: "How many Samsung fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "laptop",
    title: "Laptops – HP",
    type: "section",
    content: "Collect observations for HP laptops.",
    questions: [
      { question: "How many HP laptop SKUs are available in the store?", type: "integer" },
      { question: "Any damage to HP POSMs?", type: "string" },
      { question: "Is there any competitive offer from Dell or Lenovo? Mention the offer.", type: "string" },
      { question: "How many HP fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "ac",
    title: "Air Conditioners – Voltas",
    type: "section",
    content: "Collect observations for Voltas air conditioners.",
    questions: [
      { question: "How many Voltas AC SKUs are available in the store?", type: "integer" },
      { question: "Any damage to Voltas POSMs?", type: "string" },
      { question: "Is there any competitive offer from LG or Daikin? Mention the offer.", type: "string" },
      { question: "How many Voltas fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "tablet",
    title: "Tablets – Apple",
    type: "section",
    content: "Collect observations for Apple tablets.",
    questions: [
      { question: "How many Apple tablet SKUs are available in the store?", type: "integer" },
      { question: "Any damage to Apple POSMs?", type: "string" },
      { question: "Is there any competitive offer from Samsung or Lenovo? Mention the offer.", type: "string" },
      { question: "How many Apple fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "smartwatch",
    title: "Smartwatches – Boat",
    type: "section",
    content: "Collect observations for Boat smartwatches.",
    questions: [
      { question: "How many Boat smartwatch SKUs are available in the store?", type: "integer" },
      { question: "Any damage to Boat POSMs?", type: "string" },
      { question: "Is there any competitive offer from Noise or Fire-Boltt? Mention the offer.", type: "string" },
      { question: "How many Boat fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "waterPurifier",
    title: "Water Purifiers – Aquaguard",
    type: "section",
    content: "Collect observations for Aquaguard water purifiers.",
    questions: [
      { question: "How many Aquaguard SKUs are available in the store?", type: "integer" },
      { question: "Any damage to Aquaguard POSMs?", type: "string" },
      { question: "Is there any competitive offer from Kent or Livpure? Mention the offer.", type: "string" },
      { question: "How many Aquaguard fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "printer",
    title: "Printers – Canon",
    type: "section",
    content: "Collect observations for Canon printers.",
    questions: [
      { question: "How many Canon printer SKUs are available in the store?", type: "integer" },
      { question: "Any damage to Canon POSMs?", type: "string" },
      { question: "Is there any competitive offer from HP or Epson? Mention the offer.", type: "string" },
      { question: "How many Canon fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  },
  {
    id: "speaker",
    title: "Speakers – JBL",
    type: "section",
    content: "Collect observations for JBL speakers.",
    questions: [
      { question: "How many JBL speaker SKUs are available in the store?", type: "integer" },
      { question: "Any damage to JBL POSMs?", type: "string" },
      { question: "Is there any competitive offer from Sony or Boat? Mention the offer.", type: "string" },
      { question: "How many JBL fixtures are there and what type?", type: "string" },
      { question: "Any additional insights?", type: "string" }
    ]
  }
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
  // const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
  const [clickPosition, setClickPosition] = useState(null);
  const imageRef = useRef(null);
  const navigate = useNavigate();
  const [tsmName, setTsmName] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [rectangleData, setRectangleData] = useState([]);
  const [snapshot, setSnapshot] = useState(null);
  // let snapshot = null;

  const initialShapes = [
    {
      id: 1,
      type: "rectangle",
      x: -100,
      y: -50,
      width: 200,
      height: 100,
      vertices: [
        [-100, 50],
        [-100, -50],
        [100, -50],
        [100, 50],
      ],
      name: "Main Area",
      instruction: "Start here",
    },
    {
      id: 2,
      type: "text",
      x: -50,
      y: -70,
      text: "Welcome Zone",
    },
  ];

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      // Convert file to URL for preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };
  const handleSaveShapes = (data) => {
    console.log("Received from child:", data);
    setRectangleData(data.shapes);
    // console.log(data.snapshot)
    setSnapshot(data.snapshot);
    // snapshot = data.snapshot;
    // console.log("Received from child:", data.shapes);
    // console.log("Received from child:", data.snapshot);
  };
  const handleCreate = async () => {
    if (!storeName || !storeId) {
      alert("Please fill all the fields");
      return;
    }
    // if (!image) {
    //   alert("Please select an image to upload");
    //   return;
    // }
    if (!image && rectangleData.length === 0) {
      alert("Please upload an image or draw ");
      return;
    }
    console.log("clickPosition", clickPosition);
    if (image && !clickPosition) {
      alert("Please click on the image to set the start point");
      return;
    }
    console.log("rectangleData", rectangleData.length);
    // console.log("clickPosition", clickPosition);
    if (rectangleData.length > 0 && !clickPosition) {
      alert("Please click on the image to set the start pointss");
      return;
    }

    // return;

    const formData = {
      name: storeName,
      store_id: storeId,
      planogram: image,
      TSM_name: tsmName,
      transform: JSON.stringify({
        scale: 1.0,
      }),
      startpoint: JSON.stringify(clickPosition),
      planogram_coords: JSON.stringify(rectangleData),
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
    setOpenAccordion(null);
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
                            src={store?.planogram_url}
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
                      disabled={snapshot ? true : false}
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
                    disabled={previewImage ? true : false}
                    className="border border-gray-400 flex items-center gap-2 text-indigo-600 px-5 py-1 rounded-lg cursor-pointer bg-[#F2F2FF]"
                  >
                    <Pencil className="h-4 w-4 text-[#717AEA]" />
                    <span className="text-black text-sm">Draw</span>
                  </button>
                </div>

                {/* Planogram Preview Area */}
                <div className="border border-gray-400 bg-[#EFF4FE] rounded-lg w-md h-56 flex items-center justify-center overflow-hidden mb-4">
                  {previewImage || snapshot ? (
                    <div className="relative w-full h-full" ref={imageRef}>
                      <img
                        src={previewImage || snapshot}
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
                {(previewImage || snapshot) && (
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
                        isOpen={openAccordion === item.id}
                        onClick={() =>
                          setOpenAccordion(
                            openAccordion === item.id ? null : item.id
                          )
                        }
                        content={
                          <>
                            <div
                              style={{
                                fontWeight: "bold",
                                marginBottom: "12px",
                              }}
                            >
                              {item.content}
                            </div>
                            <div>
                              {item.questions.map((q, index) => (
                                <div
                                  key={index}
                                  style={{ marginBottom: "12px" }}
                                >
                                  {index + 1}. {q.question}
                                </div>
                              ))}
                            </div>
                          </>
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
          <DrawCanvasDrawer
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onSaveShapes={handleSaveShapes}
            shapes={initialShapes}
          />
        </div>
      )}
    </>
  );
}
