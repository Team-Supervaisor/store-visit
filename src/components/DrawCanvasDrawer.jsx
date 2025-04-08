"use client"

import { useEffect, useRef, useState } from "react"
import ToolBar from "./tool-bar"
import { ChevronDown, X } from "lucide-react"

const tagOptions = [
  { id: "1", title: "Tag 1" },
  { id: "2", title: "Tag 2" },
  { id: "3", title: "Tag 3" },
]

const visibilityOptions = [
  { id: "1", title: "Low" },
  { id: "2", title: "Medium" },
  { id: "3", title: "High" },
]

const cursorMap = {
  pointer: "cursor-pointer",
  rectangle: "cursor-crosshair",
  delete: 'custom-bin',
  fill: 'custom-fill',
};


export default function DrawingCanvas({ isOpen, onClose, onSaveShapes, instruction_data }) {
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
    tag: "",
    visibility: "",
  })
  // Track all selected instructions to manage availability
  const [selectedInstructions, setSelectedInstructions] = useState({})
  // Track available instructions for each shape
  const [availableInstructions, setAvailableInstructions] = useState({})

  const canvasWidth = 1000
  const canvasHeight = 500

  // Initialize available instructions when instruction_data changes
  useEffect(() => {
    if (instruction_data) {
      const initialAvailable = {}
      // For each shape, set all instructions as initially available
      shapes.forEach(shape => {
        initialAvailable[shape.id] = instruction_data.map(item => item.id)
      })
      setAvailableInstructions(initialAvailable)
    }
  }, [instruction_data, shapes.length])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const context = canvas.getContext("2d")
    if (context) {
      context.lineCap = "round"
      context.lineJoin = "round"
      setCtx(context)
    }
  }, [])


  useEffect(() => {
    if (!ctx || !canvasRef.current) return

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)

    ctx.save()
    ctx.translate(canvasWidth / 2, canvasHeight / 2)

    shapes.forEach((shape) => {
      if (shape.type === "rectangle") {
        if (selectedShape && selectedShape.id === shape.id) {
          ctx.strokeStyle = "#6366F1" 
          ctx.lineWidth = 2.5
        } else {
          ctx.strokeStyle = "#000000"
          ctx.lineWidth = 2
        }

        // Draw the rectangle
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height)
        
        // Draw ID text
        ctx.fillStyle = "#000000"
        ctx.font = "12px Arial"

        // Draw name if it exists
        if (shape.name) {
          ctx.fillStyle = "#6366F1"
          ctx.font = "14px Arial"
          const textWidth = ctx.measureText(shape.name).width;
          const textHeight = 14; // Approximate text height for 14px font
          const centerX = shape.x + shape.width / 2;
          const centerY = shape.y + shape.height / 2;
          ctx.fillText(shape.name, centerX - textWidth / 2, centerY + textHeight / 2);
        }

        if(shape.isColored) {
          ctx.fillStyle = "#6366F1"
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height)
        }
      } else if (shape.type === "text") {
        ctx.fillStyle = selectedShape && selectedShape.id === shape.id ? "#6366F1" : "#000000"
        ctx.font = "16px Arial"
        ctx.fillText(shape.text, shape.x, shape.y)
      }
    })

    if (drawingState.isDrawing && selectedTool === "rectangle") {
      const width = drawingState.currentX - drawingState.startX
      const height = drawingState.currentY - drawingState.startY

      ctx.strokeStyle = "rgba(99, 102, 241, 0.6)"
      ctx.lineWidth = 2
      ctx.setLineDash([5, 3])
      ctx.strokeRect(drawingState.startX, drawingState.startY, width, height)

      ctx.fillStyle = "rgba(99, 102, 241, 0.1)"
      ctx.fillRect(drawingState.startX, drawingState.startY, width, height)

      ctx.setLineDash([])
    }
    ctx.restore()
  }, [shapes, ctx, drawingState, selectedShape])

  // Update available instructions when selectedInstructions change
  useEffect(() => {
    if (!instruction_data) return;
    
    // Create a new object for available instructions
    const newAvailable = {};
    
    shapes.forEach(shape => {
      // Get all instruction IDs
      const allInstructionIds = instruction_data.map(item => item.id);
      
      // Filter out instructions that are selected by other shapes
      const availableForShape = allInstructionIds.filter(id => {
        // Include if it's this shape's current selection
        if (selectedInstructions[shape.id] === id) return true;
        // Or if it's not selected by any other shape
        return !Object.values(selectedInstructions).includes(id);
      });
      
      newAvailable[shape.id] = availableForShape;
    });
    
    setAvailableInstructions(newAvailable);
  }, [selectedInstructions, shapes, instruction_data]);

  const getCustomCoordinates = (e) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return { x: 0, y: 0 }
    const x = e.clientX - rect.left - canvasWidth / 2
    const y = e.clientY - rect.top - canvasHeight / 2
    return { x, y }
  }

  const findShapeAtPosition = (x, y) => {
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i]

      if (shape.type === "rectangle") {
        // Normalize rectangle coordinates for hit testing
        const normalizedRect = {
          x: shape.width < 0 ? shape.x + shape.width : shape.x,
          y: shape.height < 0 ? shape.y + shape.height : shape.y,
          width: Math.abs(shape.width),
          height: Math.abs(shape.height)
        }
        
        if (
          x >= normalizedRect.x && 
          x <= normalizedRect.x + normalizedRect.width && 
          y >= normalizedRect.y && 
          y <= normalizedRect.y + normalizedRect.height
        ) {
          return shape
        }
      } else if (shape.type === "text") {
        const textWidth = ctx.measureText(shape.text).width
        if (x >= shape.x && x <= shape.x + textWidth && y >= shape.y - 16 && y <= shape.y) {
          return shape
        }
      }
    }
    return null
  }

  const startDrawing = (e) => {
    if (!ctx) return

    const { x: canvasX, y: canvasY } = getCustomCoordinates(e)

    if (selectedTool === "pointer") {
      const clickedShape = findShapeAtPosition(canvasX, canvasY)

      if (clickedShape) {
        setSelectedShape(clickedShape)
        
        // Calculate the center of the rectangle properly for dialog positioning
        const normalizedRect = {
          x: clickedShape.width < 0 ? clickedShape.x + clickedShape.width : clickedShape.x,
          y: clickedShape.height < 0 ? clickedShape.y + clickedShape.height : clickedShape.y,
          width: Math.abs(clickedShape.width),
          height: Math.abs(clickedShape.height)
        }
        
        const centerX = normalizedRect.x + (normalizedRect.width / 2)
        const centerY = normalizedRect.y + (normalizedRect.height / 2)
        
        setShapeDialog({
          isOpen: true,
          x: centerX + canvasWidth / 2,
          y: centerY + canvasHeight / 2,
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

    const { x: canvasX, y: canvasY } = getCustomCoordinates(e)

    if (selectedTool === "rectangle") {
      setDrawingState({
        ...drawingState,
        currentX: canvasX,
        currentY: canvasY,
      })
    }
  }

  const handleCanvasClick = (e) => {
    if (selectedTool !== "delete") return;

    const { x: canvasX, y: canvasY } = getCustomCoordinates(e)

    // console.log("Click coordinates:", clickX, clickY);
    for (let i = 0; i < shapes.length; i++) {
      const shape = shapes[i];
      console.log(shape.x, shape.y, shape.width, shape.height);
    }

    const clickedRect = shapes.find(
      (r) =>
        canvasX >= r.x &&
        canvasX <= r.x + r.width &&
        canvasY >= r.y &&
        canvasY <= r.y + r.height
    );

    if (clickedRect) {
      // Remove the rectangle
      setShapes((prevRects) =>
        prevRects.filter((r) => r.id !== clickedRect.id)
      );
    }
  };

  const handleFill = (e) => {
    if (selectedTool !== "fill") return;
    const { x: canvasX, y: canvasY } = getCustomCoordinates(e)
    console.log("Click coordinates:", canvasX, canvasY);
    console.log("ClickX" )

    const clickedRect = shapes.find(
      (r) =>
        canvasX >= r.x &&
        canvasX <= r.x + r.width &&
        canvasY >= r.y &&
        canvasY <= r.y + r.height
    );


    
    if (clickedRect) {
      // Update the rectangle's color property
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === clickedRect.id
            ? { ...shape, color: "#6366F1", isColored: true }
            : shape
        )
      );
      // Fill the rectangle with a color
      ctx.fillStyle = "#6366F1";
      ctx.fillRect(clickedRect.x + canvasWidth / 2, clickedRect.y + canvasHeight / 2, clickedRect.width, clickedRect.height);
    }
  }

  const stopDrawing = (e) => {
    if (!ctx || !drawingState.isDrawing || !canvasRef.current || selectedTool !== "rectangle") return

    const { x: canvasX, y: canvasY } = getCustomCoordinates(e)
    const width = canvasX - drawingState.startX
    const height = canvasY - drawingState.startY
    
    // Only create rectangle if it has a reasonable size
    if (Math.abs(width) > 5 && Math.abs(height) > 5) {
      // Calculate the corner coordinates for vertices correctly
      const x1 = drawingState.startX;
      const y1 = drawingState.startY;
      const x2 = canvasX;
      const y2 = canvasY;
      
      // Calculate vertices in clockwise order regardless of drawing direction
      const vertices = [
        [Math.min(x1, x2), -Math.min(y1, y2)],
        [Math.min(x1, x2), -Math.max(y1, y2)],
        [Math.max(x1, x2), -Math.max(y1, y2)],
        [Math.max(x1, x2), -Math.min(y1, y2)],
      ];
      
      const newRectangle = {
        id: nextId,
        type: "rectangle",
        x: drawingState.startX,
        y: drawingState.startY,
        width: width,
        height: height,
        vertices: vertices,
        isColored: false,
      }
      
      setShapes([...shapes, newRectangle])
      
      // Add entry in availableInstructions for the new shape
      if (instruction_data) {
        setAvailableInstructions(prev => ({
          ...prev,
          [nextId]: instruction_data
            .map(item => item.id)
            .filter(id => !Object.values(selectedInstructions).includes(id))
        }));
      }
      
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

  const handleInstructionChange = (e) => {
    const newInstructionId = e.target.value;
    const shapeId = shapeDialog.shapeId;
    
    // Update the shapeDialog state
    setShapeDialog({ 
      ...shapeDialog, 
      instruction: newInstructionId 
    });
    
    // Update the selectedInstructions tracking
    setSelectedInstructions(prev => {
      const newSelected = { ...prev };
      
      // If empty/none selected, remove from tracking
      if (!newInstructionId) {
        delete newSelected[shapeId];
      } else {
        newSelected[shapeId] = newInstructionId;
      }
      
      return newSelected;
    });
  };

  const handleTagChange = (e) => {
    setShapeDialog({ 
      ...shapeDialog, 
      tag: e.target.value 
    });
  }

  const handleVisibilityChange = (e) => {
    setShapeDialog({ 
      ...shapeDialog, 
      visibility: e.target.value 
    });
  }

  const handleShapeDialogSave = () => {
    // Update the shape with the new name and instruction
    const updatedShapes = shapes.map((shape) => {
      if (shape.id === shapeDialog.shapeId) {
        return {
          ...shape,
          name: shapeDialog.name || "N/A",
          instruction: shapeDialog.instruction || "N/A",
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
    // Reset to previous instruction if dialog is closed without saving
    setShapeDialog({ ...shapeDialog, isOpen: false })
  }

  const clearCanvas = () => {
    setShapes([])
    setSelectedShape(null)
    setShapeDialog({ ...shapeDialog, isOpen: false })
    setSelectedInstructions({})
    setAvailableInstructions({})
  }

  const saveShapes = () => {
    const canvas = canvasRef.current;
    const canvasSnapshot = canvas.toDataURL("image/png");
    
    const rectangle = shapes
      .filter((shape) => shape.type === "rectangle")
      .map((rect) => {
        // Find the complete instruction data object based on the selected instruction ID
        const instructionData = rect.instruction && instruction_data.find(item => 
          item.id === rect.instruction
        );
        
        return {
          id: rect.id,
          vertices: rect.vertices,
          name: rect.name,
          // instruction: rect.instruction,
          // Include the full instruction data if it exists
          instructionData: instructionData || null
        };
      });
  
    if (onSaveShapes) {
      onSaveShapes({
        shapes: rectangle,
        snapshot: canvasSnapshot
      });
    }
    onClose();
  }

  // Get the filtered instruction options for the current shape
  const getFilteredInstructions = () => {
    if (!instruction_data || !shapeDialog.shapeId) return [];
    
    const currentShapeId = shapeDialog.shapeId;
    const availableIds = availableInstructions[currentShapeId] || [];
    
    // Always include currently selected instruction if any
    if (shapeDialog.instruction && !availableIds.includes(shapeDialog.instruction)) {
      availableIds.push(shapeDialog.instruction);
    }
    
    return instruction_data.filter(option => 
      availableIds.includes(option.id)
    );
  };

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] flex flex-col items-center justify-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          className={`bg-white shadow-md rounded-lg ${cursorMap[selectedTool] || "cursor-default"}`}
          onMouseDown={(e) => {
            handleCanvasClick(e);
            startDrawing(e); 
            handleFill(e);
          }}
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
              left: textInput.x + canvasWidth / 2,
              top: textInput.y + canvasHeight / 2,
            }}
          >
            <input
              type="text"
              className="border p-1 text-sm"
              placeholder="Enter text"
              autoFocus
              onChange={(e) =>
                setTextInput({ ...textInput, text: e.target.value })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTextSubmit(textInput.text);
                } else if (e.key === "Escape") {
                  setTextInput({ isActive: false, x: 0, y: 0, text: "" });
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
                onClick={() =>
                  setTextInput({ isActive: false, x: 0, y: 0, text: "" })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {shapeDialog.isOpen && (
          <div
            className="absolute bg-white p-6 rounded-xl shadow-lg w-[350px]"
            style={{
              left: `${shapeDialog.x}px`,
              top: `${shapeDialog.y}px`,
              transform: "translate(-50%, -50%)",
              border: "1px solid #E5E7EB",
            }}
          >
            {/* <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100"
              onClick={closeShapeDialog}
            >
              <X size={18} />
            </button> */}

            <div className="flex flex-col gap-4">
              {/* <div className="flex items-center justify-center mb-1">
                <span className="text-sm font-semibold bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                  ID: {shapeDialog.shapeId}
                </span>
              </div> */}
              <div className="flex items-center">
                <label className="font-medium text-gray-700 w-24">Name:</label>
                <div className="flex-1">
                  <input
                    id="storeName"
                    type="text"
                    placeholder="Enter the name of the Table"
                    value={shapeDialog.name}
                    onChange={(e) => setShapeDialog({ ...shapeDialog, name: e.target.value })}
                    className="w-full flex-1 border-b border-gray-300 px-1 py-1 focus:outline-none focus:border-indigo-500 text-black text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center">
                <label className="font-medium text-gray-700 w-24">
                  Visibility:
                </label>
                <div className="flex-1 relative">
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none text-[black]"
                    value={shapeDialog.visibility}
                    defaultValue={""}
                    onChange={handleVisibilityChange}
                  >
                    <option value="" disabled>
                      Select from below
                    </option>
                    {visibilityOptions.map((option) => (
                      <option
                        key={option.id}
                        value={option.id}
                        className="text-black-[500]"
                      >
                        {option.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <label className="font-medium text-gray-700 w-24">Tag:</label>
                <div className="flex-1 relative">
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none text-[black]"
                    value={shapeDialog.tag}
                    onChange={handleTagChange}
                    defaultValue={""}
                  >
                    <option value="" disabled>
                      Select from below
                    </option>
                    {tagOptions.map((option) => (
                      <option
                        key={option.id}
                        value={option.id}
                        className="text-black-[500]"
                      >
                        {option.title}
                      </option>
                    ))}
                  </select>

                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <label className="font-medium text-gray-700 w-24">
                  Instruction:
                </label>
                <div className="flex-1 relative">
                  <select
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm appearance-none text-[black]"
                    value={shapeDialog.instruction}
                    onChange={handleInstructionChange}
                  >
                    <option value="" disabled>
                      Select from below
                    </option>
                    {getFilteredInstructions().map((option) => (
                      <option
                        key={option.id}
                        value={option.id}
                        className="text-black-[500]"
                      >
                        {option.title}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm text-[black]"
                  onClick={closeShapeDialog}
                >
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
  );
}