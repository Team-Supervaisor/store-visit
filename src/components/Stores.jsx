import React, { useState, useRef, useEffect } from "react";
import { CircleUserRound, Check, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Button = ({ children, styling, onClick }) => (
  <button
    className={`p-2 rounded-xl bg-[#E1E9FD] text-[#4F4FDC] ${styling}`}
    onClick={() => onClick()}
  >
    {children}
  </button>
);

const Card = ({ children }) => (
  <div className="p-4 bg-white rounded-3xl shadow-sm">{children}</div>
);

const Table = ({ children }) => (
  <table className="w-full border-collapse border border-gray-300">
    {children}
  </table>
);

const TableHeader = ({ children }) => (
  <thead className="bg-gray-200">{children}</thead>
);

const TableRow = ({ children }) => (
  <tr className="border-b border-gray-300">{children}</tr>
);

const TableCell = ({ children }) => (
  <td className="p-2 border border-gray-300 text-black">{children}</td>
);

const TableBody = ({ children }) => <tbody>{children}</tbody>;

const Tabs = ({ children }) => <div className="">{children}</div>;

const TabsList = ({ children }) => (
  <div className="flex space-x-2">{children}</div>
);

const TabsTrigger = ({ children, value, onClick, active }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-4 py-2 rounded-xl flex items-center ${
      active ? "bg-[#717AEA] text-white" : "bg-[#F7FAFF] text-black"
    }`}
  >
    {children}
  </button>
);

const Calendar = () => (
  <input type="date" className="border border-gray-300 rounded px-2 py-1" />
);

const Input = ({ type, placeholder }) => (
  <input
    type={type}
    placeholder={placeholder}
    className="border border-gray-300 rounded px-2 py-1"
  />
);

const Dropdown = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-[140px]">
      <button
        className="bg-[#EFF4FE] rounded px-3 text-[#717AEA] flex w-full justify-between"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((option) => option === selected) || "Select"}
        <img src="/downArrow.svg" alt="arrow" className="ml-4"/>
      </button>
      {isOpen && (
        <ul className="absolute shadow-md mt-1 rounded z-10 w-[140px] text-[#717AEA] bg-white">
          {options.map((option, index) => (
            <li
              key={index}
              className="px-2 py-1 cursor-pointer flex items-center"
              // style={{ backgroundColor: option.bgColor, color: option.textColor }}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
              {selected === option && <Check className="w-[15px] ml-2" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};




const StoreVisitTracking = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [storeId, setStoreId] = useState("");
  const [date, setDate] = useState("");
  const [storeVisit,setStoreVisit] = useState([])
  const [storeVisitDetails, setStoreVisitDetails] = useState([]);
  useEffect(() => {
    function getStore_dropdown(){

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://store-visit-85801868683.us-central1.run.app/api/store_ids_and_dates',
        headers: { }
      };
      
      axios.request(config)
      .then((response) => {
        console.log((response.data));
        const updatedStoreIds = ["All", ...response.data.store_ids];
        const updatedDates = ["All", ...response.data.dates];

        setStoreId(updatedStoreIds);
        setDate(updatedDates);
        setSelectedStore(updatedStoreIds[0]);
        setSelectedDate(updatedDates[0]);
        handleGo();
      })
      .catch((error) => {
        console.log(error);
      });
    }
    getStore_dropdown();
  }, [])
  
  const handleGo = () => {
    setStoreVisitDetails([]);
    let url = `https://store-visit-85801868683.us-central1.run.app/api/get_store_visits?visit_date=${selectedDate}&store_id=${selectedStore}`;
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url:url,
      headers: { }
    };
    
    axios.request(config)
    .then((response) => {
      // console.log((response.data));
      setStoreVisit(response.data.store_visits);

      storevisitdetails(response.data.store_visits);


    })
    .catch((error) => {
      console.log(error);
    });
    
  }
  const storevisitdetails = (storevisit) => {
    let details = []; // Temporary array to store fetched data
  
    Promise.all(
      storevisit.map((item) => {
        let url1 = `https://store-visit-85801868683.us-central1.run.app/api/get_store_visit_details?store_visit_id=${item.store_visit_id}`;
  
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: url1,
          headers: {},
        };
  
        return axios.request(config)
          .then((response) => {
            let responseData = {
              ...response.data, // Spread original response data
              status: item.status, // Add status field
            };
            details.push(responseData);
          })
          .catch((error) => {
            console.log(error);
          });
      })
    ).then(() => {
      // Sorting: items with status "finished" should come last
      details.sort((a, b) => (a.status === "finished" ? 1 : -1));
  
      setStoreVisitDetails(details); // Update state with sorted data
    });
  };
  

  return (
    <div className="bg-[#F7FAFF] min-h-screen min-w-screen font-[Urbanist]">
      <header className="flex p-4 bg-[#F7FAFF] justify-between items-center">
        <div style={{ display: "flex", alignItems: "center", marginLeft: 15 }}>
          <img
            src={logo}
            alt="Logo"
            style={{ height: "25px", marginRight: "10px" }}
          />
          <h1 style={{ margin: 0, color: "black", fontWeight: 500 }}>
            Store Visit Tracking
          </h1>
        </div>
        <div className="space-x-3 flex items-center">
          <Button styling="flex items-center py-3 px-4">
            <img src="/document.svg" alt="" className="mr-1" />
            Analyse with EKG
          </Button>
          <Button styling="flex items-center py-3 px-4">
            <img src="/analyse.svg" alt="" className="mr-1" />
            Analyse on Dashboard
          </Button>
          <img src="/profile.svg" alt="profile" className="ml-3 w-[51px]" />
        </div>
      </header>
      <div className="p-4 bg-[#F7FAFF]">
      <div className="flex justify-between items-center mb-6 px-4 text-black bg-white rounded-3xl py-4">
  <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-4">
    <TabsList>
      <TabsTrigger
        value="all"
        active={selectedTab === "all"}
        onClick={() => setSelectedTab("all")}
      >
        All
        <span
          className={`ml-4 flex items-center justify-center w-6 h-6 rounded-full ${
            selectedTab === "all" ? "text-white" : "text-[#4F4FDC] bg-[#E1E9FD]"
          }`}
        >
          {storeVisitDetails.length}
        </span>
      </TabsTrigger>
      <TabsTrigger
        value="in-progress"
        active={selectedTab === "in-progress"}
        onClick={() => setSelectedTab("in-progress")}
      >
        In Progress
        {/* <span
          className={`ml-4 flex items-center justify-center w-6 h-6 rounded-full ${
            selectedTab === "in-progress"
              ? "text-white"
              : "text-[#4F4FDC] bg-[#E1E9FD]"
          }`}
        >
          2
        </span> */}
      </TabsTrigger>
      <TabsTrigger
        value="completed"
        active={selectedTab === "completed"}
        onClick={() => setSelectedTab("completed")}
      >
        Completed
        {/* <span
          className={`ml-4 flex items-center justify-center w-6 h-6 rounded-full ${
            selectedTab === "completed"
              ? "text-white"
              : "text-[#4F4FDC] bg-[#E1E9FD]"
          }`}
        >
          12
        </span> */}
      </TabsTrigger>
    </TabsList>
  </Tabs>

  <div className="flex space-x-3">
    {storeId.length > 0 && date.length > 0 && (
      <>
        <Button
          variant="outline"
          styling="bg-[#EFF4FE] border-2 border-[#E1E9FD] flex items-center text-black px-4"
          onClick={() => navigate("/manageStores")}
        >
          <img src="/store.svg" alt="store" className="w-[20px] mr-2" />
          Manage Stores
        </Button>

        <div className="flex items-center space-x-3">
          {/* Store Dropdown */}
          <div className="flex items-center rounded-xl p-2 bg-[#F7FAFF] border-2 border-[#EFF5FE]">
            <span className="mr-2 text-black">Store ID</span>
            <Dropdown
              options={storeId}
              selected={selectedStore}
              onChange={setSelectedStore}
            />
          </div>

          {/* Date Dropdown */}
          <div className="flex items-center rounded-xl p-2 bg-[#F7FAFF] border-2 border-[#EFF5FE]">
            <span className="mr-2 text-black">Date</span>
            <Dropdown
              options={date}
              selected={selectedDate}
              onChange={setSelectedDate}
            />
          </div>

          {/* Go Button */}
          <button
            className ="bg-[#717AEA] text-white px-4 py-2 rounded-lg transition"
            onClick={() => handleGo()}
          >
            Go
          </button>
        </div>
      </>
    )}
  </div>
</div>


        <Card className="p-4 rounded-3xl shadow-sm">
          <div className="m-5 bg-[#EFF4FE]">
            <div className="overflow-auto">
              <table className="w-full text-sm text-left bg-white rounded-lg border-[2px] border-[#EFF4FE] pt-[20px] pb-[20px] pr-[32px] pl-[32px] ">
                <thead className="bg-[#EFF4FE] text-[#717AEA] text-[16px] font-[600]">
                  <tr className="">
                    <th className="p-4">Image</th>
                    <th className="p-4">Store Name</th>
                    <th className="p-4">Date of Visit</th>
                    <th className="p-4">Time of Visit</th>
                    <th className="p-4">TSM Name</th>
                    <th className="p-4 flex">
                      <img src="/AIstar.svg" alt="star" className="mr-1"/>
                      AI Generated Analysis
                      </th>
                  </tr>
                </thead>
                <tbody>
                  {storeVisitDetails.length > 0 ? <>
                    {storeVisitDetails
                    .filter((item) => {
                      if (selectedTab === "in-progress") return item.status !== "finished";
                      if (selectedTab === "completed") return item.status === "finished";
                      return true; // Show all if "all" is selected
                    })
                    .map((item, index) => {
                      if(item.x_y_coords){
                      // console.log(item);
                      // console.log(item.x_y_coords,item.x_y_coords.length,typeof(item.x_y_coords));
                      }
                      return (
                        <tr
                          key={index}
                          className="border-[#EFF4FE] border-[2px] text-[14px] font-[400] text-[#000000] p-[10px] hover:bg-[#F6F9FF]"
                          onClick={() => {
                            if (item.status==="finished") {
                              navigate('/storevisit', { state: { storeVisitDetails: item } });
                            } else {
                              navigate('/store-visit-tracking');
                            }
                          }}
                        >
                          <td className="p-4 border-[#EFF4FE] flex items-center">
                            <div
                              className={`w-[7px] h-[7px] rounded-full mr-4 ${
                                item.status === "finished" ? "bg-red-500" : "bg-green-500"
                              }`}
                            ></div>
                            <img
                              src={item.planogram_url}
                              alt="image"
                              className="h-20 w-30 rounded-md"
                            />
                          </td>
                          <td className="p-4 border-[#EFF4FE] border-2">{item.store_name || "N/A"}</td>
                          <td className="p-4 border-[#EFF4FE] border-2">{item.date?.slice(0, 10) || "N/A"}</td>
                          <td className="p-4 border-[#EFF4FE] border-2">{item.date?.slice(11) || "N/A"}</td>
                          <td className="p-4 border-[#EFF4FE] border-2">{item.TSM_name||"N/A"}</td>
                          <td className="p-4 border-[#EFF4FE] border-2 pl-8">
                            <span className="bg-[#F6F9FF] p-3 rounded-lg">
                              {item?.analysis || "N/A"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}

                  </>:<></>}
                  
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default StoreVisitTracking;