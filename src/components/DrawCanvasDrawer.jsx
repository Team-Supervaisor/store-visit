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
    currentX: 0,
    currentY: 0,
  })
  const [shapes, setShapes] = useState([])
  const [nextId, setNextId] = useState(1)
  const [textInput, setTextInput] = useState({
    isActive: false,
    x: 0,
    y: 0,
    text: "",
  })

  // Canvas dimensions - using natural canvas coordinates now
  const canvasWidth = 1000
  const canvasHeight = 500

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

  // Draw all shapes and preview
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
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)

        // Draw ID in the top-left corner of the rectangle
        ctx.fillStyle = "#000000"
        ctx.font = "12px Arial"
        ctx.fillText(`ID: ${shape.id}`, shape.x + 5, shape.y + 15)
      } else if (shape.type === "text") {
        ctx.fillStyle = "#000000"
        ctx.font = "16px Arial"
        ctx.fillText(shape.text, shape.x, shape.y)
      }
    })

    // Draw preview shape if currently drawing
    if (drawingState.isDrawing && selectedTool === "rectangle") {
      const width = drawingState.currentX - drawingState.startX
      const height = drawingState.currentY - drawingState.startY

      // Draw preview with semi-transparent style
      ctx.strokeStyle = "rgba(99, 102, 241, 0.6)" // Purple with transparency
      ctx.lineWidth = 2
      ctx.setLineDash([5, 3]) // Dashed line for preview
      ctx.strokeRect(drawingState.startX, drawingState.startY, width, height)

      // Fill with very light color
      ctx.fillStyle = "rgba(99, 102, 241, 0.1)" // Very light purple
      ctx.fillRect(drawingState.startX, drawingState.startY, width, height)

      // Reset line dash
      ctx.setLineDash([])
    }
  }, [shapes, ctx, drawingState])

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
        currentX: canvasX,
        currentY: canvasY,
      })
    } else if (selectedTool === "text") {
      // Position for new text
      setTextInput({
        isActive: true,
        x: canvasX,
        y: canvasY,
        text: "",
      })
    }
  }

  const draw = (e) => {
    if (!drawingState.isDrawing || !ctx || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    if (selectedTool === "rectangle") {
      // Update current position for preview
      setDrawingState({
        ...drawingState,
        currentX: canvasX,
        currentY: canvasY,
      })
    }
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
      // Add new rectangle to shapes using raw canvas coordinates
      const newRectangle = {
        id: nextId,
        type: "rectangle",
        x: drawingState.startX,
        y: drawingState.startY,
        width: width,
        height: height,
        vertices: [
          { x: drawingState.startX, y: drawingState.startY },
          { x: drawingState.startX + width, y: drawingState.startY },
          { x: drawingState.startX + width, y: drawingState.startY + height },
          { x: drawingState.startX, y: drawingState.startY + height },
        ],
      }

      setShapes([...shapes, newRectangle])
      setNextId(nextId + 1)
    }

    setDrawingState({
      isDrawing: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
    })
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
              left: textInput.x,
              top: textInput.y,
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

