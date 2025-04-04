"use client"

import { useEffect, useRef, useState } from "react"
import ToolBar from "./tool-bar"
import { ChevronDown, X } from "lucide-react"

export default function DrawingCanvas({ isOpen, onClose }) {
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
  const [selectedShape, setSelectedShape] = useState(null)
  const [shapeDialog, setShapeDialog] = useState({
    isOpen: false,
    x: 0,
    y: 0,
    shapeId: null,
    name: "",
    instruction: "",
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
        // Highlight selected shape
        if (selectedShape && selectedShape.id === shape.id) {
          ctx.strokeStyle = "#6366F1" // Purple for selected shape
          ctx.lineWidth = 2.5
        } else {
          ctx.strokeStyle = "#000000"
          ctx.lineWidth = 2
        }

        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)

        // Draw ID in the top-left corner of the rectangle
        ctx.fillStyle = "#000000"
        ctx.font = "12px Arial"
        ctx.fillText(`ID: ${shape.id}`, shape.x + 5, shape.y + 15)

        // If shape has a name, display it
        if (shape.name) {
          ctx.fillStyle = "#6366F1"
          ctx.font = "14px Arial"
          ctx.fillText(shape.name, shape.x + 5, shape.y + 35)
        }
      } else if (shape.type === "text") {
        ctx.fillStyle = selectedShape && selectedShape.id === shape.id ? "#6366F1" : "#000000"
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
  }, [shapes, ctx, drawingState, selectedShape])

  // Find shape at position
  const findShapeAtPosition = (x, y) => {
    // Check in reverse order (top-most shape first)
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i]

      if (shape.type === "rectangle") {
        // Check if point is inside rectangle
        if (x >= shape.x && x <= shape.x + shape.width && y >= shape.y && y <= shape.y + shape.height) {
          return shape
        }
      } else if (shape.type === "text") {
        // Simple hit test for text (could be improved)
        const textWidth = ctx.measureText(shape.text).width
        if (x >= shape.x && x <= shape.x + textWidth && y >= shape.y - 16 && y <= shape.y) {
          return shape
        }
      }
    }

    return null
  }

  // Handle mouse events
  const startDrawing = (e) => {
    if (!ctx) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const canvasX = e.clientX - rect.left
    const canvasY = e.clientY - rect.top

    if (selectedTool === "pointer") {
      // Check if we clicked on a shape
      const clickedShape = findShapeAtPosition(canvasX, canvasY)

      if (clickedShape) {
        setSelectedShape(clickedShape)

        // Open the shape dialog
        setShapeDialog({
          isOpen: true,
          x: clickedShape.x + clickedShape.width / 2,
          y: clickedShape.y + clickedShape.height / 2,
          shapeId: clickedShape.id,
          name: clickedShape.name || "",
          instruction: clickedShape.instruction || "",
        })
      } else {
        setSelectedShape(null)
        setShapeDialog({ ...shapeDialog, isOpen: false })
      }
    } else if (selectedTool === "rectangle") {
      setDrawingState({
        isDrawing: true,
        startX: canvasX,
        startY: canvasY,
        currentX: canvasX,
        currentY: canvasY,
      })
      setSelectedShape(null)
      setShapeDialog({ ...shapeDialog, isOpen: false })
    } else if (selectedTool === "text") {
      // Position for new text
      setTextInput({
        isActive: true,
        x: canvasX,
        y: canvasY,
        text: "",
      })
      setSelectedShape(null)
      setShapeDialog({ ...shapeDialog, isOpen: false })
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

  const handleShapeDialogSave = () => {
    // Update the shape with the new name and instruction
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === shapeDialog.shapeId) {
        return {
          ...shape,
          name: shapeDialog.name,
          instruction: shapeDialog.instruction,
        }
      }
      return shape
    })

    setShapes(updatedShapes)
    setShapeDialog({ ...shapeDialog, isOpen: false })

    console.log("Shape updated:", {
      shapeId: shapeDialog.shapeId,
      name: shapeDialog.name,
      instruction: shapeDialog.instruction,
    })
  }

  const closeShapeDialog = () => {
    setShapeDialog({ ...shapeDialog, isOpen: false })
  }

  const clearCanvas = () => {
    setShapes([])
    setSelectedShape(null)
    setShapeDialog({ ...shapeDialog, isOpen: false })
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
        name: rect.name,
        instruction: rect.instruction,
      }))

    console.log("Saved Shapes:", rectangleData)
  }

  // Instructions dropdown options
  const instructionOptions = ["Check inventory", "Restock items", "Clean area", "Verify pricing", "Arrange products"]

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] flex flex-col items-center justify-center">
      
      <div className="relative">
        
        <canvas
          ref={canvasRef}
          className={`bg-white shadow-md rounded-lg ${selectedTool === "pointer" ? "cursor-pointer" : "cursor-crosshair"}`}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
        />
        <button
    className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
    onClick={onClose}
  >
    <X size={18} />
  </button>

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

        {shapeDialog.isOpen && (
          <div
            className="absolute bg-white p-4 rounded-xl shadow-lg w-[350px]"
            style={{
              left: `${shapeDialog.x}px`,
              top: `${shapeDialog.y}px`,
              transform: "translate(-50%, -50%)",
              border: "1px solid #E5E7EB",
            }}
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
              onClick={closeShapeDialog}
            >
              <X size={18} />
            </button>

            <div className="flex flex-col gap-4 mt-[25px]">
              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700 w-24">Name</label>
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-[black]"
                    placeholder="Enter the name of the Table"
                    value={shapeDialog.name}
                    onChange={(e) => setShapeDialog({ ...shapeDialog, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="bg-[#6366F1] text-white text-sm px-3 py-1 rounded-md">Map to</button>
              </div>

              <div className="flex items-center gap-3">
                <label className="font-medium text-gray-700 w-24">Instruction</label>
                <div className="flex-1 relative">
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none text-[black]"
                    value={shapeDialog.instruction}
                    onChange={(e) => setShapeDialog({ ...shapeDialog, instruction: e.target.value })}
                  >
                    <option value="" disabled>
                      Select from below
                    </option>
                    {instructionOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-[black]" onClick={closeShapeDialog}>
                  Cancel
                </button>
                <button
                  className="px-3 py-1 bg-[#6366F1] text-white rounded-md text-sm"
                  onClick={handleShapeDialogSave}
                >
                  Save
                </button>
              </div>
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

