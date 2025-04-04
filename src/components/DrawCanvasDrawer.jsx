"use client"

import { useEffect, useRef, useState } from "react"
import ToolBar from "./tool-bar"

export default function DrawingCanvas() {
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState(null)
  const [selectedTool, setSelectedTool] = useState("rectangle")
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    startX: 0,
    startY: 0,
  })
  const [shapes, setShapes] = useState([])
  const [nextId, setNextId] = useState(1)
  const [textInput, setTextInput] = useState({
    isActive: false,
    x: 0,
    y: 0,
    text: "",
  })

  // Canvas dimensions and coordinate system
  const canvasWidth = 1000 // -500 to +500
  const canvasHeight = 500 // -250 to +250

  // Convert canvas coordinates to our coordinate system
  const toCoordX = (canvasX) => {
    return canvasX - canvasWidth / 2
  }

  const toCoordY = (canvasY) => {
    return -1 * (canvasY - canvasHeight / 2)
  }

  // Convert our coordinate system to canvas coordinates
  const toCanvasX = (coordX) => {
    return coordX + canvasWidth / 2
  }

  const toCanvasY = (coordY) => {
    return -1 * coordY + canvasHeight / 2
  }

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set fixed canvas size
    canvas.width = canvasWidth
    canvas.height = canvasHeight

    // Set up context
    const context = canvas.getContext("2d")
    if (context) {
      context.lineCap = "round"
      context.lineJoin = "round"
      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, canvas.width, canvas.height)
      setCtx(context)
    }
  }, [])

  // Draw all shapes
  useEffect(() => {
    if (!ctx || !canvasRef.current) return

    // Clear canvas
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    // Draw all shapes
    shapes.forEach((shape) => {
      if (shape.type === "rectangle") {
        ctx.strokeStyle = "#000000"
        ctx.lineWidth = 2
        ctx.strokeRect(toCanvasX(shape.x), toCanvasY(shape.y), shape.width, shape.height)

        // Draw ID in the top-left corner of the rectangle
        ctx.fillStyle = "#000000"
        ctx.font = "12px Arial"
        ctx.fillText(`ID: ${shape.id}`, toCanvasX(shape.x) + 5, toCanvasY(shape.y) + 15)
      } else if (shape.type === "text") {
        ctx.fillStyle = "#000000"
        ctx.font = "16px Arial"
        ctx.fillText(shape.text, toCanvasX(shape.x), toCanvasY(shape.y))
      }
    })
  }, [shapes, ctx])

  // Handle mouse events
  const startDrawing = (e) => {
    if (!ctx) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    if (selectedTool === "rectangle") {
      setDrawingState({
        isDrawing: true,
        startX: canvasX,
        startY: canvasY,
      })
    } else if (selectedTool === "text") {
      // Position for new text
      setTextInput({
        isActive: true,
        x: toCoordX(canvasX),
        y: toCoordY(canvasY),
        text: "",
      })
    }
  }

  const draw = (e) => {
    if (!drawingState.isDrawing || !ctx || !canvasRef.current || selectedTool !== "rectangle") return

    // This would be for a live preview while drawing, but we'll skip it for simplicity
  }

  const stopDrawing = (e) => {
    if (!ctx || !drawingState.isDrawing || !canvasRef.current || selectedTool !== "rectangle") return

    const rect = canvasRef.current.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    // Calculate rectangle properties
    const width = canvasX - drawingState.startX
    const height = canvasY - drawingState.startY

    // Only add if it has some size
    if (Math.abs(width) > 5 && Math.abs(height) > 5) {
      // Convert to our coordinate system
      const x = toCoordX(drawingState.startX)
      const y = toCoordY(drawingState.startY)

      // Add new rectangle to shapes
      const newRectangle = {
        id: nextId,
        type: "rectangle",
        x: x,
        y: y,
        width: width,
        height: -height, // Flip height due to canvas y-axis being inverted
        vertices: [
          { x: x, y: y },
          { x: x + width, y: y },
          { x: x + width, y: y - height },
          { x: x, y: y - height },
        ],
      }

      setShapes([...shapes, newRectangle])
      setNextId(nextId + 1)
    }

    setDrawingState({ ...drawingState, isDrawing: false })
  }

  const handleTextSubmit = (text) => {
    if (text.trim() === "") {
      setTextInput({ isActive: false, x: 0, y: 0, text: "" })
      return
    }

    // Add new text to shapes
    const newText = {
      id: nextId,
      type: "text",
      x: textInput.x,
      y: textInput.y,
      text: text,
    }

    setShapes([...shapes, newText])
    setNextId(nextId + 1)
    setTextInput({ isActive: false, x: 0, y: 0, text: "" })
  }

  const clearCanvas = () => {
    setShapes([])
  }

  const saveShapes = () => {
    // Extract rectangle coordinates
    const rectangleData = shapes
      .filter((shape) => shape.type === "rectangle")
      .map((rect) => ({
        id: rect.id,
        type: "rectangle",
        vertices: rect.vertices,
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
      }))

    console.log("Saved Shapes:", rectangleData)
  }

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] flex flex-col items-center justify-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="bg-white shadow-md rounded-lg cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />

        {textInput.isActive && (
          <div
            className="absolute bg-white p-2 rounded shadow-md"
            style={{
              left: toCanvasX(textInput.x),
              top: toCanvasY(textInput.y),
            }}
          >
            <input
              type="text"
              className="border p-1 text-sm"
              placeholder="Enter text"
              autoFocus
              onChange={(e) => setTextInput({ ...textInput, text: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTextSubmit(textInput.text)
                } else if (e.key === "Escape") {
                  setTextInput({ isActive: false, x: 0, y: 0, text: "" })
                }
              }}
            />
            <div className="flex mt-1 gap-1">
              <button
                className="bg-gray-200 text-xs px-2 py-1 rounded"
                onClick={() => handleTextSubmit(textInput.text)}
              >
                Add
              </button>
              <button
                className="bg-gray-200 text-xs px-2 py-1 rounded"
                onClick={() => setTextInput({ isActive: false, x: 0, y: 0, text: "" })}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      <ToolBar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        clearCanvas={clearCanvas}
        saveShapes={saveShapes}
      />
    </div>
  )
}

