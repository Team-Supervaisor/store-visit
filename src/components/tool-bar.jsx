"use client"

import { Square, Type, Trash2, Save } from "lucide-react"
import { Button } from "../components/ui/button"

export default function ToolBar({ selectedTool, setSelectedTool, clearCanvas, saveShapes }) {
  const tools = [
    { name: "rectangle", icon: <Square size={20} color="black" /> },
    { name: "text", icon: <Type size={20} color="black" /> },
    
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

      <Button variant="ghost" size="icon" onClick={clearCanvas} className="rounded-full h-10 w-10">
  <Trash2 size={20} color="black" />
</Button>

<Button variant="ghost" size="icon" onClick={saveShapes} className="rounded-full h-10 w-10">
  <Save size={20} color="black" />
</Button>
    </div>
  )
}

