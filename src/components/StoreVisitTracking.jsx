import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './store.css';
import logo from '../assets/logo.png'
import star from '../assets/star.png'
import axios, { all } from 'axios';
import samsung from '../assets/samsung.png'
import google from '../assets/google.png' 
import vivo from '../assets/vivo.png'
import oppo from '../assets/opppo.png'
import apple from '../assets/apple.png'
import layout from '../assets/store_layout.png'
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import ConnectionErrorModal from './ConnectionErrorModal';
import {ChevronUp, ChevronDown } from 'lucide-react';
import lg from '../assets/lg.png'
import vector1 from '../assets/Vector1.png'
import vector2 from '../assets/Vector2.png'
import { MessageCircle } from 'lucide-react';

const backendUrl=import.meta.env.NEXT_PUBLIC_BACKEND_URL;

const StoreVisitTracking = () => {
  // State variables
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
  const [save,setSave]=useState(false);
  const [itr,setItr]=useState(0);
  const [planstructures,setPlanstructures]=useState([]);
  const [openStructure,setOpenStructure]=useState([]);
  const [storeVisitDetails, setStoreVisitDetails] = useState([]);
  const [lastStructure,setLastStructure]=useState('');
  const [modalData, setModalData] = useState(null);
  const [instructionModal,setInstructionModal]=useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [storeName,setStoreName]=useState();
  const [openPolygon, setOpenPolygon] = useState([]);
  const [higlightPolygon, setHiglightPolygon] = useState([]);
  const [highlightStructure, setHighlightStructure] = useState([]);
  const [isDirectionActive, setIsDirectionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeDirection, setActiveDirection] = useState(null);
  let planogram_coords;
  let open_coords;
  const company_legend= [
    { name: 'Google', color: '#FC7561' },
    { name: 'Samsung', color: '#FFB726' },
    { name: 'Apple', color: '#7373F9' },
  ]
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
    // localStorage.getItem
    handleClearButton();
  }, [])
  
  // const structures = [
  //   // {
  //   //   id: 'shelf-1',
  //   //   name: 'A',
  //   //   type: 'shelf',
  //   //   coordinates: [[-500,-250], [-500, 250], [500, 250], [500, -250]]  
  //   // },
  //   // {
  //   //   id:'origin',
  //   //   name: 'o',
  //   //   type: 'entrance',
  //   //   coordinates: [[0,0], [0,0], [0, 0], [0, 0]]
  
  //   // },
  //   {
  //     id: 'bottom-entry',
  //     name: 'B',
  //     type: 'counter',
  //     coordinates:  [[-500, -250], [-500, -150], [-450, -150], [-450, -250]] 
  //   },
  //   {
  //     id: 'top-entry',
  //     name: 'C',
  //     type: 'counter',
  //     coordinates: [[-500, 250], [-500, 150], [-450, 150], [-450, 250]] 
  //   },
  //   {
  //     id: 'wearables',
  //     name: 'D',
  //     type: 'entrance',
  //     coordinates: [[-450, -250], [-450, -220], [50, -220], [50, -250]] 
  //   },
  //   {
  //     id: 'home appliance',
  //     name: 'E',
  //     type: 'entrance',
  //     coordinates:   [[50, -250], [50, -190], [500, -190], [500, -250]]  
  //   },
  //   // {
  //   //   id: 'PC-notebook',
  //   //   name: 'F',
  //   //   type: 'display',
  //   //   coordinates: [[-400, -220], [-400, -110], [50, -110], [50, -220]]  
  //   // },
  //   {
  //     id: 'apple-accesory',
  //     name: 'G',
  //     type: 'entrance',
  //     coordinates: [[-450, 250], [-450, 220], [50, 220], [50, 250]]  
  //   },
  //   // {
  //   //   id: 'samsung-wallbay',
  //   //   name: 'H',
  //   //   type: 'entrance',
  //   //   coordinates: [[50, 250], [50, 220], [500, 220], [500, 250]]  
  //   // },
  //   // {
  //   //   id: 'Cashier',
  //   //   name: 'I',
  //   //   type: 'shelf',
  //   //   coordinates: [[460, -160], [460, -60], [500, -60], [500, -160]]  
  //   // },
  //   // {
  //   //   id: 'samsung-tv',
  //   //   name: 'J',
  //   //   type: 'shelf',
  //   //   coordinates: [[460, -10], [460, 220], [500, 220], [500, -10]]  
  //   // },
  //   // {
  //   //   id:'tv-monitor',
  //   //   name: 'K',
  //   //   type: 'display',
  //   //   coordinates: [[-400, -110], [-400, 30], [-210, 30], [-210, -110]]
  //   // },
  //   {
  //     id:'wall',
  //     name: 'L',
  //     type: 'counter',
  //     coordinates: [[-200, -110], [-200, 30], [-170, 30], [-170, -110]]
  //   },
  //   {
  //     id:'pc-notebook',
  //     name: 'M',
  //     type: 'display',
  //     coordinates: [[-160, -100], [-160, 0], [50, 0], [50, -100]]
  //   },
  //   // {
  //   //   id:'oppo',
  //   //   name: 'N',
  //   //   type: 'display',
  //   //   coordinates: [[-140, 10], [-140, 70], [30, 70], [30, 10]]
  //   // },
  //   // {
  //   //   id:'apple-tomb-table',
  //   //   name: 'O',
  //   //   type: 'shelf',
  //   //   coordinates: [[-360, 100], [-360, 160], [-170, 160], [-170, 100]]
  //   // },
  //   // {
  //   //   id:'samsung-smart1',
  //   //   name: 'P',
  //   //   type: 'entrance',
  //   //   coordinates:[[150,80],[150,180],[200,180],[200,80]]
  //   // },
  //   {
  //     id:'samsung-smart2',
  //     name: 'Q',
  //     type: 'entrance',
  //     coordinates:[[250,80],[250,180],[300,180],[300,80]]
  //   },
  //   {
  //     id:'best-denki',
  //     name: 'R',
  //     type: 'shelf',
  //     coordinates:[[120,-110],[120,40],[220,40],[220,-110]]
  //   },
  //   {
  //     id:'samsung-oled',
  //     name: 'S',
  //     type: 'shelf',
  //     coordinates:[[260,-50],[260,20],[390,20],[390,-50]]
  //   }
  // ];

