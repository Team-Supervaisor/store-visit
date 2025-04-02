import React, { useState } from "react";
import { CircleUserRound, Check, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

const Button = ({ children, sytling, onClick }) => (
  <button
    className={`px-4 py-2 rounded bg-[#E1E9FD] text-[#4F4FDC] ${sytling}`}
    onClick={() => onClick()}
  >
    {children}
  </button>
);

const Card = ({ children }) => (
  <div className="p-4 bg-white shadow rounded-lg">{children}</div>
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
    className={`px-4 py-2 rounded ${
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

  return (
    <div className="relative">
      <button
        className="bg-[#EFF4FE] rounded px-2 py-1 text-[#717AEA] text-left flex"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((option) => option === selected) || "Select"}
        <ChevronDown />
      </button>
      {isOpen && (
        <ul className="absolute shadow-md mt-1 rounded z-10 w-[130px] text-[#717AEA] bg-[#EFF4FE]">
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

const dummyData = [
  {
    image: "image-url",
    storeName: "Queenstown",
    date: "2025-06-04",
    time: "01:22 PM",
    tsm: "John Doe",
    analysis:
      "Dynamic banner highlighting seasonal discounts and new arrivals.",
  },
  {
    image: "image-url",
    storeName: "Queenstown",
    date: "2025-06-04",
    time: "01:22 PM",
    tsm: "John Doe",
    analysis:
      "Dynamic banner highlighting seasonal discounts and new arrivals.",
  },
  {
    image: "image-url",
    storeName: "Queenstown",
    date: "2025-06-04",
    time: "01:22 PM",
    tsm: "John Doe",
    analysis:
      "Dynamic banner highlighting seasonal discounts and new arrivals.",
  },
  {
    image: "image-url",
    storeName: "Queenstown",
    date: "2025-06-04",
    time: "01:22 PM",
    tsm: "John Doe",
    analysis:
      "Dynamic banner highlighting seasonal discounts and new arrivals.",
  },
  {
    image: "image-url",
    storeName: "Queenstown",
    date: "2025-06-04",
    time: "01:22 PM",
    tsm: "John Doe",
    analysis:
      "Dynamic banner highlighting seasonal discounts and new arrivals.",
  },
  {
    image: "image-url",
    storeName: "Queenstown",
    date: "2025-06-04",
    time: "01:22 PM",
    tsm: "John Doe",
    analysis:
      "Dynamic banner highlighting seasonal discounts and new arrivals.",
  },
];
const storeIds = [
  "Store 1",
  "Store 2",
  "Store 3",
  "Store 4",
  "Store 5",
  "Store 6",
  "Store 7",
  "Store 8",
  "Store 9",
  "Store 10",
];
const dates = [
  "2025-06-01",
  "2025-06-02",
  "2025-06-03",
  "2025-06-04",
  "2025-06-05",
  "2025-06-06",
  "2025-06-07",
  "2025-06-08",
  "2025-06-09",
  "2025-06-10",
];

const StoreVisitTracking = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedStore, setSelectedStore] = useState(storeIds[0]);
  const [selectedDate, setSelectedDate] = useState(dates[0]);

  return (
    <div className="bg-[#F7FAFF] min-h-screen min-w-screen">
      <header className="flex p-4 bg-[#F7FAFF] justify-between items-center mb-4">
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
        <div className="space-x-2 flex items-center">
          <Button variant="outline">Analyse with EKG</Button>
          <Button variant="outline">Analyse on Dashboard</Button>
          <CircleUserRound className="w-[40px] h-[40px] text-[#717AEA]" />
        </div>
      </header>
      <div className="flex justify-between items-center mb-4 px-4 text-black bg-white rounded-lg py-4 mx-4">
        <Tabs
          value={selectedTab}
          onValueChange={setSelectedTab}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger
              value="all"
              active={selectedTab === "all"}
              onClick={setSelectedTab}
            >
              {" "}
              All (14)
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              active={selectedTab === "in-progress"}
              onClick={setSelectedTab}
            >
              In Progress (2)
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              active={selectedTab === "completed"}
              onClick={setSelectedTab}
            >
              Completed (12)
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            sytling="bg-[#EFF4FE] border-2 border-[#E1E9FD]"
            onClick={() => navigate('/manageStores')}
          >
            Manage Stores
          </Button>
          <div className="flex items-center rounded-md p-2 w-fit bg-[#F7FAFF] border-2 border-[#EFF5FE]">
            <span className="mr-2 text-black">Store ID</span>
            <Dropdown
              options={storeIds}
              selected={selectedStore}
              onChange={setSelectedStore}
            />
          </div>
          <div className="flex items-center rounded-md p-2 w-fit bg-[#F7FAFF] border-2 border-[#EFF5FE]">
            <span className="mr-2 text-black">Date</span>
            <Dropdown
              options={dates}
              selected={selectedDate}
              onChange={setSelectedDate}
            />
          </div>
        </div>
      </div>

      <Card className="p-4">
        <div className="mt-5  bg-[#EFF4FE]  ">
          <div className="overflow-auto ">
            <table className="w-full text-sm text-left bg-white  rounded-[12px] border-[2px] border-[#EFF4FE] pt-[20px] pb-[20px] pr-[32px] pl-[32px] ">
              <thead className="bg-[#EFF4FE] text-[#717AEA] text-[16px] font-[600]">
                <tr className="">
                  <th className="p-4">Image</th>
                  <th className="p-4">Store Name</th>
                  <th className="p-4">Date of Visit</th>
                  <th className="p-4">Time of Visit</th>
                  <th className="p-4">TSM Name</th>
                  <th className="p-4">AI Generated Analysis</th>
                </tr>
              </thead>
              <tbody>
                {dummyData?.map((item, index) => (
                  <>
                    <tr
                      key={index}
                      className="border-[#EFF4FE] border-[2px] text-[14px] font-[400] text-[#000000] p-[10px]"
                    >
                      <td className="pr-[28px] pl-[28px] pt-[9px] pb-[9px] ">
                        <img
                          src={item.image}
                          alt="image"
                          className="h-16 w-24 rounded-md"
                        />
                      </td>
                      <td className="p-4">{item.storeName || "N/A "}</td>
                      <td className="p-4">{item.date || "N/A "}</td>
                      <td className="p-4">{item?.time || "N/A "}</td>
                      <td className="p-4">
                        {item.tsm || "N/A "}m away from the Entry
                      </td>
                      <td className="p-4">
                        {item.analysis || "N/A "}&times;{item.y_cord || "N/A "}m
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default StoreVisitTracking;
