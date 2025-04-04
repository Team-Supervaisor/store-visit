"use client"

import { useEffect, useRef, useState } from "react"
import ToolBar from "./tool-bar"

export default function DrawingCanvas() {
  const canvasRef = useRef(null)
  const [ctx, setCtx] = useState(null)
  const [selectedTool, setSelectedTool] = useState("pen")
  const [color, setColor] = useState("#000000")
  const [lineWidth, setLineWidth] = useState(2)
  const [drawingState, setDrawingState] = useState({
    isDrawing: false,
    startX: 0,
    startY: 0,
  })

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas to full size
    const resizeCanvas = () => {
      const container = canvas.parentElement
      if (!container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight

      // Clear canvas on resize
      const context = canvas.getContext("2d")
      if (context) {
        context.fillStyle = "#ffffff"
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Set up context
    const context = canvas.getContext("2d")
    if (context) {
      context.lineCap = "round"
      context.lineJoin = "round"
      context.fillStyle = "#ffffff"
      context.fillRect(0, 0, canvas.width, canvas.height)
      setCtx(context)
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  // Handle mouse events
  const startDrawing = (e) => {
    if (!ctx) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.strokeStyle = selectedTool === "eraser" ? "#ffffff" : color
    ctx.lineWidth = selectedTool === "eraser" ? lineWidth * 2 : lineWidth

    setDrawingState({
      isDrawing: true,
      startX: x,
      startY: y,
    })
  }

  const draw = (e) => {
    if (!drawingState.isDrawing || !ctx || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (selectedTool === "pen" || selectedTool === "eraser") {
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }

  const stopDrawing = (e) => {
    if (!ctx || !drawingState.isDrawing || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (selectedTool === "line") {
      ctx.beginPath()
      ctx.moveTo(drawingState.startX, drawingState.startY)
      ctx.lineTo(x, y)
      ctx.stroke()
    } else if (selectedTool === "rectangle") {
      const width = x - drawingState.startX
      const height = y - drawingState.startY
      ctx.strokeRect(drawingState.startX, drawingState.startY, width, height)
    } else if (selectedTool === "circle") {
      const radius = Math.sqrt(Math.pow(x - drawingState.startX, 2) + Math.pow(y - drawingState.startY, 2))
      ctx.beginPath()
      ctx.arc(drawingState.startX, drawingState.startY, radius, 0, 2 * Math.PI)
      ctx.stroke()
    }

    setDrawingState({ ...drawingState, isDrawing: false })
  }

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  return (
    <div className="relative w-full h-[calc(100vh-2rem)] flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="w-full h-full bg-white shadow-md rounded-lg cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <ToolBar
        selectedTool={selectedTool}
        setSelectedTool={setSelectedTool}
        color={color}
        setColor={setColor}
        lineWidth={lineWidth}
        setLineWidth={setLineWidth}
        clearCanvas={clearCanvas}
      />
    </div>
  )
}

