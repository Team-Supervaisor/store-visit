import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './store.css';
import logo from '../assets/logo.png'
import star from '../assets/star.png'
import axios from 'axios';
import samsung from '../assets/samsung.png'
import googlei from '../assets/google.png' 
import apple from '../assets/apple.jpeg'
import layout from '../assets/store_layout.png'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Upload } from 'lucide-react';

export default function StoreVisitLoad() {
    const location = useLocation();
    const { storeVisitDetails } = location.state || {}; // Retrieve the state

    const [modalImage, setModalImage] = useState(null);
  const [distance, setDistance] = useState(0);
  const [points, setPoints] = useState([]);
  const openModal = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const closeModal = () => {
    setModalImage(null);
  };
  const navigate = useNavigate();
  const [isStructureVisible, setIsStructureVisible] = useState(false);
  const [isPathVisible, setIsPathVisible] = useState(true);
  const [images, setImages] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [imageHistory, setImageHistory] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [imagePointMap, setImagePointMap] = useState(new Map());
const [vizDimensions, setVizDimensions] = useState({ width: 0, height: 0 });
const vizElement = document.getElementById('visualization');
const [polygons, setPolygons] = useState([]);
const [centerX, setCenterX] = useState(0);
const [centerZ, setCenterZ] = useState(0);
const [nearestStructure, setNearestStructure] = useState(null);
const [squareCoordinates, setSquareCoordinates] = useState([]);
const [square, setSquare] = useState();
const [centerCoord, setCenterCoord] = useState([]);
const [expandedCards, setExpandedCards] = useState({});
const distanceDisplayRef = useRef(null);
const [perpendicularCoord, setPerpendicularCoord] = useState([]);
const [selectedImage, setSelectedImage] = useState();
const [pstructures, setPstructures] = useState([]);
const [pPolygons, setPPolygons] = useState([]);
const [isHovering, setIsHovering] = useState();
const [aiDetails, setAIDetails] = useState();
const [distCoord,setDistcoord]=useState([]);
const [structures,setStructures]=useState();
  const toggleCard = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the selected card
    }));
  };