let currentStructure = null; // Tracks which structure the user is currently inside
const check_inside_structure = (x, z) => {
    let foundStructure = null;
  
    for (const structure of planogram_coords) {
      const coords = structure.vertices;
  
      const xs = coords.map(c => c[0]);
      const zs = coords.map(c => c[1]);
  
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minZ = Math.min(...zs);
      const maxZ = Math.max(...zs);
  
      if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) {
        foundStructure = structure;
        setHighlightStructure(structure);
        // console.log("highligting new strucuture")
        break; // found the structure we're in, no need to check others
      }
    }
  
    if (foundStructure) {
      if (!currentStructure || currentStructure.name !== foundStructure.name) {
        // User entered a new structure (or any structure for the first time)
        console.log("Entered new structure:", foundStructure.name);
        currentStructure = foundStructure;
        sendInstructions(foundStructure);
        setLastStructure(foundStructure.name);
        // highlightnewStruct(foundStructure);
        // console.log("highlight structure:", foundStructure);
        setHiglightPolygon(foundStructure);

      }
      // else: still inside same structure, do nothing
    } else {
      // Not inside any structure now — reset
      if (currentStructure !== null) {
        console.log("Exited structure:", currentStructure.name);
      }
      currentStructure = null;
      setHiglightPolygon([]);
    }
  };
  
  const handleRotation = async (direction) => {
    setIsLoading(true);
    setActiveDirection(direction); // Set active direction
    try {
      await axios.post('https://store-visit-85801868683.us-central1.run.app/api/rotation', {
        rotation: direction
      });
    } catch (error) {
      console.error(`Error sending ${direction} rotation:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendInstructions = (structure) => {
    console.log("check intstructions:",structure.instructionData);
    if(structure.instructionData==undefined){
      console.log("No instructions");
      return;
    }
    console.log("sending")
    let data = JSON.stringify({
      "region_id": structure?.id||"N/A",
      "region_name":structure?.name||"N/A",
    "instruction_set": structure?.instructionData||"N/A",
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://store-visit-85801868683.us-central1.run.app/api/region',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log((response.data));
    })
    .catch((error) => {
      console.log(error);
    });
    
  }

  function getAI(data) {
      //     const myHeaders = new Headers();
      // myHeaders.append("Content-Type", "application/json");

      // const raw = JSON.stringify({
      //   "image_link": imageurl
      // });

      // const requestOptions = {
      //   method: "POST",
      //   headers: myHeaders,
      //   body: raw,
      //   redirect: "follow"
      // };

      // fetch("https://banner-backend-85801868683.us-central1.run.app/api/get_banner_data", requestOptions)
      //   .then((response) => console.log(response))
      //   .then((result) => {
      //     console.log(result);
      //     setAIDetails((prevdetails) => [result, ...prevdetails]);

      //     ;return result})
      //   .catch((error) => {console.error(error);return error});


let payload = JSON.stringify({
  "image_link": data.url,
  "image_id": data.image_id,
  "measurementL": data.metadata.measurementL,
  "measurementB": data.metadata.measurementB,
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://banner-backend-85801868683.us-central1.run.app/api/get_banner_data',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : payload
};

axios.request(config)
.then((response) => {
  console.log((response.data));
  setAIDetails((prevdetails) => [...prevdetails,response.data]);
})
.catch((error) => {
  console.log(error);
  setAIDetails((prevdetails) => [...prevdetails,[{ error: "No banners detected" }]])
});

  }
  
// console.log(structures);
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
  function renderAllCoordinates() {
    // Clear all points
    // vizElement.innerHTML = "";

    // Render all coordinates (points only, no lines)
    coordinates.forEach((coord, index) => {
      // Add a small delay for each point to create a sequential appearance
      setTimeout(() => {
        renderPoint(coord);
      }, index * 20); // 20ms delay between each point
    });
  }
  function updateDistanceDisplay(coord) {
    const distanceDisplay = distanceDisplayRef.current;
    if (!distanceDisplay) return;
    // Animate the distance change
    const currentDistance = Number.parseFloat(
      distanceDisplay.textContent.replace("Distance: ", "")
    );
    const targetDistance = coord.distance;

    // Use requestAnimationFrame for smooth animation
    const animateDistance = (
      timestamp,
      startValue,
      endValue,
      startTime,
      duration = 500
    ) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;

      distanceDisplay.textContent = `Distance: ${currentValue.toFixed(2)}`;
      setTotalDistance(currentValue);

      if (progress < 1) {
        requestAnimationFrame((time) =>
          animateDistance(time, startValue, endValue, startTime, duration)
        );
      }
    };

    requestAnimationFrame((timestamp) =>
      animateDistance(timestamp, currentDistance, targetDistance)
    );
  }
  function renderCoordinate(coord) {
    renderPoint(coord);
  }
  function renderPoint(coord) {
    // console.log('coord',coord);
    // // Transform coordinates from -100,100 range to screen position
    // // (0,0) at center of screen
    // // plotO();
    // console.log(coord.x,coord.z);
    
    // console.log(centerX,centerZ);
    let screenX = centerX + (coord.x * centerX) / 100;
    let screenZ = centerZ + (coord.z * centerZ) / 100;
    
    // console.log(screenX,screenZ);

    if (coord.photoCapture === 1) {
      const vizElement = document.getElementById("visualization");
      let trial=find_nearest(coord.x,coord.z,coord.l,coord.b,coord.rotation);
      // console.log(trial);
    }
  }
  function getPerpendicularDistanceAndPoint(x, z, x1, z1, x2, z2) {
    // Vector from (x1,z1) to (x2,z2)
    const edgeVectorX = x2 - x1;
    const edgeVectorZ = z2 - z1;
    
    // Vector from (x1,z1) to point (x,z)
    const pointVectorX = x - x1;
    const pointVectorZ = z - z1;
    
    // Length of the edge squared
    const edgeLengthSquared = edgeVectorX * edgeVectorX + edgeVectorZ * edgeVectorZ;
    
    // If edge is just a point, return distance to that point
    if (edgeLengthSquared === 0) {
        const distance = Math.sqrt(pointVectorX * pointVectorX + pointVectorZ * pointVectorZ);
        return { distance, point: [x1, z1] };
    }
    
    // Calculate projection ratio (t) of point onto edge
    const t = Math.max(0, Math.min(1, 
        (pointVectorX * edgeVectorX + pointVectorZ * edgeVectorZ) / edgeLengthSquared
    ));
    
    // Calculate the perpendicular point on the edge
    const projX = x1 + t * edgeVectorX;
    const projZ = z1 + t * edgeVectorZ;
    
    // Calculate the distance
    const distance = Math.sqrt((x - projX) ** 2 + (z - projZ) ** 2);
    
    return { distance, point: [projX, projZ] };
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
  
    // Find the nearest quadrilateral based on Euclidean distance
    // structures.forEach(structure => {
    //   structure.coordinates.forEach(coord => {
    //     const [x1, z1] = coord;
    //     const distance = Math.sqrt((x1 - x) ** 2 + (z1 - z) ** 2);
    //     if (distance < minDistance) {
    //       minDistance = distance;
    //       nearestStructure = structure;
    //     }
    //   });
    // });
  //   structures.forEach(structure => {
  //     const centroid = getPolygonCenter(structure.coordinates);
  //     const distance = Math.sqrt((centroid[0] - x) ** 2 + (centroid[1] - z) ** 2);
  
  //     if (distance < minDistance) {
  //         minDistance = distance;
  //         nearestStructure = structure;
  //     }
  // });
  // planogram_coords.forEach(structure => {
  //   let minEdgeDistance = Infinity;
  //   let closestPointOnEdge = null; 
  
  //   for (let i = 0; i < structure.coordinates.length; i++) {
  //       // Get two consecutive points forming an edge
  //       let [x1, z1] = structure.coordinates[i];
  //       let [x2, z2] = structure.coordinates[(i + 1) % 4];

  //       let result = getPerpendicularDistanceAndPoint(x, z, x1, z1, x2, z2);
  //           let distance = result.distance;
  //           let point = result.point;
  //       // Calculate perpendicular distance from (x, z) to this edge
  //       // let distance = getPerpendicularDistance(x, z, x1, z1, x2, z2);
  
  //       if (distance < minEdgeDistance) {
  //           minEdgeDistance = distance;
  //           closestPointOnEdge = point;
  //       }
  //   }
  //   // Update nearest quadrilateral based on the smallest perpendicular distance
  //   if (minEdgeDistance < minDistance) {
  //       minDistance = minEdgeDistance;
  //       nearest = structure;
  //       perpendicularPoint = closestPointOnEdge;
  //       setNearestStructure(structure);
  //       // nearestStructure = structure;
  //   }
  // });
  
  //   if (minDistance===Infinity) {
  //     console.error("No nearby quadrilateral found.");
  //     // return null;
  //   }
  
  //   console.log("Nearest Structure:", nearest.name);
  //   console.log("Perpendicular Point:", perpendicularPoint);
  
  //   const center = [...getPolygonCenter(nearest.coordinates)];
  //   console.log("Center:", center);
  //   setCenterCoord((prev) => {
  //     // console.log("Previous State:", prev);
  //     const updated = [center, ...prev];
  //     // console.log("Updated State:", updated);
  //     return updated;
  //   });

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
    // const pcoordinates=[
    //   [perpendicularPoint[0] - l, perpendicularPoint[1] - b/2], // Top-left
    //   [perpendicularPoint[0] - l, perpendicularPoint[1] + b/2],
    //   [perpendicularPoint[0] , perpendicularPoint[1] + b/2], // Bottom-right
    //   [perpendicularPoint[0] , perpendicularPoint[1] - b/2], // Top-right
    //    // Bottom-left
    // ]
    // const angle=90;
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

    setPstructures(prevStructures => [
      ...prevStructures,
      { coordinates: pcoordinates }
    ]);
    console.log("pcoordinates:",pcoordinates);
    console.log("Pstructures:",pstructures);
    return { nearestStructure };
  
  }

  function getNewCoordinates(x, z, angle) {
    const radians = (angle * Math.PI) / 180; // Convert angle to radians
    const distance = 100; // Given distance

    const newX = x + distance * Math.cos(radians);
    const newZ = z - distance * Math.sin(radians);

    return [newX, newZ];
}

const get_store_visit_details = (store_visit_id) => {
  let url1 = `https://store-visit-85801868683.us-central1.run.app/api/get_store_visit_details?store_visit_id=${store_visit_id}`;
  
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: url1,
    headers: { }
  };
  
  axios.request(config)
  .then((response) => {
    console.log((response.data));
    setItr(1);
    setPlanstructures(response.data.planogram_coords)
    setStoreVisitDetails(response.data)

  })
  .catch((error) => {
    console.log(error);
  });
  
}

  function renderAllImages(history) {
    console.log("render images")
    console.log(imageHistory);
  }

  function parseImageUrl(url) {
    try {
      // Decode the URL to handle any encoded characters
      const decodedUrl = decodeURIComponent(url);
      
      // Extract the filename portion from the URL
      let filename = null;
      if (decodedUrl.includes('/o/ARTracker%2F')) {
        filename = decodedUrl.split('/o/ARTracker%2F')[1];
      } else if (decodedUrl.includes('/o/ARTracker/')) {
        filename = decodedUrl.split('/o/ARTracker/')[1];
      }
      
      if (!filename) {
        return defaultResponse();
      }
      
      // Remove the query parameters
      filename = filename.split('?')[0];
      
      // Extract everything before .png
      const nameWithoutExtension = filename.split('.png')[0];
      
      // Split the filename by underscores
      const parts = nameWithoutExtension.split('_');
      
      // Basic structure validation - need at least 3 parts (brand, merchandise, product)
      if (parts.length < 3) {
        return defaultResponse();
      }
      
      // Extract the values
      const brand = parts[0] || "Unknown";
      const merchandise = parts[1] || "Unknown";
      const product = parts[2] || "Unknown";
      
      // Extract measurements if they exist
      let measurementL = "N/A";
      let measurementB = "N/A";
      
      if (parts.length > 3) {
        measurementL = parts[3] || "N/A";
      }
      
      if (parts.length > 4) {
        measurementB = parts[4] || "N/A";
      }
      
      return {
        brand,
        merchandise,
        product,
        measurementL,
        measurementB
      };
    } catch (error) {
      console.error("Error parsing image URL:", error);
      return defaultResponse();
    }
  }
  
  // Default response function for consistent fallback
  function defaultResponse() {
    return {
      brand: "Unknown",
      merchandise: "Unknown",
      product: "Unknown",
      measurementL: "N/A",
      measurementB: "N/A"
    };
  }

  // function highlightnewStruct(structure1) {
  //   console.log('highlightnewStruct:', structure1);
  
  //   setCenterX(vizDimensions.width / 2);
  //   setCenterZ(vizDimensions.height / 2);
  //   const centerx = vizDimensions.width / 2;
  //   const centerz = vizDimensions.height / 2;
  
  //   let pathData = "";
  //   structure1.vertices.forEach((coord, index) => {
  //     const screenX = centerx + coord[0];
  //     const screenZ = centerz + coord[1];
  
  //     pathData += index === 0 ? `M ${screenX} ${screenZ} ` : `L ${screenX} ${screenZ} `;
  //   });
  
  //   pathData += "Z"; // Close the polygon
  
  //   const centerCoord = getPolygonCenter(structure1.vertices);
  //   const textX = centerx + centerCoord[0];
  //   const textY = centerz + centerCoord[1];
  
  //   const polygonData = {
  //     id: structure1.id,
  //     name: structure1.name,
  //     type: structure1.type,
  //     pathData,
  //     textX,
  //     textY,
  //     color: structure1.isColored ? structure1.color : '#E1E9FD',
  //     instructionData: structure1.instructionData,
  //     isBricked: structure1.isBricked,
  //   };
  
  //   setHiglightPolygon([polygonData]);
  //   console.log('highlight structure:', [polygonData]);
  // }
  
  useEffect(() => {

    if (!planstructures?.length || !vizDimensions) return;

      // console.log(vizDimensions.width,vizDimensions.height);
      setCenterX(vizDimensions.width / 2);
      setCenterZ(vizDimensions.height / 2);
     const centerx = vizDimensions.width / 2;
     const centerz = vizDimensions.height / 2;


    const newPolygons = planstructures.map((structure) => {
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
        color: structure.isColored?structure.color:'#E1E9FD',
        instructionData: structure.instructionData,
        isBricked: structure.isBricked,
      };
    });

    setPolygons(newPolygons);
    console.log('planstructures:',planstructures);
  }, [planstructures,vizDimensions]);
  useEffect(() => {

    if (!openStructure?.length || !vizDimensions) return;

      // console.log(vizDimensions.width,vizDimensions.height);
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
        color: structure.isColored?structure.color:'#E1E9FD',
        instructionData: structure.instructionData,
        isBricked: structure.isBricked,
      };
    });

    setOpenPolygon(newPolygons);
    console.log('open structure:',openStructure);
  }, [openStructure,vizDimensions]);


  const pPolygonsRef = useRef([]);

  useEffect(() => {
    // console.log("Inside use effecttt:", pstructures);
    setCenterX(vizDimensions.width / 2);
    setCenterZ(vizDimensions.height / 2);
    const centerx = vizDimensions.width / 2;
    const centerz = vizDimensions.height / 2;
  
    const newPolygons = pstructures.map((structure, structureIndex) => {
      let pathData = "";
      let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  
      structure.coordinates.forEach((coord, index) => {
        const screenX = centerx + coord[0];
        const screenZ = centerz + coord[1];
    
        pathData += index === 0 ? `M ${screenX} ${screenZ} ` : `L ${screenX} ${screenZ} `;
        minX = Math.min(minX, screenX);
        maxX = Math.max(maxX, screenX);
        minY = Math.min(minY, screenZ);
        maxY = Math.max(maxY, screenZ);
      });
  
      pathData += "Z"; // Close the polygon
  
      const centerCoord = getPolygonCenter(structure.coordinates);
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
    // console.log("PPolygons:", newPolygons);

  }, [pstructures, vizDimensions]);
  

// Add state for the visualization dimensions

// Update the useEffect to include visualization sizing logic
useEffect(() => {
  // Function to update dimensions
  const updateDimensions = () => {
    if (vizRef.current) {
      setVizDimensions({
        width: vizRef.current.offsetWidth,
        height: vizRef.current.offsetHeight
      });
    }
  };

  // Initial dimensions update
  updateDimensions();

  // Add resize event listener
  window.addEventListener('resize', updateDimensions);

  // Cleanup
  return () => {
    window.removeEventListener('resize', updateDimensions);
  };
}, []);
  // Connect to Socket.IO when component mounts
  useEffect(() => {
    // socketRef.current = io();
    socketRef.current = io("https://store-visit-85801868683.us-central1.run.app");
    socketRef.current.on("connect", () => {
      console.log("Connected to server with ID:", socketRef.current.id);
      setIsConnected(true);
      setShowConnectionModal(false);
    });
    socketRef.current.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
      setIsConnected(false);
      setShowConnectionModal(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      setShowConnectionModal(true);
    });
    
    // Receive coordinate history
    socketRef.current.on("coordinate-history", (history) => {
      console.log("Received coordinate history:", history);
      setCoordinates(history);
  
      // Update distance if there are coordinates
      if (history.length > 0) {
        const lastCoord = history[history.length - 1];
        setTotalDistance(lastCoord.distance);
        updateDistanceDisplay(lastCoord);
      }
      console.log("render coordinates")
      renderAllCoordinates();
    });
  
    // Receive image history
    socketRef.current.on("image-history", (history) => {
      console.log("Received image history:", history);
      //setImageHistory(history);
      //updateImagePointMap();
      //renderAllImages(history);
    });
    socketRef.current.on("store-id",(data)=>{
      console.log("Store ID:",data);
      setStoreName(data.store_name);
      setPlanstructures(data.planogram_coords.regularShapes);
      planogram_coords=data.planogram_coords.regularShapes;
      open_coords=data.planogram_coords.openSpaces;
      setOpenStructure(data.planogram_coords.openSpaces);
      setStoreVisitDetails(data);

    });
    // Receive new coordinate
    socketRef.current.on("new-coordinate", (data) => {
      console.log("New coordinate received:", data);
      // if(itr==0)
      // {
      //   get_store_visit_details(data.store_visit_id);
      // }
      if (data) {
        // const lastCoord = history[history.length - 1];
        console.log(data.distance, 'distance')
        setTotalDistance(data.distance);
        // updateDistanceDisplay(lastCoord);
      }
      if(planogram_coords?.length>0){
      // console.log("planstructures",planogram_coords);
      check_inside_structure(data.x,data.z);
      }
      if(data.photoCapture===1)
      {
        console.log("Photo capture",data);
      }
      setCoordinates(prevCoordinates => [...prevCoordinates, data]);
      // setTotalDistance(data.distance);
      updateDistanceDisplay(data);
      // console.log("render coordinate")
      renderCoordinate(data);
      if(data.store_visit_complete==="true")
      {
        console.log("Store visit complete");
        setSave(true);
      }
    });
  
    // Receive new image
    // Separate function to post the payload to the update endpoint
const postPayload = (payload) => {
  axios.post(
    'https://store-visit-85801868683.us-central1.run.app/api/update_store_visit',
    payload,
    { headers: { 'Content-Type': 'application/json' } }
  )
  .then((response) => {
    console.log("Payload published successfully:", response.data);
  })
  .catch((error) => {
    console.error("Error publishing payload:", error);
  });
};

// Socket event handler for new-image remains largely unchanged
socketRef.current.on("new-image", (data) => {
  console.log("New image received:", data);

  // Existing functionality: process AI and update state
  let aisummary = getAI(data);
  setImageHistory(prevHistory => [...prevHistory, data]);

  // Access the latest pPolygons from the ref
  const latestPPolygons = pPolygonsRef.current;
  console.log("Latest PPolygons:", latestPPolygons);
  // For example, if you want to use the coordinates of the last polygon:
  const latestPolygonCoordinates = latestPPolygons.length > 0 
    ? latestPPolygons[latestPPolygons.length - 1].coordinates 
    : [];

  const payload = {
    image_id: data.image_id,
    polygon_coordinates: latestPolygonCoordinates,
  };

  console.log("Payload:", payload);
  postPayload(payload);
});



  
    // Coordinates cleared
    socketRef.current.on("coordinates-cleared", () => {
      console.log("Coordinates cleared");
      setCoordinates([]);
      setTotalDistance(0);
      updateDistanceDisplay({ distance: 0 });
      
      // Create a new map for image points
      const newMap = new Map(imagePointMap);
      setImagePointMap(newMap);
    });
  
    // Images cleared
    socketRef.current.on("images-cleared", () => {
      console.log("Images cleared");
      setImageHistory([]);
      setImagePointMap(new Map());
    });
  
    // Clean up on component unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []); // Dependency array
  
// useEffect(() => {

//   savePlanogram();
// }, [save]);
    

const savePlanogram = () => {
  console.log("Ppolygons are:",pPolygons);
  let data1 = JSON.stringify({
    "store_visit_id": coordinates[0].store_visit_id,
    "polygon_cords": pPolygons,
    "total_distance": totalDistance
  });
  console.log("Data to send to saveee:", data1);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://store-visit-85801868683.us-central1.run.app/api/update_store_visit',
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data1
  };
  
  axios.request(config)
  .then((response) => {
    console.log((response.data));
    handleClearButton();
  })
  .catch((error) => {
    console.log(error);
  });
}
  
  // Add these functions to handle button actions
  const handleClearButton = () => {
    if (socketRef.current) {
      socketRef.current.emit("clear-coordinates");
      socketRef.current.emit("clear-images");
    }
    fetch("https://store-visit-85801868683.us-central1.run.app/api/all", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log("Response:", data))
      .catch((error) => console.error("Error:", error));
    
    // Also update local state
    setCoordinates([]);
    setImageHistory([]);
    setTotalDistance(0);
    setDistance(0);
    setImagePointMap(new Map());
    setCenterCoord([]);
    setPerpendicularCoord([]);
    setPPolygons([]);
    setPstructures([]);
    setAIDetails([]);
    setDistcoord([]);
    setPlanstructures([]);
    planogram_coords=[];
    setStoreName("");
    setStoreVisitDetails({});
    setPolygons([]); // Clear polygons
    // openStructure=[];
    open_coords = [];
    setOpenStructure([]);
    setOpenPolygon([]);


  };
  
  const handleStartButton = () => {
    setIsActive(!isActive);
    
    if (socketRef.current) {
      socketRef.current.emit(isActive ? "stop-tracking" : "start-tracking");
    }

    let x = Math.round((Math.random() * 200 - 100) * 100) / 100;
    let z = Math.round((Math.random() * 200 - 100) * 100) / 100;
    x=(x/100)*500;
    z=(z/100)*250;
    let l=0;
    let b=0;
    // Increase total distance by a small random amount
    // totalDistance += Math.random() * 0.1;
// Increase total distance by a small random amount
  setTotalDistance(prev => prev + Math.random() * 0.1);

    // Randomly include a photo capture (1) or not (0)
    const photoCapture = Math.random() > 0.5 ? 1 : 0;

    const timestamp = Date.now();
    let data = JSON.stringify({
      "coordinates": {
        "distance": 100,
        "x": x,
        "z": z,
        "photoCapture": photoCapture,
        "l": 0,
        "b": 0,
        "timestamp": timestamp,
        "store_id": "store1",
        "store_visit_complete": Math.random() > 0.6 ? "true" : "false"
      }
    });
    
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://store-visit-85801868683.us-central1.run.app/api/coordinates',
      headers: { 
        'Content-Type': 'application/json'
      },
      data : data
    };
    
    axios.request(config)
    .then((response) => {
      console.log((response.data));
      if (photoCapture === 1) {
        // Use a random selection of image URLs for testing
        // const testImages = [
        //   "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FGoogle_Poster_Phone_0.9244657.png?alt=media&token=7affeac9-1f60-42b1-9e1f-d2c65a348da8",
        //   "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FApple_Poster_Phone.png?alt=media&token=7f75f533-e249-44e3-8056-adca5caef03d",
        //   "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FSamsung_Display_Tablet.png?alt=media&token=12345678",
        //   "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FLGE_Banner_TV.png?alt=media&token=87654321",
        // ];
        const testImages=[
          "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FSamsung_DummyDevice_Watch_0_0.png?alt=media&token=57327a02-caf0-4bd5-a13c-7dcb3604f497"
          ,"https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FGoogle_Poster_Phone_0.5271072.png?alt=media&token=00c0492e-057b-477c-b49c-44a604bc88d6",
          "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2Fgoogle_dummy_phone_9_5.jpg?alt=media&token=8c13c2aa-dd7e-48c0-9353-607951ac7f39",
        ]

        const imageUrl =
          testImages[Math.floor(Math.random() * testImages.length)];

        // For testing, also send randomized banner data
        const brands = ["Google", "Apple", "Samsung", "LGE"];
        const positions = ["Top Shelf", "Eye Level", "Bottom Shelf", "End Cap"];
        const types = ["Phone", "Tablet", "TV", "Laptop"];
        
        const randomBrand = brands[Math.floor(Math.random() * brands.length)];
        const randomPosition = positions[Math.floor(Math.random() * positions.length)];
        const randomType = types[Math.floor(Math.random() * types.length)];


        let data = JSON.stringify({
          "imageUrl": "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FApple_Tabletop%20Dummy_Watch_0.46_0.35.png?alt=media&token=...",
          "metadata": {
            "brand": randomBrand,
            "merchandise": "Tabletop Dummy",
            "product": "Watch",
            "measurementL": 0.48,
            "measurementB": 0.35,
            "store_id": "store12",
            "rotation": 45
          }
        });
        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: 'https://store-visit-85801868683.us-central1.run.app/api/image',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : data
        };
        
        axios.request(config)
        .then((response) => {
          console.log((response.data));

           fetch("https://store-visit-85801868683.us-central1.run.app/api/banner_data", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                imageUrl: imageUrl,
                brand: randomBrand,
                position: randomPosition,
                type: randomType,
              }),
            })
              .then((response) => response.json())
              .then((data) => console.log("Banner Data Response:", data))
              .catch((error) => console.error("Error sending banner data:", error));
        })
        .catch((error) => {
          console.log(error);
        });
        

        // First post the image

          

      }

    })
    .catch((error) => {
      console.log(error);
    });
    
  };

  const toggleStructure = () => {
    setIsStructureVisible(!isStructureVisible);
  };
  const togglePath = () => {
    setIsPathVisible(!isPathVisible);
  }

  // Function to create a ripple effect on button click
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

