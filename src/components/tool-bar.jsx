"use client"

import { Pen, Eraser, Minus, Square, Circle, Type, Trash2, Save } from "lucide-react"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { useState } from "react"

export default function ToolBar({
  selectedTool,
  setSelectedTool,
  color,
  setColor,
  lineWidth,
  setLineWidth,
  clearCanvas,
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  const tools = [
    { name: "pen", icon: <Pen size={20} /> },
    { name: "eraser", icon: <Eraser size={20} /> },
    { name: "line", icon: <Minus size={20} /> },
    { name: "rectangle", icon: <Square size={20} /> },
    { name: "circle", icon: <Circle size={20} /> },
    { name: "text", icon: <Type size={20} /> },
  ]

  const colors = [
    "#000000", // Black
    "#FF0000", // Red
    "#00FF00", // Green
    "#0000FF", // Blue
    "#FFFF00", // Yellow
    "#FF00FF", // Magenta
    "#00FFFF", // Cyan
  ]

  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-2 flex items-center gap-2">
      <div className="flex items-center gap-2">
        {tools.map((tool) => (
          <Button
            key={tool.name}
            variant={selectedTool === tool.name ? "default" : "ghost"}
            size="icon"
            onClick={() => setSelectedTool(tool.name)}
            className="rounded-full h-10 w-10"
          >
            {tool.icon}
          </Button>
        ))}
      </div>

      <div className="h-6 w-px bg-gray-200 mx-1" />

      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {colors.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full ${color === c ? "ring-2 ring-gray-400" : ""}`}
              style={{ backgroundColor: c }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-full h-10 w-10"
          >
            <div className="w-5 h-5 rounded-full border border-gray-400 flex items-center justify-center">
              <div
                className="rounded-full bg-black"
                style={{
                  width: `${Math.min(lineWidth * 2, 16)}px`,
                  height: `${Math.min(lineWidth * 2, 16)}px`,
                }}
              />
            </div>
          </Button>

          {isExpanded && (
            <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg p-3 w-48">
              <Slider value={[lineWidth]} min={1} max={20} step={1} onValueChange={(value) => setLineWidth(value[0])} />
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-gray-200 mx-1" />

        <Button variant="ghost" size="icon" onClick={clearCanvas} className="rounded-full h-10 w-10">
          <Trash2 size={20} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            // Save functionality would go here
            alert("Save functionality would be implemented here")
          }}
          className="rounded-full h-10 w-10"
        >
          <Save size={20} />
        </Button>
      </div>
    </div>
  )
}

