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
import {ChevronUp, ChevronDown } from 'lucide-react';
import { X } from 'lucide-react';


// Add brick pattern support
const renderBrickPattern = () => (
  <defs>
    <pattern id="brickPattern" patternUnits="userSpaceOnUse" width="60" height="30">
      <rect width="60" height="30" fill="white" />
      <rect x="0" y="0" width="28" height="13" fill="#8897F1" />
      <rect x="30" y="0" width="28" height="13" fill="#8897F1" />
      <rect x="15" y="15" width="28" height="13" fill="#8897F1" />
      <rect x="45" y="15" width="28" height="13" fill="#8897F1" />
      <rect x="0" y="15" width="13" height="13" fill="#8897F1" />
    </pattern>
  </defs>
);


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
  const [storeName,setStoreName]=useState();
const [structures,setStructures]=useState();
  const [planstructures,setPlanstructures]=useState([]);
  const [instructionModal, setInstructionModal] = useState(false);
const [modalData, setModalData] = useState(null);
const [newCoordinates, setNewCoordinates] = useState([]);


/// new states for showing strucutre. 
const [openPolygon, setOpenPolygon] = useState([]);
const [openStructure, setOpenStructure] = useState([]);


  const toggleCard = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle the selected card
    }));
  };
// const [square, setSquare] = useState();

const company_legend= [
  // { name: 'Hitachi', color: '#7373F9' },
  { name: 'Google', color: '#FC7561' },
  { name: 'Samsung', color: '#FFB726' },
  { name: 'Apple', color: '#7373F9' },
  // { name: 'Oppo', color: '#20B15A' },
  // { name: 'Vivo', color: '#FF6584' },

]
const socketRef = useRef(null);
let squares=[];
const vizRef = useRef(null);




function getNewCoordinates(x, z, angle) {
  const radians = (angle * Math.PI) / 180; // Convert angle to radians
  const distance = 100; // Given distance

  const newX = x + distance * Math.cos(radians);
  const newZ = z - distance * Math.sin(radians);

  return [newX, newZ];
}

function find_nearest(x, z,l,b,angle) {
  // console.log("imagesssssssss:",x,z,l,b,angle);
  // x=(x/100)*500;
  // z=(z/100)*250;
  console.log(x,z);
//   if (!planstructures || planstructures.length === 0) {
//     console.error("No structures found!");
//     // return;
// }
let perpendicularPoint=null
let nearest=null
let minDistance = Infinity;

 

  setPerpendicularCoord((prev) => {
    // console.log("Previous State:", prev);
    const updated = [...prev,perpendicularPoint ];
    // console.log("Updated State:", updated);
    return updated;
  });
  // setCenterCoord(center);
  // console.log("CenterCoord:", centerCoord);
  if(l==0 && b==0)
  {
    l=10;
    b=5;
  }
  l=l*30;
  b=b*30;
 
  const newCoords = getNewCoordinates(x, z, angle);
  setDistcoord((prev) => {
    // console.log("Previous State:", prev);
    const updated = [...prev,newCoords ];
    // console.log("Updated State:", updated);
    return updated;
  });
  console.log('dist coord:',distCoord);
  const pcoordinates=[
    [newCoords[0] - l/2, newCoords[1] - b/2], // Top-left
    [newCoords[0] + l/2, newCoords[1] - b/2],
    [newCoords[0] + l/2, newCoords[1] + b/2], // Bottom-right
    [newCoords[0] - l/2, newCoords[1] + b/2], // Top-right
     // Bottom-left
  ]

  // setPstructures(prevStructures => [
  //   ...prevStructures,
  //   { coordinates: pcoordinates }
  // ]);
  console.log("pcoordinates:",pcoordinates);
  console.log("Pstructures:",pstructures);
  return { nearestStructure };

}




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
        setStoreName(storeVisitDetails.store_name);
        setTotalDistance(storeVisitDetails.distance);
        setNewCoordinates(storeVisitDetails?.images[0]?.x_y_coords);
        setStructures(storeVisitDetails?.planogram_coords || []);

        // Separate regular shapes and open spaces
    if (storeVisitDetails?.planogram_coords?.regularShapes) {
      setStructures(storeVisitDetails.planogram_coords.regularShapes || []);
      setOpenStructure(storeVisitDetails?.planogram_coords?.openSpaces || []);
    }
        
      }
    }, []);

     useEffect(()=> {
      let value = coordinates.map((value, index) => {
        if(value?.photoCapture)
        {
          find_nearest(value.x, value.y, value.l, value.b, value.rotation);
        }
       
      })

      if (newCoordinates?.length > 0) {
      let cordinatesForImagePuddle = newCoordinates.map((value, index) => {
        if(value?.photoCapture)
        {
          find_nearest(value.x, value.y, value.l, value.b, value.rotation);
          
        }
       })

      }

     },[coordinates, newCoordinates]);