// console.log(totalDistance, "totaldistance")
console.log(aiDetails,'aidetials')
return (
  <div className="container" style={{ backgroundColor: '#EFF4FE' }}>
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
          <button
          type="button"
          style={{ 
            background: isDirectionActive ? 'var(--S-500, #717AEA)' : 'var(--S-50, #EFF4FE)', 
            padding: '10px',
            position: 'relative'
          }}
          className="flex items-center gap-2 group hover:relative"
          onClick={(e) => {
            createRipple(e);
            setIsDirectionActive(!isDirectionActive);
            // handleClearButton();
          }}
        >
          <img 
            src="/fork_right.svg" 
            style={{ 
              width: '28px', 
              height: '28px',
              filter: isDirectionActive ? 'brightness(0) invert(1)' : 'none'
            }} 
          />
          
          {/* Tooltip */}
          <div className="absolute invisible group-hover:visible top-full left-1/2 transform -translate-x-1/2 mt-2">
            <div className="relative">
              {/* Triangle/Caret */}
              <div 
                className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-full"
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: '6px solid transparent',
                  borderRight: '6px solid transparent',
                  borderBottom: '6px solid #333'
                }}
              />
              {/* Tooltip content */}
              <div 
                className="bg-[#333] text-white px-3 py-1 rounded text-sm whitespace-nowrap"
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}
              >
                Directions
              </div>
            </div>
          </div>
        </button>

          <button
            // id="clearButton"
            type="button"
            style={{ background: 'var(--S-50, #EFF4FE)', color: "black", "fontWeight": "bold" , padding:'10px'}}
            className="flex items-center gap-2"
            onClick={(e) => {
              // createRipple(e);
              handleClearButton();
            }}
            >
             <img src="/delete_forever.svg" style={{ width: '28px', height: '28px' }} /> 
            </button>
            <img src="/profile.svg" alt="profile" className=" w-[45px]" />
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


