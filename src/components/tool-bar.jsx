"use client"

import { MousePointer, Square, RectangleHorizontal, Undo, Redo } from "lucide-react"
import { Button } from "../components/ui/button"

export default function ToolBar({ selectedTool, setSelectedTool, clearCanvas, saveShapes }) {
  const tools = [
    { name: "pointer", icon: <MousePointer size={18} color="#333" />, bgColor: "bg-[#F3F4F6]" },
    { name: "rectangle", icon: <Square size={18} color="#333" />, bgColor: "bg-[#F3F4F6]" },
    // { name: "rectangle-h", icon: <RectangleHorizontal size={18} color="#333" />, bgColor: "bg-[#F3F4F6]" },
  ]

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex items-center gap-2">
      <div className="flex items-center gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.name}
            variant="ghost"
            size="icon"
            onClick={() => setSelectedTool(tool.name)}
            className={`${tool.bgColor} rounded-md h-9 w-9 ${selectedTool === tool.name ? " bg-[#6366F1] ring-2 ring-blue-300" : ""}`}
          >
            {tool.icon}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-1">
        <Button variant="ghost" size="icon" className="bg-[#F3F4F6] rounded-md h-9 w-9">
          <Undo size={18} color="#333" />
        </Button>
        <Button variant="ghost" size="icon" className="bg-[#F3F4F6] rounded-md h-9 w-9">
          <Redo size={18} color="#333" />
        </Button>
      </div>

      <div className="flex items-center gap-2 ml-2">
        <Button variant="outline" onClick={clearCanvas} className="rounded-md h-9 px-4 text-sm font-medium text-black">
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
  )
}