useEffect(() => {
  console.log('Store Visit Details:', storeVisitDetails);
  if(storeVisitDetails.status === 'finished') {
    setImageHistory(storeVisitDetails.images);
    setStoreName(storeVisitDetails.store_name);
    setTotalDistance(storeVisitDetails.distance);
    
    // Separate regular shapes and open spaces
    if (storeVisitDetails.planogram_coords) {
      // Process regular shapes
      const regularShapes = storeVisitDetails?.planogram_coords?.regularShapes?.map(shape => ({
        ...shape,
        color: '#E1E9FD',
        type: 'regular'
      }));
      setPlanstructures(regularShapes);

      // Process open spaces
      const openSpaces = storeVisitDetails?.planogram_coords?.openSpaces?.map(space => ({
        id: space.id,
        vertices: space.vertices,
        name: space.name || '',
        type: 'openSpace',
        isOpenSpace: true
      }));
      setOpenStructure(openSpaces);
    }
  }
}, [storeVisitDetails]);

useEffect(() => {
  if (!structures?.length || !vizDimensions) return;
  
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
      name: structure.name || '',
      type: 'regular',
      pathData,
      textX,
      textY,
      color: structure.color || '#E1E9FD',
      isBricked: structure.isBricked || false,
      isColored: structure.isColored || false,
      instructionData: structure.instructionData || {
        id: '',
        type: 'section',
        title: '',
        content: '',
        questions: []
      },
      onClick: () => {
        if (structure.instructionData) {
          setInstructionModal(true);
          setModalData(structure);
        }
      }
    };
  });

  setPolygons(newPolygons);
}, [structures, vizDimensions]);
    

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
      console.log("pstrucutres,",pstructures);
      if(pstructures.length>0){
    console.log((pstructures))

    // console.log(JSON.parse(pstructures[0]))
    // console.log(typeof(JSON.parse(pstructures[0])))
      }
      // else{
      //   return;
      // }
    setCenterX(vizDimensions.width / 2);
    setCenterZ(vizDimensions.height / 2);
    const centerx = vizDimensions.width / 2;
    const centerz = vizDimensions.height / 2;
    if(pstructures?.length>0){
    const newPolygons = pstructures.map((structure, structureIndex) => {
      // const parsedStructure = JSON.parse(structure);
      console.log("structure:",structure);
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
    
useEffect(() => {
  if (!openStructure?.length || !vizDimensions) return;

  setCenterX(vizDimensions.width / 2);
  setCenterZ(vizDimensions.height / 2);
  const centerx = vizDimensions.width / 2;
  const centerz = vizDimensions.height / 2;

  const newPolygons = openStructure.map((structure) => {
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
      isOpenSpace: true
    };
  });

  setOpenPolygon(newPolygons);
}, [openStructure, vizDimensions]);
  
  
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

console.log(imageHistory, 'image history')
console.log(distCoord, 'cordinates vlaues')

    return (
      <>
{coordinates.length>0?<>
<div className="w-full" style={{ backgroundColor: '#EFF4FE' }}>
    {/* Header Section */}


     <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'white',
            padding: '5px',
            paddingLeft: '15px',
            width: '100%'
          }}
          className="hover:cursor-pointer"
          // onClick={() => navigate('/')}
        >
          <div 
         onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center',marginLeft:15 }}>
            <img src={logo} alt="Logo" style={{ height: '25px', marginRight: '10px' }} />
            <h1 style={{ margin: 0, color: 'black', fontWeight: 500 }}>Store Visit Tracking</h1>
          </div>
          <div
           style={{backgroundColor:'white',borderRadius:'12px',padding:'5px', textAlign: 'right'}}
           className="control-panel" >
            <div>
            {/* <button
                // id="startButton"
                type="button"
                className='bg-[#5856D6] text-black rounded-[12px] flex items-center gap-2'
                onClick={(e) => {
                  createRipple(e);
                  handleStartButton();
                }}
              >
                Start <img src={vector1}/>
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
              
                <img src="/profile.svg" alt="profile" className=" w-[45px]" />
              </div>
              </div>
            </div>

    {/* Store Name and Distance container */}
    {/* <div className="flex" style={{ width: '70%', display: 'inline-block' }}>

  <div className="flex justify-between items-center mb-4 px-4 w-full">

    <div className="text-[#777FE3] bg-white items-center py-2 px-6 rounded-[12px]">
      <span className="font-medium">
       Store Id: {storeVisitDetails.store_id || ""}
      </span>
    </div>

    
  </div>
</div> */}

{/* <div className="pl-4 rounded-md flex flex-wrap items-center gap-4 mb-3 justify-end pr-[32%]">
        {company_legend.map((company, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded-sm" 
              style={{ backgroundColor: company.color }}
            />
            <span className="text-sm font-medium text-black">{company.name}</span>
          </div>
        ))}
      </div> */}



    {/* Main Layout */}
    <div className="layout-container mt-4" >
      
    <div  className="left-container bg-white rounded-[26px]">
  {/* Header Section - No background image */}
  <div className="p-4 border-b border-[#E1E9FD]">
    <div className="flex justify-between items-center">
      {/* Store Info */}
      <div className="flex items-center gap-4">
        <div className="text-black font-medium">{storeName || "Store Name"}</div>
        <div className="flex items-center gap-2 bg-[#FFF7E7] px-4 py-2 rounded-lg">
          <img src="/footprint.svg" alt="footprint" className="w-5 h-5 font-bold" />
          <span className="text-black font-bold">
            {totalDistance ? `${totalDistance.toFixed(2)}m` : '0.00m'}
          </span>
        </div>
      </div>

      {/* Company Legend */}
      <div className="flex items-center gap-4">
        {company_legend.map((company, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-5 h-5 rounded-sm" 
              style={{ backgroundColor: company.color }}
            />
            <span className="text-sm font-medium text-black">{company.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
  

   {/* Visualization Section - With background image */}
      <div 
          style={{width: "1000px",height: "500px",position:"relative"}}
        >
          <img src={storeVisitDetails.plano_bg_url} alt="Background" className=" inset-0 z-0"
       style={{width: "100%", height:" 100%" ,objectFit:"fill"}} />



      <div id="visualization" ref={vizRef} style={{
            position:'absolute',
            top: 0,
            left: 0,
            // backgroundImage: `url(${storeVisitDetails.plano_bg_url})`,
            // backgroundSize: "contain",
            // backgroundPosition: "center",
            // backgroundRepeat: "no-repeat",
            // // height: "calc(100% - 72px)", // Subtract header height
            // height:"500px",
            // width:"1000px",
            // transition: "background 0.5s ease-in-out",
          }}>
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
  <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, pointerEvents: "all", cursor: "pointer" }}>
    <defs>
      <pattern id="brickPattern" patternUnits="userSpaceOnUse" width="60" height="30">
        <rect width="60" height="30" fill="white" />
        <rect x="0" y="0" width="28" height="13" fill="#8897F1" />
        <rect x="30" y="0" width="28" height="13" fill="#8897F1" />
        <rect x="15" y="15" width="28" height="13" fill="#8897F1" />
        <rect x="45" y="15" width="28" height="13" fill="#8897F1" />
        <rect x="0" y="15" width="13" height="13" fill="#8897F1" />
      </pattern>
    </defs>
    {polygons.map((polygon) => (
      <g
        key={polygon.id}
        className={`structure ${polygon.type}`}
        title={polygon.name}
       
        onClick={() => {
          console.log('Opening instruction modal');
          setInstructionModal(true);
          setModalData(polygon);
        }}
      >
        <path
          d={polygon.pathData}
          fill={polygon.isBricked ? "url(#brickPattern)" : polygon.color}
          stroke="#000"
          strokeWidth="2"
          fillOpacity={polygon.isBricked ? "1" : "1"}
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
          { polygon.name || polygon.instructionData?.title}
        </text>
      </g>
    ))}
  </svg>
)}

              {isStructureVisible && (
        <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 5 }}>
          {openPolygon.map((polygon) => (
            <g key={polygon.id} className={`structure ${polygon.type}`}>
              <path
                d={polygon.pathData}
                fill="rgba(255, 243, 168, 0.3)"
                stroke="#000"
                strokeWidth="2"
              />
              {polygon.name && (
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
              )}
            </g>
          ))}
        </svg>
      )}



  
      

        
        
          {distCoord  &&  imageHistory.length > 0 &&  (
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
                      <img src={imageHistory[index]?.image_url} alt="" className="tooltip-image" />
                    </div>

                    {/* Measurement text */}
                    <div className="measurement-text">
                      <span className="measurement-label">Measurement:</span>
                      <span className="measurement-value">
                        {parseFloat(imageHistory[index]?.metadata?.measurementL).toFixed(1)}&times;{parseFloat(imageHistory[index]?.metadata?.measurementB).toFixed(1)}
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


            {/* image puddle display */}
             {distCoord  && imageHistory.length>0 && (
            distCoord.map((center, index) => {
              let comp = imageHistory[index]?.brand.toLowerCase() || "";
              const companyColor = company_legend.find(c => c.name.toLowerCase() === comp)?.color || '#cccccc'; // default color if not found
              let h = imageHistory[index]?.metadata?.measurementL*400
              let w = imageHistory[index]?.metadata?.measurementB*400
              console.log('helloo',comp);
              console.log("company color",companyColor);
              console.log("height",h);
              console.log("ceenter1",center[1]);
              return(
                <>
                  <div
                    className="circle"
                    style={{
                      position: 'absolute',
                      top: centerZ + center[1],
                      left: centerX + center[0],
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      // backgroundColor: company_legend[comp.name] || company_legend.default,
                      backgroundColor:companyColor,
                      opacity: 1,
                      zIndex: 10,
                    }}
                    onMouseEnter={() => { setIsHovering(index); console.log('hovering', index); }}
                    onMouseLeave={() => setIsHovering(null)}
                    onClick={() => setSelectedImage(index)}

                  ></div>
                 
                </>
              )
            })
          )} 
      </div>
      </div>


      </div>


       <div className="right-container"
            style={{
              margin:"5px",
              marginBottom: "7px"
          }}
          >
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
              <div id="imageContainer">
                {imageHistory.length > 0 ? (
                  // console.log("ai details",imageHistory,aiDetails),
                  imageHistory.map((image, index) => {
                    {/* let a = parseImageUrl(image.image_url); */}
                    
                    // let ai = getAI(image.url);
                    // console.log("AI:",ai);  
                    return (
                      <div
                        key={index}
                        className={`card ${selectedImage === index ? 'active' : ''} bg-[#F9F9FF] border border-[#EFF1FF] rounded-xl overflow-hidden transition-all duration-300`}
                        ref={(el) => (imageRefs.current[index] = el)}
                      >
                      <div className='p-3 rounded-full'>
                        <div className="card-image-container">
                          {/* NEW LINE: onClick added here to open modal */}
                          <img
                            src={image.image_url}
                            alt={`Report ${index}`}
                            className="w-full rounded-lg "
                            onClick={() => openModal(image.url)}
                          />
                        </div>
                      </div>
                        <div className="card-content">
                          {/* <div className="card-info px-4 py-3">
                            <div className="card-info-row">
                              <span className="card-info-label">Brand</span>
                              <span className="card-info-label">Merchandise</span>
                              <span className="card-info-label">Product</span>
                              <span className="card-info-label">Measurement</span>
                            </div>
                            <div className="card-info-row">
                              <span className="card-info-value">{a.brand || 'N/A'}</span>
                              <span className="card-info-value">{a.merchandise || 'N/A'}</span>
                              <span className="card-info-value">{a.product || 'N/A'}</span>
                              <span className="card-info-value">
                                {parseFloat(imageHistory[index].metadata.measurementL).toFixed(3)}&times;{parseFloat(imageHistory[index].metadata.measurementB).toFixed(3)}
                              </span>
                            </div>
                          </div> */}
      
                          <div className="card-info px-4 py-3">
                        <div className="grid grid-cols-10 gap-4 mb-2">
                          <span className="col-span-2 text-left font-normal text-black">Brand</span>
                          <span className="col-span-3 text-left font-normal text-black">Merchandise</span>
                          <span className="col-span-2 text-left font-normal text-black">Product</span>
                          <span className="col-span-3 text-left font-normal text-black">Measurement</span>
                        </div>
                        
                        <div className="grid grid-cols-10 gap-4">
                          <span className="col-span-2 text-left font-semibold text-indigo-400">{image.brand}</span>
                          <span className="col-span-3 text-left font-semibold text-indigo-400">{image.visual_merchandise}</span>
                          <span className="col-span-2 text-left font-semibold text-indigo-400">{image.product}</span>
                          <span className="col-span-3 text-left font-semibold text-indigo-400">
                          {parseFloat(image?.length).toFixed(3)}&times;{parseFloat(image?.breadth).toFixed(3)}
                
                          </span>
                        </div>
                      </div>
      
                          {/* Toggle button */}
      
                          {/* Extra Content - Conditionally rendered */}
                          {expandedCards[index] && (
                            <div className="extra-content-container m-4 p-4 rounded-lg bg-white animate-fadeIn"
                            style={{
                              animation: 'fadeIn 0.3s ease-in-out'
                            }}>
                              <div className="extra-header mb-3">
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
                          <div 
                              className="card-toggle px-4 py-3 flex items-center justify-center gap-2 cursor-pointer  transition-colors"
                              onClick={() => toggleCard(index)}
                         >
                            <span>See {expandedCards[index] ? 'Less' : 'More'}</span>
                        {expandedCards[index] ? (
                          <ChevronUp size={20} color="#717AEA" />
                        ) : (
                          <ChevronDown size={20} color="#717AEA" />
                        )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <>
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
                        <div className="relative">
            
          </div>
      
                        </>
                )}
              </div>
       </div>

       {instructionModal && (
  <div className="backdrop-blur-sm fixed inset-0 bg-black/30 flex items-center justify-center font-[Urbanist]" style={{ zIndex: 20 }}>
    <div className="bg-white rounded-[34px] shadow-lg w-full max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-[33px] bg-[#EFF4FE]">
        <div className="flex items-center">
          <h1 className="text-lg font-medium text-black ml-2">
            {modalData?.instructionData?.title || 'Instruction Details'}
          </h1>
        </div>
        <button
          className="text-gray-500 hover:text-gray-700 bg-[#F8F8F8] p-[4px] rounded-full"
          onClick={() => setInstructionModal(false)}
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Instruction Content */}
        <div>
          <h2 className="text-md font-semibold text-black mb-1">Content</h2>
          <p className="text-sm text-gray-700">
            {modalData?.instructionData?.content || "N/A"}
          </p>
        </div>

        {/* Questions */}
        <div>
          <h2 className="text-md font-semibold text-black mb-2">Questions</h2>
          <ul className="space-y-2">
            {modalData?.instructionData?.questions?.map((q, index) => (
              <li key={q.id} className="text-sm text-gray-800">
                <span className="font-medium">{index + 1}. </span>
                {q.question || "N/A"}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
)}
      
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