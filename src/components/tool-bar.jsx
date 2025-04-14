"use client";
import React from "react";
import { useRef } from "react";
import {
  MousePointer,
  Square,
  BrickWall,
  Undo,
  Redo,
  CircleFadingPlus,
  Circle
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

export default function ToolBar({
  selectedTool,
  setSelectedTool,
  clearCanvas,
  saveShapes,
  isOpenSpaceMode,  // Add this prop
  setIsOpenSpaceMode, // Add this prop
  handleImage
}) {
  const tools = [
    { name: "pointer", icon: <MousePointer size={18} color="#333" /> },
    { name: "rectangle", icon: <Square size={18} color="#333" /> },
    { name: "circle", icon: <Circle size={18} color="#333" /> },
    {
      name: "walls",
      icon: (
        <img
          src="/walls.svg"
          style={{
            filter:
              selectedTool === "walls"
                ? "invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)"
                : "none",
          }}
          size={18}
          color="#333"
        />
      ),
    },
    {
      name: "delete",
      icon: (
        <img
          src="/bin.svg"
          style={{
            filter:
              selectedTool === "delete"
                ? "invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)"
                : "none",
          }}
          size={18}
          color="#333"
        />
      ),
    },
    {
      name: "fill",
      icon: (
        <img
          src="/paint-bucket.svg"
          style={{
            filter:
              selectedTool === "fill"
                ? "invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)"
                : "none",
          }}
          size={18}
          color="#333"
        />
      ),
    },
    {
      name: "open-space",
      icon: (
        <img
          src="/open-space.svg"
          style={{
            filter:
              selectedTool === "open-space"
                ? "invert(100%) sepia(100%) saturate(0%) hue-rotate(180deg)"
                : "none",
          }}
          size={18}
          color="#333"
        />
      ),
    },
    // { name: "rectangle-h", icon: <RectangleHorizontal size={18} color="#333" />, bgColor: "bg-[#F3F4F6]" },
  ];

  const inputRef = useRef(null);

  const handleUploadClick = () => {
    inputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if(file) handleImage(file)
  };

  const handleToolClick = (toolName) => {
    if (toolName === "open-space") {
      setIsOpenSpaceMode(!isOpenSpaceMode);
    } else {
      setSelectedTool(toolName);
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 pl-4 pr-4 flex items-center gap-2">
      <div className="flex items-center gap-2 mr-6">
        {tools.map((tool) => (
          <div className="relative group">
          <Button
          key={tool.name}
          variant="ghost"
          size="icon"
          onClick={() => handleToolClick(tool.name)}
          className={`rounded-md h-9 w-9 ${
            (tool.name === "open-space" && isOpenSpaceMode) || selectedTool === tool.name
              ? "bg-[#6366F1] ring-2 ring-blue-300 hover:bg-[#6366F1]"
              : ""
          }`}
        >
              {React.cloneElement(tool.icon, {
                color: (tool.name === "open-space" && isOpenSpaceMode) || selectedTool === tool.name ? "#FFF" : "#333",
              })}
            </Button>
            <div className="absolute w-[100px] bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-10">
              {/* Arrow */}
              <div className="w-2 h-2 bg-gray-800 rounded-[2px] rotate-45 translate-y-[27px]"></div>
              {/* Tooltip box */}
              <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md">
                {tool.name}
              </div>
            </div>
          </div>
        ))}
        <div className="flex space-x-2">
          <div>
            <input type="file" id="upload" accept="image/*" ref={inputRef} onChange={handleImageUpload} className="hidden"/>
            <Button className={`rounded-md bg-[#F0F4FF] text-[#717AEA] relative hover:bg-[]`} onClick={handleUploadClick}>
              <span className="flex justify-between">
                <img src="/upload.svg" className="mr-2" /> Upload
              </span>
            </Button>
          </div>
          <div className="group">
            <Button className={`rounded-md bg-[#F0F4FF] text-[#717AEA] relative hover:bg-[] ${selectedTool === "start-point"
                  ? "bg-[#6366F1] ring-2 ring-blue-300"
                  : "hover:bg-[#F3F4F6]"}`} 
              onClick={() => handleToolClick("start-point")}
            >
              <CircleFadingPlus size={18} color={selectedTool === "start-point" ? "white": "black"} />
            </Button>
            <div className="absolute w-[150px] bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center z-10">
              {/* Arrow */}
              <div className="w-2 h-2 bg-gray-800 rounded-[2px] rotate-45 translate-y-[27px]"></div>
              {/* Tooltip box */}
              <div className="bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-md ">
                Pick Starting Point
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* <div className="flex items-center gap-2 ml-1">
        <Button variant="ghost" size="icon" className="bg-[#F3F4F6] rounded-md h-9 w-9">
          <Undo size={18} color="#333" />
        </Button>
        <Button variant="ghost" size="icon" className="bg-[#F3F4F6] rounded-md h-9 w-9">
          <Redo size={18} color="#333" />
        </Button>
      </div> */}

      <div className="flex items-center gap-2 ml-2">
        <Button
          variant="outline"
          onClick={clearCanvas}
          className="rounded-md h-9 px-4 text-sm font-medium text-black"
        >
          Discard
        </Button>
        <Button
          variant="default"
          onClick={saveShapes}
          className="rounded-md h-9 px-4 bg-[#6366F1] hover:bg-[#5558E3] text-sm font-medium"
        >
          Save
        </Button>
      </div>
    </div>
  );
}