{/* <div className="flex" style={{ width: '70%', display: 'inline-block' }}>

  <div className="flex justify-between items-center mb-4 px-4 w-full mt-2">

    <div className="text-[#777FE3] bg-white items-center py-2 px-6 rounded-[12px]">
      <span className="font-medium">
       Store Id: {storeVisitDetails.store_id || ""}
      </span>
    </div>

  
  </div>
</div> */}


{/* company legend display
<div className="pl-4 rounded-md flex flex-wrap items-center gap-4 mb-3 justify-end pr-[32%]">
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
  <div className="p-4 pl-6 pr-6 border-b border-[#E1E9FD]">
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

       {/* Navigation Controls with transition */}
       <div className={`flex items-center gap-2 bg-[#ECF2FF] px-1.5 py-1.5 rounded-lg transition-all duration-300 ease-in-out ${
  isDirectionActive ? 'opacity-100 max-w-[500px]' : 'opacity-0 max-w-0 overflow-hidden'
}`}>
  <button 
    className={`p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 ${
      activeDirection === 'up' ? 'bg-[#717AEA]' : 'bg-white'
    }`}
    onClick={() => handleRotation('up')}
    disabled={isLoading}
  >
    <img 
      src="/turn_up.svg" 
      alt="Turn Up" 
      className="w-5 h-5"
      style={{ filter: activeDirection === 'up' ? 'brightness(0) invert(1)' : 'none' }}
    />
  </button>
  
  <button 
    className={`p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 ${
      activeDirection === 'left' ? 'bg-[#717AEA]' : 'bg-white'
    }`}
    onClick={() => handleRotation('left')}
    disabled={isLoading}
  >
    <img 
      src="/turn_left.svg" 
      alt="Turn Left" 
      className="w-5 h-5"
      style={{ filter: activeDirection === 'left' ? 'brightness(0) invert(1)' : 'none' }}
    />
  </button>
  
  <button 
    className={`p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 ${
      activeDirection === 'right' ? 'bg-[#717AEA]' : 'bg-white'
    }`}
    onClick={() => handleRotation('right')}
    disabled={isLoading}
  >
    <img 
      src="/turn_right.svg" 
      alt="Turn Right" 
      className="w-5 h-5"
      style={{ filter: activeDirection === 'right' ? 'brightness(0) invert(1)' : 'none' }}
    />
  </button>
  
  <button 
    className={`p-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 ${
      activeDirection === 'down' ? 'bg-[#717AEA]' : 'bg-white'
    }`}
    onClick={() => handleRotation('down')}
    disabled={isLoading}
  >
    <img 
      src="/turn_down.svg" 
      alt="Turn Down" 
      className="w-5 h-5"
      style={{ filter: activeDirection === 'down' ? 'brightness(0) invert(1)' : 'none' }}
    />
  </button>
