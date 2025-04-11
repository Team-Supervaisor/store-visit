"use client"

import { useEffect, useRef, useState } from "react"
import ToolBar from "./tool-bar"
import { ChevronDown, X, PencilIcon, Trash2 } from "lucide-react"
import OverlayAddStore from "./OverlayAddStore";

const tagOptions = [
  { id: "cashier", title: "Cashier" ,color:"red"},
  { id: "open space", title: "Open Space",color:"yellow"},
  { id:'table', title: "Table",color:"blue"},
  { id: "entry gate", title: "Entry Gate" ,color:"green"},
]

const visibilityOptions = [
  { id: "low", title: "Low" },
  { id: "medium", title: "Medium" },
  { id: "high", title: "High" },
]

const cursorMap = {
  pointer: "cursor-pointer",
  rectangle: "cursor-crosshair",
  delete: 'custom-bin',
  fill: 'custom-fill',
};

export default function DrawingCanvas({ errorMessage, setErrorMessage, successMessage, showStatusModal, setShowStatusModal, handleClose, isSuccess, isOpen, onClose, onSaveShapes, instruction_data, shapes, setShapes, backgroundImage, setBackgroundImage, planogramWidth, planogramLength, setUploadImage, nextId, setNextId, clickPosition, setClickPosition}) {
  const canvasRef = useRef(null)
  const [fillColor, setFillColor] = useState("#000000")
  const [ctx, setCtx] = useState(null)
  const [hoveredShape, setHoveredShape] = useState(null);
  const [selectedTool, setSelectedTool] = useState("rectangle")
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
  })
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
  const [isOpenSpaceMode, setIsOpenSpaceMode] = useState(false);

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

  // useEffect(() => {
  //   if (backgroundImage && canvasRef.current) {
  //     const canvas = canvasRef.current;
  //     const ctx = canvas.getContext("2d");
  //     ctx.clearRect(0, 0, canvas.width, canvas.height);
  //     ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  //   }
  // }, [backgroundImage]);

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

  const drawRulers = (ctx) => {
    if(!ctx || !planogramLength || !planogramWidth) return
    ctx.font = "10px Arial";
    ctx.fillStyle = "black";
    ctx.strokeStyle = "gray";

    // X-axis (top)
    const xStep = canvasWidth / planogramWidth;
    const xIncrement = Math.floor(planogramWidth / 5);
    for (let i = xIncrement; i <= planogramWidth; i += xIncrement) {
      const x = i * xStep - 510;
      ctx.beginPath();
      ctx.moveTo(x, -250);
      ctx.lineTo(x, -240);
      ctx.stroke();
      ctx.fillText(`${i}ft`, x-7, -230);
    }

    // Y-axis (left)
    const yStep = canvasHeight / planogramLength;
    const yIncrement = Math.floor(planogramLength / 5);
    for (let i = yIncrement; i <= planogramLength; i += yIncrement) {
      const y = i * yStep - 250;
      ctx.beginPath();
      ctx.moveTo(-500, y-10);
      ctx.lineTo(-490, y-10);
      ctx.stroke();
      ctx.fillText(`${i}ft`, -487, y -5);
    }
  };


  useEffect(() => {
    if (!ctx || !canvasRef.current) return

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    ctx.save();
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    if (backgroundImage && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.clearRect(-500, -250, canvas.width, canvas.height);
      ctx.drawImage(backgroundImage, -500, -250, canvas.width, canvas.height);
    }


      // First draw open space rectangles (they go behind)
  shapes.forEach((shape) => {
    if (shape.type === "rectangle" && shape.isOpenSpace) {
      // Create clipping region from non-open space shapes
      ctx.save();
      ctx.beginPath();
      
      // Start with full canvas
      ctx.rect(-canvasWidth/2, -canvasHeight/2, canvasWidth, canvasHeight);
      
      // Subtract all regular shapes and walls
      shapes.forEach(otherShape => {
        if ((otherShape.type === "rectangle" || otherShape.type === "brick") && !otherShape.isOpenSpace) {
          ctx.rect(otherShape.x, otherShape.y, otherShape.width, otherShape.height);
        }
      });
      
      ctx.clip("evenodd"); // Use even-odd rule for clipping

      // Draw open space with transparent yellow
      ctx.fillStyle = "rgba(255, 243, 168, 0.3)";
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 2;
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);


      // if (shape.name) {
      //   ctx.fillStyle = "#000000";
      //   ctx.font = "14px Arial";
      //   const textWidth = ctx.measureText(shape.name).width;
      //   const textHeight = 14;
      //   const centerX = shape.x + shape.width / 2;
      //   const centerY = shape.y + shape.height / 2;
        
      //   // Save context before drawing text
      //   ctx.save();
      //   // Draw text above the clipping mask
      //   ctx.restore();
      //   ctx.fillText(
      //     shape.name,
      //     centerX - textWidth / 2,
      //     centerY + textHeight / 2
      //   );
      // }
      
      ctx.restore();
    }
  });

    // Then draw regular shapes and walls
    shapes.forEach((shape) => {
      if ((shape.type === "rectangle" || shape.type === "brick") && !shape.isOpenSpace) {
        // Draw regular shapes
        if (selectedShape && selectedShape.id === shape.id) {
          ctx.strokeStyle = "#6366F1";
          ctx.lineWidth = 2.5;
        } else {
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = 2;
        }

        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);

        // Add transparent gray background in open space mode
        if (isOpenSpaceMode) {
          ctx.fillStyle = "rgba(225, 225, 225, 0.3)";
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }
        // Draw ID text
        ctx.fillStyle = "#000000"
        ctx.font = "12px Arial"

        // Draw name if it exists

        if (shape.isBricked) {
          // Normalize rectangle coordinates for proper filling
          const normalizedRect = {
            x: shape.width < 0 ? shape.x + shape.width : shape.x,
            y: shape.height < 0 ? shape.y + shape.height : shape.y,
            width: Math.abs(shape.width),
            height: Math.abs(shape.height),
          };

          // Save the current context state
          ctx.save();

          // Create a clipping path for the rectangle
          ctx.beginPath();
          ctx.rect(
            normalizedRect.x,
            normalizedRect.y,
            normalizedRect.width,
            normalizedRect.height
          );
          ctx.clip();

          // Set the brick color
          ctx.fillStyle = "#8897F1";

          // Draw the brick pattern within the clipped area
          const brickWidth = 20;
          const brickHeight = 10;

          for (
            let y = normalizedRect.y;
            y < normalizedRect.y + normalizedRect.height;
            y += brickHeight * 2
          ) {
            // First row of bricks
            for (
              let x = normalizedRect.x;
              x < normalizedRect.x + normalizedRect.width;
              x += brickWidth
            ) {
              ctx.fillRect(x, y, brickWidth - 2, brickHeight - 1);
            }

            // Second row of bricks (offset)
            for (
              let x = normalizedRect.x - brickWidth / 2;
              x < normalizedRect.x + normalizedRect.width;
              x += brickWidth
            ) {
              ctx.fillRect(x, y + brickHeight, brickWidth - 2, brickHeight - 1);
            }
          }

          // Restore the context to remove the clipping path
          ctx.restore();
        }

        if (shape.isColored) {
          ctx.fillStyle = shape.color;
          ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        }

        if (shape.name) {
          ctx.fillStyle = "#000000"
          ctx.font = "14px Arial"
          const textWidth = ctx.measureText(shape.name).width;
          const textHeight = 14; // Approximate text height for 14px font
          const centerX = shape.x + shape.width / 2;
          const centerY = shape.y + shape.height / 2;
          ctx.fillText(
            shape.name,
            centerX - textWidth / 2,
            centerY + textHeight / 2
          );
        }
      } else if (shape.type === "text") {
        ctx.fillStyle = selectedShape && selectedShape.id === shape.id ? "#6366F1" : "#000000"
        ctx.font = "16px Arial"
        ctx.fillText(shape.text, shape.x, shape.y)
      }
    })

    

   
    if (drawingState.isDrawing && (selectedTool === "rectangle" || selectedTool === "walls")) {
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
    drawRulers(ctx);

    if(clickPosition){
      const { x: canvasX, y: canvasY } = clickPosition;
      console.log(canvasX, canvasY)
      const size = 5; // Length of half the plus lines

      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
  
      // Vertical line
      ctx.beginPath();
      ctx.moveTo(canvasX, canvasY - size);
      ctx.lineTo(canvasX, canvasY + size);
      ctx.stroke();
  
      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(canvasX - size, canvasY);
      ctx.lineTo(canvasX + size, canvasY);
      ctx.stroke();
    }

    // Rest of your existing drawing code...
    ctx.restore();
  }, [shapes, ctx, drawingState, selectedShape, backgroundImage, isOpenSpaceMode]);

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
          // Allow hovering on both regular rectangles and open space rectangles
          if (!shape.isBricked) {
            return shape;
          }
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

  const handleEditShape = () => {
    const clickedShape = hoveredShape;
    setHoveredShape(null);
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
  }

  const startDrawing = (e) => {
    if (!ctx) return

    const { x: canvasX, y: canvasY } = getCustomCoordinates(e)

    if (selectedTool === "pointer") {
      const clickedShape = findShapeAtPosition(canvasX, canvasY)
      setHoveredShape(null)
      if (clickedShape && !clickedShape.isBricked) {
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
          tag: clickedShape.tag || "",
        visibility: clickedShape.visibility || "",
        })
      } else {
        setSelectedShape(null)
        setShapeDialog({ ...shapeDialog, isOpen: false })
      }
    } else if (selectedTool === "rectangle" || selectedTool === "walls") {
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

    if (selectedTool === "rectangle" || selectedTool === "walls") {
      setDrawingState({
        ...drawingState,
        currentX: canvasX,
        currentY: canvasY,
      })
    }
  }

  const erasePlusAt = (x, y, size = 6) => {
    // Slightly larger box than plus to fully clear it
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(x + 498 - size, y + 248 - size, size * 3, size * 3);
  };
  

  const addStartPoint = (e) => {
    if(clickPosition) {
      erasePlusAt(clickPosition.x, clickPosition.y, 5);
    }
    const { x: canvasX, y: canvasY } = getCustomCoordinates(e)
    const size = 5; // Length of half the plus lines

    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;

    // Vertical line
    ctx.beginPath();
    ctx.moveTo(canvasX + 500, canvasY + 250 - size);
    ctx.lineTo(canvasX + 500, canvasY + 250 + size);
    ctx.stroke();

    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(canvasX + 500 - size, canvasY + 250);
    ctx.lineTo(canvasX + 500 + size, canvasY + 250);
    ctx.stroke();

    setClickPosition({ x: canvasX, y: canvasY });
  }

  const handleCanvasClick = (e) => {
    if(selectedTool === "start-point"){
      addStartPoint(e);
      return;
    }
    if (selectedTool !== "delete") return;

    const { x: canvasX, y: canvasY } = getCustomCoordinates(e)

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

    const clickedRect = shapes.find(
      (r) =>
        canvasX >= r.x &&
        canvasX <= r.x + r.width &&
        canvasY >= r.y &&
        canvasY <= r.y + r.height
    );


    
    if (clickedRect && !clickedRect.isBricked) {
      // Update the rectangle's color property
      setShapes((prevShapes) =>
        prevShapes.map((shape) =>
          shape.id === clickedRect.id
            ? { ...shape, color: fillColor, isColored: true }
            : shape
        )
      );
      // Fill the rectangle with a color
      ctx.fillStyle = fillColor;
      ctx.fillRect(clickedRect.x + canvasWidth / 2, clickedRect.y + canvasHeight / 2, clickedRect.width, clickedRect.height);
    }
  }

  const stopDrawing = (e) => {
    if (!ctx || !drawingState.isDrawing || !canvasRef.current || (selectedTool !== "rectangle" && selectedTool !== "walls")) return
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
        [Math.min(x1, x2), Math.min(y1, y2)],
        [Math.min(x1, x2), Math.max(y1, y2)],
        [Math.max(x1, x2), Math.max(y1, y2)],
        [Math.max(x1, x2), Math.min(y1, y2)],
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
        isBricked: selectedTool === "walls",
        isOpenSpace: isOpenSpaceMode, // Add this property
      };

      setShapes([...shapes, newRectangle]);

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
  };

  const handleHover = (e) => {
    if(!ctx || !canvasRef.current || selectedTool !== "pointer") return;
    const { x: mouseX, y: mouseY } = getCustomCoordinates(e);

    let foundShape = null;

    for (let shape of shapes) {
      if (
        mouseX >= shape.x &&
        mouseX <= shape.x + shape.width &&
        mouseY >= shape.y &&
        mouseY <= shape.y + shape.height
      ) {
        foundShape = shape;
        break;
      }
    }
    if(foundShape?.isBricked || foundShape?.isOpenSpace){
      return;
    }
    setHoveredShape(foundShape);
  };

  const handleTextSubmit = (text) => {
    if (text.trim() === "") {
      setTextInput({ isActive: false, x: 0, y: 0, text: "" });
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

    setShapes([...shapes, newText]);
    setNextId(nextId + 1);
    setTextInput({ isActive: false, x: 0, y: 0, text: "" });
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

    const selectedTagOption = tagOptions.find(option => option.id === shapeDialog.tag);

    const updatedShapes = shapes.map((shape) => {
      if (shape.id === shapeDialog.shapeId) {
        return {
          ...shape,
          name: shapeDialog.name || "N/A",
          instruction: shapeDialog.instruction || "N/A",
          tag: shapeDialog.tag || "",
          visibility: shapeDialog.visibility || "",
          // Apply color based on visibility if selected
          color: selectedTagOption ? selectedTagOption.color : shape.color,
          isColored: selectedTagOption ? true : shape.isColored,
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

  const handleImageUpload = (file) => {
    if (file) {
      setUploadImage(file)
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          setBackgroundImage(img);
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  const clearCanvas = () => {
    setShapes([])
    setSelectedShape(null)
    setShapeDialog({ ...shapeDialog, isOpen: false })
    setSelectedInstructions({})
    setAvailableInstructions({})
    setSelectedTool("rectangle")
    setBackgroundImage(null)
    setUploadImage(null)
  }

  const saveShapes = () => {
    const canvas = canvasRef.current;
    const canvasSnapshot = canvas.toDataURL("image/png");
    const regularRectangles = shapes.filter(shape => 
      shape.type === "rectangle" && !shape.isOpenSpace
    );

    const openSpaceRectangles = shapes.filter(shape => 
      shape.type === "rectangle" && shape.isOpenSpace
    );
    
    // Get rectangles
    const rectangles = shapes.filter(shape => shape.type === "rectangle" );
    
    // Calculate pixel to meter conversion factors
    // const pixelsPerMeterWidth = canvasWidth / (planogramWidth * 0.3048);  // pixels per meter
    // const pixelsPerMeterHeight = canvasHeight / (planogramLength * 0.3048);
    
    // Calculate total area in square meters
    // let totalDrawnArea = 0;
    // rectangles.forEach(rect => {
    //   const widthInPixels = Math.abs(rect.width);
    //   const heightInPixels = Math.abs(rect.height);
      
    //   // Convert pixel dimensions to meters
    //   const widthInMeters = widthInPixels / pixelsPerMeterWidth;
    //   const heightInMeters = heightInPixels / pixelsPerMeterHeight;
      
    //   // Add area in square meters
    //   totalDrawnArea += widthInMeters * heightInMeters;
    // });
    
    // setCanvasArea(totalDrawnArea);

    // console.log(`Canvas dimensions: ${canvasWidth}px × ${canvasHeight}px`);
    // console.log(`Store dimensions: ${planogramWidth}ft × ${planogramLength}ft`);
    // console.log(`Total drawn area: ${totalDrawnArea.toFixed(2)}m², User area: ${userArea.toFixed(2)}m²`);

    // // If drawn area is smaller than user area, scale up
    // let scaledRectangles;
    // if (totalDrawnArea < userArea) {
    //   const scalingFactor = Math.sqrt(userArea / totalDrawnArea);
    //   console.log(`Scaling up by factor of ${scalingFactor}`);
      
    //   scaledRectangles = rectangles.map(rect => ({
    //     id: rect.id,
    //     vertices: rect.vertices.map(vertex => [
    //       vertex[0] * scalingFactor,
    //       vertex[1] * scalingFactor
    //     ]),
    //     name: rect.name,
    //     instructionData: rect.instruction && instruction_data.find(item => 
    //       item.id === rect.instruction
    //     )
    //   }));
    // } else {
      // If drawn area is larger, keep original vertices
      const scaledRectangles = regularRectangles.map(rect => ({
        id: rect.id,
        vertices: rect.vertices,
        name: rect.name,
        isBricked: rect.isBricked,
        isColored: rect.isColored,
        color: rect.color,
        instructionData: rect.instruction && instruction_data.find(item => 
          item.id === rect.instruction
        )
      }));
      
      // console.log(`Using original dimensions - Drawing area: ${totalDrawnArea}m², Store area: ${userArea}m²`);
    

      // Process open space rectangles
      const processedOpenSpaces = openSpaceRectangles.map(rect => {
        // Find all regular rectangles that intersect with this open space
        const intersectingShapes = regularRectangles.filter(regular => 
          isIntersecting(rect, regular)
        );
      
        return {
          id: rect.id,
          type: 'openSpace',
          vertices: rect.vertices,
          name: rect.name || '',
          // Include other properties matching regular rectangles
          isOpenSpace: true,
          intersectingShapes: intersectingShapes.map(shape => ({
            id: shape.id,
            vertices: shape.vertices,
            type: shape.type,
            name: shape.name,
            isBricked: shape.isBricked,
            isColored: shape.isColored,
            color: shape.color
          }))
        };
      });
      

    if(!clickPosition){
      setShowStatusModal(true);
      setErrorMessage("Please click on the image to set the start point")
      return;
    }


    if (onSaveShapes) {
      onSaveShapes({
        shapes: scaledRectangles,
        openSpaces: processedOpenSpaces,
        snapshot: canvasSnapshot,
        image: backgroundImage,
      });
      onClose();
    }
  };


  const isIntersecting = (openSpaceRect, structureRect) => {
    // Normalize rectangle coordinates for proper intersection testing
    const rect1 = {
      x: openSpaceRect.width < 0 ? openSpaceRect.x + openSpaceRect.width : openSpaceRect.x,
      y: openSpaceRect.height < 0 ? openSpaceRect.y + openSpaceRect.height : openSpaceRect.y,
      width: Math.abs(openSpaceRect.width),
      height: Math.abs(openSpaceRect.height)
    };
  
    const rect2 = {
      x: structureRect.width < 0 ? structureRect.x + structureRect.width : structureRect.x,
      y: structureRect.height < 0 ? structureRect.y + structureRect.height : structureRect.y,
      width: Math.abs(structureRect.width),
      height: Math.abs(structureRect.height)
    };
  
    // Check if rect1 (open space) overlaps with rect2 (structure)
    // Using a small threshold to avoid edge-only intersections
    const threshold = 2; // 2 pixels threshold
    return (
      rect1.x < (rect2.x + rect2.width - threshold) &&
      (rect1.x + rect1.width - threshold) > rect2.x &&
      rect1.y < (rect2.y + rect2.height - threshold) &&
      (rect1.y + rect1.height - threshold) > rect2.y
    );
  };
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
          onMouseMove={(e) => {
            draw(e);
            handleHover(e);
          }}
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

                

                <>
                  {/*  existing input fields */}
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

                </>
            
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
        
        {hoveredShape && (
          <div
          style={{
            position: "absolute",
            left: hoveredShape.x + hoveredShape.width + 2 + canvasWidth / 2 +35 > canvasWidth ? hoveredShape.x + canvasWidth/2 - 33 : hoveredShape.x + hoveredShape.width -35 + canvasWidth / 2,
            top: hoveredShape.y + canvasHeight / 2 + 2,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Edit Button with Tooltip */}
          <div className="relative group">
            <button
              className="w-8 h-8 rounded-full bg-indigo-400 hover:bg-indigo-500 flex items-center justify-center shadow-md"
              onClick={() => {

                handleEditShape();
              }}
            >
              <PencilIcon className="text-white w-4 h-4" />
            </button>
            <div className="absolute w-[65px] left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
              Edit Info.
            </div>
          </div>
        
          {/* Delete Button */}
          <div className="relative group">
            <button
              className="w-8 h-8 rounded-full bg-white border border-gray-300 hover:bg-gray-100 flex items-center justify-center shadow-md"
              onClick={() => {
                setShapes((prevShapes) =>
                  prevShapes.filter((shape) => shape.id !== hoveredShape.id)
                );
                setHoveredShape(null);
              }}
            >
              <Trash2 className="text-indigo-400 w-4 h-4" />
            </button>
            <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded">
              Delete
            </div>
          </div>
        </div>
        
        )}
      </div>
      {planogramLength !== 0 && planogramWidth !== 0 && <div>
        <div className="bg-white p-2 mt-4 rounded shadow-md z-10 flex items-center">
          <label className="text-sm font-medium text-gray-700 mr-2">ScaleX: 1ft = {Math.floor(1000 / planogramWidth)}px</label>
          <label className="text-sm font-medium text-gray-700 mr-2">ScaleY: 1ft = {Math.floor(1000 / planogramLength)}px</label>
        </div>
      </div>}

      <ToolBar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        clearCanvas={clearCanvas}
        saveShapes={saveShapes}
        handleImage={handleImageUpload}
        isOpenSpaceMode={isOpenSpaceMode}
        setIsOpenSpaceMode={setIsOpenSpaceMode}
      />
      {selectedTool === "fill" && (
      <>
      
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow-md z-10 flex items-center">
          <label className="text-sm font-medium text-gray-700">Fill Color:</label>
          <input
            type="color"
            value={fillColor}
            onChange={(e) => setFillColor(e.target.value)}
            className="ml-2 w-8 h-8 border-none cursor-pointer"
          />
        </div>
      </>
      )}
      <OverlayAddStore 
        message={errorMessage}
        setErrorMessage={setErrorMessage}
        successMessage={successMessage}
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          if (isSuccess) {
            handleClose();
          }
        }}
        isSuccess={isSuccess}
      />
    </div>
  );
}