// const [square, setSquare] = useState();
const socketRef = useRef(null);
let squares=[];
const vizRef = useRef(null);
useEffect(() => {
  const updateDimensions = () => {
    setTimeout(() => {
      if (vizRef.current) {
        setVizDimensions({
          width: vizRef.current.offsetWidth,
          height: vizRef.current.offsetHeight
        });
      }
    }, 100); // Small delay to allow layout calculation
  };

  updateDimensions();
  window.addEventListener("resize", updateDimensions);

  return () => window.removeEventListener("resize", updateDimensions);
}, []);
useEffect(() => {
    // console.log(vizDimensions.width,vizDimensions.height);
    setCenterX(vizDimensions.width / 2);
    setCenterZ(vizDimensions.height / 2);
   const centerx = vizDimensions.width / 2;
   const centerz = vizDimensions.height / 2;


}, [ vizDimensions]);


    useEffect(() => {
      console.log('Store Visit Details:', storeVisitDetails);
      if(storeVisitDetails.status=='finished'){
        setCoordinates(storeVisitDetails.x_y_coords);
        setPstructures(storeVisitDetails.polygon_coordinates);
        setImageHistory(storeVisitDetails.images);
        setTotalDistance(storeVisitDetails.distance);
        setStructures(storeVisitDetails.planogram_coords);
        
      }
    }, []);


    useEffect(() => {
      if (!structures?.length || !vizDimensions) return;
      // console.log(vizDimensions.width,vizDimensions.height);
      console.log(structures)
      setCenterX(vizDimensions.width / 2);
      setCenterZ(vizDimensions.height / 2);
     const centerx = vizDimensions.width / 2;
     const centerz = vizDimensions.height / 2;


    const newPolygons = structures.map((structure) => {
      let pathData = "";
      structure.vertices.forEach((coord, index) => {
        const screenX = centerx + coord[0];
        const screenZ = centerz + coord[1];

        pathData += index === 0 ? `M ${screenX} ${screenZ} ` : `L ${screenX} ${screenZ} `;
      });

      pathData += "Z"; // Close the polygon

      const centerCoord = getPolygonCenter(structure.vertices);
      const textX = centerx + centerCoord[0];
      const textY = centerz + centerCoord[1];

      return {
        id: structure.id,
        name: structure.name,
        type: structure.type,
        pathData,
        textX,
        textY,
        color: '#E1E9FD',
      };
    });

    setPolygons(newPolygons);
    }, [structures,vizDimensions])
    

    function getPolygonCenter(coords) {
      // console.log("polygon center:",coords);
      let sumX = 0;
      let sumZ = 0;
      
      coords.forEach(coord => {
        sumX += coord[0];
        sumZ += coord[1];
      });
      
      return [sumX / coords.length, sumZ / coords.length];
    }
    const pPolygonsRef = useRef([]);

    useEffect(() => {
      if(pstructures.length>0){
    console.log((pstructures[0]))

    // console.log(JSON.parse(pstructures[0]))
    // console.log(typeof(JSON.parse(pstructures[0])))
      }
    setCenterX(vizDimensions.width / 2);
    setCenterZ(vizDimensions.height / 2);
    const centerx = vizDimensions.width / 2;
    const centerz = vizDimensions.height / 2;
    if(pstructures.length>0){
    const newPolygons = pstructures.map((structure, structureIndex) => {
      // const parsedStructure = JSON.parse(structure);
      let pathData = "";
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
      structure.forEach((coord, index) => {
        const screenX = centerx + coord[0];
        const screenZ = centerz + coord[1];
    
        pathData += index === 0 ? `M ${screenX} ${screenZ} ` : `L ${screenX} ${screenZ} `;
        minX = Math.min(minX, screenX);
        maxX = Math.max(maxX, screenX);
        minY = Math.min(minY, screenZ);
        maxY = Math.max(maxY, screenZ);
      });
  
      pathData += "Z"; // Close the polygon
  
      const centerCoord = getPolygonCenter(structure);
      const textX = centerx + centerCoord[0];
      const textY = centerz + centerCoord[1];
  
      const imageWidth = maxX - minX - 10;
      const imageHeight = maxY - minY - 10;
      const imageX = minX + 5;
      const imageY = minY + 5;
      
      return {
        image_id: structureIndex.toString(),
        name: "",
        type: 'counter',
        coordinates: structure.coordinates,
        pathData,
        textX,
        textY,
        color: 'white',
        imageX,
        imageY,
        imageWidth,
        imageHeight,
      };
    });

    setPPolygons(newPolygons);
    pPolygonsRef.current = newPolygons; // Update the ref with the latest polygons
    }
  },[pstructures,vizDimensions]);
    
  
  
  const createRipple = (event) => {
      const button = event.currentTarget;
      const circle = document.createElement('span');
      const diameter = Math.max(button.clientWidth, button.clientHeight);
      
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.getBoundingClientRect().left - diameter / 2}px`;
      circle.style.top = `${event.clientY - button.getBoundingClientRect().top - diameter / 2}px`;
      circle.classList.add('ripple');
      
      const ripple = button.getElementsByClassName('ripple')[0];
      if (ripple) {
        ripple.remove();
      }
      
      button.appendChild(circle);
    };
    const toggleStructure = () => {
      setIsStructureVisible(!isStructureVisible);
    };
    const togglePath = () => {
      setIsPathVisible(!isPathVisible);
    }

  const imageRefs = useRef([]); // Store references for each card

    useEffect(() => {
      if (selectedImage !== null && imageRefs.current[selectedImage]) {
        imageRefs.current[selectedImage].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center"
        });
      }
    }, [selectedImage]); 

    return (
      <>
{coordinates.length>0?<>
<div className="container" style={{ backgroundColor: '#EFF4FE' }}>
    {/* Header Section */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EFF4FE',
        padding: '5px',
        paddingLeft: '15px',
        width: '100%'
      }}
      // onClick={() => navigate('/')}
    >
      <div style={{ display: 'flex', alignItems: 'center',marginLeft:15 }} 
      className="hover:cursor-pointer"

      onClick={() => navigate('/')}
      
      >
        <img src={logo} alt="Logo" style={{ height: '25px', marginRight: '10px' }} />
        <h1 style={{ margin: 0, color: 'black', fontWeight: 500 }} 
        
        >Store Visit Tracking</h1>
      </div>
      <div className="control-panel" style={{ textAlign: 'right' }}>
        <div>
          {/* <button
            id="startButton"
            type="button"
            onClick={(e) => {
              createRipple(e);
              handleStartButton();
            }}
          >
            Start
          </button>
          <button
            id="clearButton"
            type="button"
            className="clear"
            onClick={(e) => {
              createRipple(e);
              handleClearButton();
            }}
          >
            Clear All
          </button> */}

          <label className="toggle-container">
            <span>View path</span>
            <input
              type="checkbox"
              id="pathToggle"
              checked={isPathVisible}
              onChange={togglePath}
            />
            <span className="slider"></span>
          </label>

          <label className="toggle-container">
            <span>Planogram</span>
            <input
              type="checkbox"
              id="structureToggle"
              checked={isStructureVisible}
              onChange={toggleStructure}
            />
            <span className="slider"></span>
          </label>

          <div>
          <div className="bg-[#E1E9FD] text-[#777FE3] items-center py-2 pl-4 pr-6 rounded-xl flex gap-2">
          <Upload size={20} color="#4F4FDC" />
          <span className="font-medium text-[#4F4FDC]">
            Upload Planogram
          </span>
         
        </div>
      </div> 
      <img src="/profile.svg" alt="profile" className=" w-[51px]" />
        </div>
      </div>
    </div>

{/* Distance Display */}
{/* <div className="info-display">
  <span className="distance-box">
    <span id="distance" ref={distanceDisplayRef} style={{ color: 'black', fontWeight: 500, marginLeft: 15 }}>
      Distance: {totalDistance?.toFixed(2)}
    </span>
    <span className="arrow">◀</span>
  </span>
</div> */}



    {/* Main Layout */}
    <div className="layout-container" >
      <div className="left-container"style={{
        backgroundImage:structures?.length>0 ? "none" : `url(${storeVisitDetails.planogram_url})`,
        backgroundSize: "cover",  // Ensures the image covers the entire container
        backgroundPosition: "center", // Centers the image
        backgroundRepeat: "no-repeat", 
        borderRadius:'26px',
        transition: "background 0.5s ease-in-out",
        backgroundColor:'white',
        position: 'relative',
               margin:"4px",
        marginBottom: "7px"
        // zIndex:10 // Full height of the viewport
      }}>

  {/* Distance Display - Updated */}
  <div 
  className="info-display absolute top-4 left-0" 
  style={{ zIndex: 10 }}
>
  <div 
    style={{
      borderTopRightRadius: '12px',
      borderBottomRightRadius: '12px'
    }}
    className="bg-[#EFF0FF] text-[#777FE3] items-center py-2 pl-4 pr-6"
  >
    <span 
      id="distance" 
      ref={distanceDisplayRef} 
      className="font-medium"
    >
      {`Distance: ${totalDistance ? totalDistance.toFixed(2) : '0.00'} Meters`}
    </span>

    <span className="arrow">◀</span>
  </div>
</div>


<div id="visualization" ref={vizRef} style={{ position: 'relative' }}>
  {/* Render the route polyline when path is visible */}
  {isPathVisible && coordinates.length > 0 && (
    <svg
      width="100%"
      height="100%"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none'
      }}
    >
      <polyline
        points={
          coordinates
            .map(point => `${centerX + point.x},${centerZ + point.y}`)
            .join(' ')
        }
        fill="none"
        stroke="blue"
        strokeWidth="2"
      />
    </svg>
  )}

  {/* Render individual coordinate points */}
  {isPathVisible && (
    <>
      {coordinates.map((point, index) => 
      {
        // console.log("point",point);
        // console.log("centerX",centerX);
        // console.log("centerZ",centerZ);
        return(
        <div
          key={index}
          className={`point ${point?.photoCapture==1 ? 'photo-captured' : ''}`}
          style={{
            left: `${centerX+ point.x}px`,
            top: `${centerZ+point.y}px`
          }}
        />
      )})}
    </>
  )}

  {/* Store structure overlay and other SVG elements remain unchanged */}
  {isStructureVisible && <div className="overlay"></div>}
  {isStructureVisible && (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}>
      {polygons.map((polygon) => (
        <g key={polygon.id} className={`structure ${polygon.type}`} title={polygon.name}>
          <path
            d={polygon.pathData}
            fill={polygon.color}
            stroke="#000"
            strokeWidth="2"
            fillOpacity="0.5"
          />
          <text
            x={polygon.textX}
            y={polygon.textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12px"
            fill="#000"
            fontWeight="bold"
          >
            {polygon.name}
          </text>
        </g>
      ))}
    </svg>
  )}

  {isPathVisible  && (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
      {pPolygons.map((polygon, index) => (
        <g
          key={polygon.image_id}
          className={`structure ${polygon.type}`}
          title={polygon.name}
          onMouseEnter={() => { setIsHovering(index); console.log('hovering', index); }}
          onMouseLeave={() => setIsHovering(null)}
          onClick={() => setSelectedImage(index)}
        >
          {/* <image
    href={imageHistory[index].metadata.brand=='google'?googlei:imageHistory[index].metadata.brand=='Apple'?apple:imageHistory[index].metadata.brand=='Google'?googlei:samsung}
    x={polygon.imageX + 5} // Slightly inward positioning
    y={polygon.imageY + 5}
    width={polygon.imageWidth - 10} // Reduced width
    height={polygon.imageHeight - 10} // Reduced height
    preserveAspectRatio="xMidYMid slice"
  /> */}
          <path
            d={polygon.pathData}
            fill={polygon.color}
            stroke="#000"
            strokeWidth="2"
            fillOpacity="0.5"
          />
          <text
            x={polygon.textX}
            y={polygon.textY}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="12px"
            fill="#000"
            fontWeight="bold"
          >
            {polygon.name}
          </text>
        </g>
      ))}
    </svg>
  )}
          {centerCoord && isStructureVisible && (
            distCoord.map((center, index) => {
              // let a = parseImageUrl(imageHistory[index]?.url);
              // console.log("parsed:",a);
              return (
                <>
                  <div
                    className="tooltip"
                    style={{ position: 'absolute', top: centerZ + center[1]-10, left: centerX + center[0] ,
                    display: isHovering===index  ? "block" : "none"
                  }}
                    onClick={() => setSelectedImage(index)}
                    
                    
                  >
                    <div className="imagetooltip-container">
                      <img src={imageHistory[index].metadata?.image_url} alt="" className="tooltip-image" />
                    </div>

                    {/* Measurement text */}
                    <div className="measurement-text">
                      <span className="measurement-label">Measurement:</span>
                      <span className="measurement-value">
                        {parseFloat(imageHistory[index].metadata?.measurementL).toFixed(1)}&times;{parseFloat(imageHistory[index].metadata.measurementB).toFixed(1)}
                      </span>
                    </div>

                    {/* Triangle pointer */}
                    <div className="tooltip-pointer"></div>
                    {/* </div> */}
                    {/* <span className="display-text">Phone Display</span> */}
                  </div>

                </>
              );
            })
          )}
        </div>


      </div>
      <div
       style={{
            margin:"5px",
            marginBottom: "7px"
        }}
       className="right-container">
        <div
          style={{
            paddingLeft: '14px',
            paddingTop: '10px',
            fontWeight: 'bold',
            // boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
            borderBottom: '1px solid #EFF4FE',
            color: 'black',
            paddingBottom: '5px',
            
          }}
        >
          Reports
        </div>
        
        {/* report numbers */}
        <div className="flex gap-4 px-4 py-3 text-black">
        <div className="flex-1 bg-[#F2F2FF] rounded-xl p-3">
          <div  className="text-sm font-medium mb-1">SOV</div>
          <div className="flex items-center">
            <span className="text-xl font-medium mr-2">240</span>
            <img src="/trending_up.svg" alt="trending up" className="w-4 h-4 " />
            <div className="bg-[#C5E8D7] text-black text-xs px-2 py-1 ml-2 rounded-full">
              14%
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#F2F2FF] rounded-xl p-3">
          <div className="text-sm font-medium mb-1">Compliance</div>
          <div className="flex items-center">
            <span className="text-xl font-medium mr-2">240</span>
            <img src="/trending_up.svg" alt="trending up" className="w-4 h-4" />
            <div className="bg-[#C5E8D7] text-black text-xs px-2 py-1 ml-2 rounded-full">
              14%
            </div>
          </div>
        </div>

        <div className="flex-1 bg-[#F2F2FF] rounded-xl p-3">
          <div className="text-sm font-medium mb-1">Placement</div>
          <div className="flex items-center">
            <span className="text-xl font-medium mr-2">240</span>
            <img src="/trending_up.svg" alt="trending up" className="w-4 h-4" />
            <div className="bg-[#C5E8D7] text-black text-xs px-2 py-1 ml-2 rounded-full">
              14%
            </div>
          </div>
        </div>
      </div>

        <div id="imageContainer">
          {imageHistory.length > 0 ? (
            // console.log("ai details",imageHistory,aiDetails),
            imageHistory.map((image, index) => {
              // console.log("image",image);
              // let a = parseImageUrl(image.url);
              // let ai = getAI(image.url);
              // console.log("AI:",ai);  
              return (
                <div
                  key={index}
                  className={`card ${selectedImage === index ? 'active' : ''}`}
                  ref={(el) => (imageRefs.current[index] = el)}
                >
                  <div className="card-image-container">
                    {/* NEW LINE: onClick added here to open modal */}
                    <img
                      src={image.image_url}
                      alt={`Report ${index}`}
                      className="card-image"
                      onClick={() => openModal(image.url)}
                    />
                  </div>
                  <div className="card-content">
                    <div className="card-info">
                      <div className="card-info-row">
                        <span className="card-info-label">Brand</span>
                        <span className="card-info-label">Merchandise</span>
                        <span className="card-info-label">Product</span>
                        <span className="card-info-label">Measurement</span>
                      </div>
                      <div className="card-info-row">
                        <span className="card-info-value">{image?.brand || 'N/A'}</span>
                        <span className="card-info-value">{image?.merchandise || 'N/A'}</span>
                        <span className="card-info-value">{image?.product || 'N/A'}</span>
                        <span className="card-info-value">
                          {parseFloat(image?.length).toFixed(3)}&times;{parseFloat(image?.breadth).toFixed(3)} 
                        </span>
                      </div>
                    </div>

                    {/* Toggle button */}

                    {/* Extra Content - Conditionally rendered */}
                    {expandedCards[index] && (
                      <div className="extra-content-container">
                        <div className="extra-header">
                          <img src={star} alt="Icon" className="extra-icon" />
                          <span className="extra-title" style={{ fontWeight: 400, color: 'black' }}>
                            AI Analysis
                          </span>
                        </div>
                        {/* <p class="extra-description">
               Designed for online marketing campaigns, this banner comes with various attributes to ensure adaptability across platforms:
           </p> */}
                        <p className="extra-details">
                          <strong>Brand:</strong> {imageHistory[index].aiDetails?.brand || 'N/A'} <br />
                          <strong>Position:</strong> {imageHistory[index].aiDetails?.position || 'N/A'} <br />
                          <strong>Summary:</strong> {imageHistory[index].aiDetails?.summary || 'No AI analysis available.'}
                        </p>
                        {/* <p>
                          {aiDetails[index]?.summary || 'No AI analysis available.'}
                        </p> */}
                      </div>
                    )}
                    <div className="card-toggle" onClick={() => toggleCard(index)}>
                      <span>See {expandedCards[index] ? 'Less' : 'More'}</span>
                      <span className="arrow">{expandedCards[index] ? '▲' : '▼'}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
           
            <div className="flex flex-col items-center my-auto min-h-[70vh] justify-center space-y-6">
              <img 
                src="/empty.svg" 
                alt="arrow" 
                className="h-40 object-contain "
              />
              <p className="text-gray-400 text-lg">
                Seems like the planogram is lonely
              </p>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* NEW LINES: Modal Popup with Close Button */}
    {modalImage && (
      <div className="modal" onClick={closeModal} style={{zIndex:20}}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeModal}>
            &times;
          </button>
          <img src={modalImage} alt="Full view" />
        </div>
      </div>
    )}
  </div>
</>:<>:</>}


      </>
    );
}