</div>
      </div>

      {/* Company Legend */}
      <div className="flex items-center gap-4">
        {company_legend.map((company, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-lg " 
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
    style={{
      backgroundImage: `url(${storeVisitDetails.plano_bg_url})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      // height: "calc(100% - 65px)", // Subtract header height
      transition: "background 0.5s ease-in-out",
    }}
  >

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
            .map(point => `${centerX + point.x},${centerZ + point.z}`)
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
        return(
        <div
          key={index}
          className={`point ${point.photoCapture ? 'photo-captured' : ''}`}
          style={{
            left: `${centerX+ point.x}px`,
            top: `${centerZ+point.z}px`
          }}
        />
      )})}
    </>
  )}

  {/* Store structure overlay and other SVG elements remain unchanged */}
  {isStructureVisible && <div className="overlay"></div>}
  {isStructureVisible && (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0,zIndex:10,pointerEvents:"all",cursor:"point"}}>
      <defs>
    <pattern id="brickPattern" patternUnits="userSpaceOnUse" width="60" height="30">
      {/* Background color for mortar */}
      <rect width="60" height="30" fill="white" />
      
      {/* First row of bricks */}
      <rect x="0" y="0" width="28" height="13" fill="#8897F1" />
      <rect x="30" y="0" width="28" height="13" fill="#8897F1" />
      
      {/* Second row of bricks - offset */}
      <rect x="15" y="15" width="28" height="13" fill="#8897F1" />
      <rect x="45" y="15" width="28" height="13" fill="#8897F1" />
      <rect x="0" y="15" width="13" height="13" fill="#8897F1" />
    </pattern>
  </defs>
      {polygons.map((polygon,index) => 
        {
          // console.log(polygon)
          return(
            <g
            key={polygon.id}
            className={`structure ${polygon.type} `}
            title={polygon.name}
            onClick={() => {
              console.log('hello');
              setInstructionModal(true);
              setModalData(polygon);
            }}
          >
                            <path
                              d={polygon.pathData}
                              // fill={polygon.color}
                              fill={polygon.isBricked ? "url(#brickPattern)" : polygon.color}
                              stroke="#000"
                              strokeWidth="2"
                              // fillOpacity="0.5
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
                                     {polygon.instructionData?.title || ''}

                              {/* {polygon.instructionData} */}
                            </text>
                          </g>
        )}
        
      )}
    </svg>
  )}
    {isStructureVisible && (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0,zIndex:5,pointerEvents:"all",cursor:"point"}}>
      {openPolygon.map((polygon,index) => 
        {
          // console.log(polygon)
          return(
            <g
            key={polygon.id}
            className={`structure ${polygon.type} `}
            title={polygon.name}
          >
                            <path
                              d={polygon.pathData}
                              // fill={polygon.color}
                              fill="#FFF3A8"
                              stroke="#000"
                              strokeWidth="2"
                              // fillOpacity="0.5
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
                                    {/* {polygon.name} */}

                              {/* {polygon.instructionData} */}
                            </text>
                          </g>
        )}
        
      )}
    </svg>
  )}
      {!isStructureVisible && (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0,zIndex:5,pointerEvents:"all",cursor:"point"}}>
      <defs>
    <pattern id="brickPattern" patternUnits="userSpaceOnUse" width="60" height="30">
      {/* Background color for mortar */}
      <rect width="60" height="30" fill="white" />
      
      {/* First row of bricks */}
      <rect x="0" y="0" width="28" height="13" fill="#8897F1" />
      <rect x="30" y="0" width="28" height="13" fill="#8897F1" />
      
      {/* Second row of bricks - offset */}
      <rect x="15" y="15" width="28" height="13" fill="#8897F1" />
      <rect x="45" y="15" width="28" height="13" fill="#8897F1" />
      <rect x="0" y="15" width="13" height="13" fill="#8897F1" />
    </pattern>
  </defs>
      {polygons.map((polygon,index) => 
        {
          if(polygon.id!=higlightPolygon.id){
            return null;
          }
          // console.log("highlighted",polygon) 
          return(
            <g
            key={polygon.id}
            className={`structure ${polygon.type} `}
            title={polygon.name}
            onClick={() => {
              console.log('hello');
              setInstructionModal(true);
              setModalData(polygon);
            }}
          >
                            <path
                              d={polygon.pathData}
                              // fill={polygon.color}
                              fill={polygon.isBricked ? "url(#brickPattern)" : polygon.color}

                              // fill="#FFF3A8"
                              stroke="#000"
                              strokeWidth="2"
                              fillOpacity="0.5"
                              // fillOpacity={polygon.isBricked ? "1" : "1"}

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
                                    {/* {polygon.name} */}

                              {/* {polygon.instructionData} */}
                            </text>
                          </g>
        )}
        
      )}
    </svg>
  )}

  {false  && (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
      {pPolygons.map((polygon, index) => (
        <g
          key={polygon.image_id}
          className={`structure ${polygon.type}`}
          title={`${polygon.name} - ${polygon.instructionData?.title || ''}`}
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
            {/* {polygon.name} */}
          </text>
        </g>
      ))}
    </svg>
  )}
          {distCoord  && imageHistory.length>0 &&(
            distCoord.map((center, index) => {
              let a = parseImageUrl(imageHistory[index]?.url);
              // console.log("parsed:",a);
              return (
                <>
                  <div
                    className="tooltip"
                    style={{ position: 'absolute', top: centerZ + center[1], left: centerX + center[0]+10 ,
                    display: isHovering===index  ? "block" : "none"
                  }}
                    onClick={() => setSelectedImage(index)}
                    
                    
                  >
                    <div className="imagetooltip-container">
                      <img src={imageHistory[index]?.url} alt="" className="tooltip-image" />
                    </div>

                    {/* Measurement text */}
                    <div className="measurement-text">
                      <span className="measurement-label">Measurement:</span>
                      <span className="measurement-value">
                        {/* {parseFloat(a.measurementL).toFixed(1)}&times;{parseFloat(a.measurementB).toFixed(1)} */}
                        {parseFloat(imageHistory[index]?.metadata?.measurementL||"N/A").toFixed(3)}&times;{parseFloat(imageHistory[index]?.metadata?.measurementB||"N/A").toFixed(3)}
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
          {distCoord  && imageHistory.length>0 && (
            distCoord.map((center, index) => {
              let comp = imageHistory[index]?.metadata?.brand.toLowerCase() || "";
              const companyColor = company_legend.find(c => c.name.toLowerCase() == comp)?.color || '#cccccc'; // default color if not found
              let h = imageHistory[index]?.metadata?.measurementL*50
              let w = imageHistory[index]?.metadata?.measurementB*50
              console.log('helloo',comp);
              console.log("company color",companyColor);
              console.log("height",h);
              return(
                <>
                  <div
                    className="circle"
                    style={{
                      position: 'absolute',
                      top: centerZ + center[1],
                      left: centerX + center[0],
                      width: h,
                      height: h,
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
                  {/* <div 
                    className="absolute"
                    style={{
                      width: h,
                      height: h,
                      top: centerZ + center[1],
                      left: centerX + center[0],
                      zIndex: 10,
                    }}
                  >
                    <div 
                      className={`w-full h-full relative bg-white transition-all duration-300 scale-105 ring-1 ring-blue-500`}
                      style={{
                        borderRadius: '26px',
                        border: '2px solid #1a56db',
                        borderBottomRightRadius: '2px',
                      }}
                      onMouseEnter={() => { setIsHovering(index); console.log('hovering', index); }}
                      onMouseLeave={() => setIsHovering(null)}
                      onClick={() => setSelectedImage(index)}
                    >
                      <div 
                        className="absolute"
                        style={{
                          width: 0.73*h,
                          height: 0.73*h,
                          bottom: '-8px',
                          right: '0px',
                          borderTop: '3px solid #1a56db',
                        }}
                      ></div>
                      
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-xs tracking-tight"><img src={
                          comapany === 'google' ? google :comapany==='samsung' ? samsung : comapany==='apple' ? apple : comapany==='oppo'?oppo:comapany==='vivo'?vivo:comapany==='lg'?lg:''
                        }/></span>
                      </div>
                    </div>
                  </div> */}
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
        // marginBottom: "7px"
        height:"99%"
    }}
    >
        <div
          style={{
            paddingLeft: '16px',
                  paddingTop: '10px',
                  fontWeight: 'bold',
                  // boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
                  borderBottom: '1px solid #EFF4FE',
                  color: 'black',
                  paddingBottom: '10px',
          }}
        >
          Reports
        </div>
        <div id="imageContainer">
          {imageHistory.length > 0 ? (
            // console.log("ai details",imageHistory,aiDetails),
            imageHistory.map((image, index) => {
              let a = parseImageUrl(image.url);
              
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
                      src={image.url}
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
          <span className="col-span-2 text-left font-semibold text-indigo-400">{a.brand}</span>
          <span className="col-span-3 text-left font-semibold text-indigo-400">{a.merchandise}</span>
          <span className="col-span-2 text-left font-semibold text-indigo-400">{a.product}</span>
          <span className="col-span-3 text-left font-semibold text-indigo-400">
          {parseFloat(imageHistory[index].metadata.measurementL).toFixed(3)}&times;{parseFloat(imageHistory[index].metadata.measurementB).toFixed(3)}

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
           {aiDetails[index]?.brand && (
              <><strong>Brand:</strong> {aiDetails[index].brand}<br /></>
            )}
            {aiDetails[index]?.summary && (
              <><strong>Summary:</strong> {aiDetails[index].summary}<br /></>
            )}
            {typeof aiDetails[index]?.count === 'number' && (
              <><strong>Count:</strong> {aiDetails[index].count}<br /></>
            )}
            {typeof aiDetails[index]?.total_phones === 'number' && aiDetails[index].total_phones >= 0 && (
              <><strong>Total Phones:</strong> {aiDetails[index].total_phones}<br /></>
            )}
            {typeof aiDetails[index]?.phones_off === 'number' && aiDetails[index].phones_off >= 0 && (
              <><strong>Phones Off:</strong> {aiDetails[index].phones_off}<br /></>
            )}
            {typeof aiDetails[index]?.phones_on === 'number' && aiDetails[index].phones_on >=0 && (
              <><strong>Phones On:</strong> {aiDetails[index].phones_on}<br /></>
            )}
            {aiDetails[index]?.type && (
              <><strong>Type:</strong> {aiDetails[index].type}<br /></>
            )}
              
               {/* Add Questions and Answers section */}
              {imageHistory[index].ques_ans && imageHistory[index].ques_ans.length > 0 && (
                <>
                  <div className="mt-4">
                    <strong className="text-black block mb-2">Questions & Answers</strong>
                    <div className="space-y-3">
                      {imageHistory[index].ques_ans.map((qa, i) => (
                        <div key={i} className="bg-[#F9F9FF] p-3 rounded-lg">
                          <p className="text-indigo-900 font-medium mb-3">Q: {qa.question}</p>
                          <p className="text-gray-600 pl-2">A: {qa.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
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
    </div>

    {/* NEW LINES: Modal Popup with Close Button */}
    {modalImage && (
      <div className="modal" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close" onClick={closeModal}>
            &times;
          </button>
          <img src={modalImage} alt="Full view" />
        </div>
      </div>
    )}

    {
      instructionModal && (
        <div className="backdrop-blur-sm fixed inset-0 bg-black/30 flex items-center justify-center font-[Urbanist]" style={{ zIndex: 20 }}>
  <div className="bg-white rounded-[34px] shadow-lg w-full max-w-3xl  ">
    {/* Header */}
    <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-[33px] bg-[#EFF4FE]">
      <div className="flex items-center ">
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
          {modalData?.instructionData?.content||"N/A"}
        </p>
      </div>

      {/* Questions */}
      <div>
        <h2 className="text-md font-semibold text-black mb-2">Questions</h2>
        <ul className="space-y-2">
          {modalData?.instructionData?.questions?.map((q, index) => (
            <li key={q.id} className="text-sm text-gray-800">
              <span className="font-medium">{index + 1}. </span>{q.question||"N?A"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
</div>

      )

    }

     <ConnectionErrorModal isOpen={showConnectionModal} />
  </div>
);
};
export default StoreVisitTracking;
