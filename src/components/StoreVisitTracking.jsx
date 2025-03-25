import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './store.css';
import logo from '../assets/logo.png'
import star from '../assets/star.png'
import axios from 'axios';
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
const [imageResponse, setImageResponse] = useState(false);
const [imageResponseUrl, setImageResponseUrl] = useState("");
const [aiDetails, setAIDetails] = useState();
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
  
  const structures = [
    // {
    //   id: 'shelf-1',
    //   name: 'A',
    //   type: 'shelf',
    //   coordinates: [[-500,-250], [-500, 250], [500, 250], [500, -250]]  
    // },
    // {
    //   id:'origin',
    //   name: 'o',
    //   type: 'entrance',
    //   coordinates: [[0,0], [0,0], [0, 0], [0, 0]]
  
    // },
    {
      id: 'bottom-entry',
      name: 'B',
      type: 'counter',
      coordinates:  [[-500, -250], [-500, -150], [-450, -150], [-450, -250]] 
    },
    {
      id: 'top-entry',
      name: 'C',
      type: 'counter',
      coordinates: [[-500, 250], [-500, 150], [-450, 150], [-450, 250]] 
    },
    {
      id: 'wearables',
      name: 'D',
      type: 'entrance',
      coordinates: [[-450, -250], [-450, -220], [50, -220], [50, -250]] 
    },
    {
      id: 'home appliance',
      name: 'E',
      type: 'entrance',
      coordinates:   [[50, -250], [50, -190], [500, -190], [500, -250]]  
    },
    // {
    //   id: 'PC-notebook',
    //   name: 'F',
    //   type: 'display',
    //   coordinates: [[-400, -220], [-400, -110], [50, -110], [50, -220]]  
    // },
    {
      id: 'apple-accesory',
      name: 'G',
      type: 'entrance',
      coordinates: [[-450, 250], [-450, 220], [50, 220], [50, 250]]  
    },
    // {
    //   id: 'samsung-wallbay',
    //   name: 'H',
    //   type: 'entrance',
    //   coordinates: [[50, 250], [50, 220], [500, 220], [500, 250]]  
    // },
    // {
    //   id: 'Cashier',
    //   name: 'I',
    //   type: 'shelf',
    //   coordinates: [[460, -160], [460, -60], [500, -60], [500, -160]]  
    // },
    // {
    //   id: 'samsung-tv',
    //   name: 'J',
    //   type: 'shelf',
    //   coordinates: [[460, -10], [460, 220], [500, 220], [500, -10]]  
    // },
    // {
    //   id:'tv-monitor',
    //   name: 'K',
    //   type: 'display',
    //   coordinates: [[-400, -110], [-400, 30], [-210, 30], [-210, -110]]
    // },
    {
      id:'wall',
      name: 'L',
      type: 'counter',
      coordinates: [[-200, -110], [-200, 30], [-170, 30], [-170, -110]]
    },
    {
      id:'pc-notebook',
      name: 'M',
      type: 'display',
      coordinates: [[-160, -100], [-160, 0], [50, 0], [50, -100]]
    },
    // {
    //   id:'oppo',
    //   name: 'N',
    //   type: 'display',
    //   coordinates: [[-140, 10], [-140, 70], [30, 70], [30, 10]]
    // },
    // {
    //   id:'apple-tomb-table',
    //   name: 'O',
    //   type: 'shelf',
    //   coordinates: [[-360, 100], [-360, 160], [-170, 160], [-170, 100]]
    // },
    // {
    //   id:'samsung-smart1',
    //   name: 'P',
    //   type: 'entrance',
    //   coordinates:[[150,80],[150,180],[200,180],[200,80]]
    // },
    {
      id:'samsung-smart2',
      name: 'Q',
      type: 'entrance',
      coordinates:[[250,80],[250,180],[300,180],[300,80]]
    },
    {
      id:'best-denki',
      name: 'R',
      type: 'shelf',
      coordinates:[[120,-110],[120,40],[220,40],[220,-110]]
    },
    {
      id:'samsung-oled',
      name: 'S',
      type: 'shelf',
      coordinates:[[260,-50],[260,20],[390,20],[390,-50]]
    }
  ];
  function getAI(imageurl) {
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


let data = JSON.stringify({
  "image_link": imageurl
});

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://banner-backend-85801868683.us-central1.run.app/api/get_banner_data',
  headers: { 
    'Content-Type': 'application/json'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log((response.data));
  setAIDetails((prevdetails) => [...prevdetails,response.data]);
})
.catch((error) => {
  console.log(error);
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
    console.log('coord',coord);
    // Transform coordinates from -100,100 range to screen position
    // (0,0) at center of screen
    // plotO();
    console.log(coord.x,coord.z);
    
    console.log(centerX,centerZ);
    let screenX = centerX + (coord.x * centerX) / 100;
    let screenZ = centerZ + (coord.z * centerZ) / 100;
    
    console.log(screenX,screenZ);

    // Create point
    const pointElement = document.createElement("div");
    pointElement.className = "point";
    pointElement.dataset.timestamp = coord.timestamp;

    // Set initial scale to 0 for animation
    pointElement.style.transform = "translate(-50%, -50%) scale(0)";
    pointElement.style.backgroundColor='red'
    let diagonal=2;

    // If photo was captured at this point, add the photo-captured class
    if (coord.photoCapture === 1) {
      const vizElement = document.getElementById("visualization");
      let trial=find_nearest(coord.x,coord.z,coord.distance,vizElement,coord.l,coord.b);
      console.log(trial);
      

      // pointElement.style.zIndex = 5;

      // Add click event to show the corresponding image
      pointElement.addEventListener("click", () => {
        const pointData = imagePointMap.get(coord.timestamp);
        if (pointData) {
          // Find the corresponding image card
          const imageCard = document.querySelector(
            `.card[data-timestamp="${pointData.image.timestamp}"]`
          );
          if (imageCard) {
            // Remove active class from all cards
            document
              .querySelectorAll(".card")
              .forEach((card) => card.classList.remove("active"));

            // Add active class to this card
            imageCard.classList.add("active");

            // Scroll to the card
            imageCard.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      });
    }

    pointElement.style.left = `${screenX}px`;
    pointElement.style.top = `${screenZ}px`;
    // vizElement.appendChild(pointElement);

    // Trigger animation after a small delay
    setTimeout(() => {
      pointElement.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
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
  function find_nearest(x, z,diagonal,vizElemen,l,b) {
    console.log("imagesssssssss:",imageHistory);
    // console.log(parseImageUrl(imageHistory[0]?.url));
    // const interval = setInterval(() => {
    //   if (!imageResponse) {
    //     console.log("imageResponseUrl:",imageResponseUrl);
    //     console.log("failureeeee:",parseImageUrl(imageResponseUrl));
    //   } else {
    //     console.log("successsssss:",parseImageUrl(imageResponseUrl));
    //     clearInterval(interval);
    //   }
    // }, 1000);
    // x=(x/100)*500;
    // z=(z/100)*250;
    console.log(x,z);
    if (!structures || structures.length === 0) {
      console.error("No structures found!");
      return;
  }
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
  structures.forEach(structure => {
    let minEdgeDistance = Infinity;
    let closestPointOnEdge = null; 
  
    for (let i = 0; i < structure.coordinates.length; i++) {
        // Get two consecutive points forming an edge
        let [x1, z1] = structure.coordinates[i];
        let [x2, z2] = structure.coordinates[(i + 1) % 4];

        let result = getPerpendicularDistanceAndPoint(x, z, x1, z1, x2, z2);
            let distance = result.distance;
            let point = result.point;
        // Calculate perpendicular distance from (x, z) to this edge
        // let distance = getPerpendicularDistance(x, z, x1, z1, x2, z2);
  
        if (distance < minEdgeDistance) {
            minEdgeDistance = distance;
            closestPointOnEdge = point;
        }
    }
    // Update nearest quadrilateral based on the smallest perpendicular distance
    if (minEdgeDistance < minDistance) {
        minDistance = minEdgeDistance;
        nearest = structure;
        perpendicularPoint = closestPointOnEdge;
        setNearestStructure(structure);
        // nearestStructure = structure;
    }
  });
  
    if (minDistance===Infinity) {
      console.error("No nearby quadrilateral found.");
      return null;
    }
  
    console.log("Nearest Structure:", nearest.name);
    console.log("Perpendicular Point:", perpendicularPoint);
    if(diagonal==0){
      // diagonal=2;
    }
    // Calculate square side from diagonal using Pythagoras' theorem
    const squareSide = diagonal / Math.sqrt(2);
  
    // Find a position inside the quadrilateral for the square
    // const center = getPolygonCenter(nearest.coordinates);
    const center = [...getPolygonCenter(nearest.coordinates)];
    console.log("Center:", center);
    //append in the front to cenercoord
    // setCenterCoord(prevcenterCoord  => [center,...prevcenterCoord]);
    setCenterCoord((prev) => {
      // console.log("Previous State:", prev);
      const updated = [center, ...prev];
      // console.log("Updated State:", updated);
      return updated;
    });

    setPerpendicularCoord((prev) => {
      // console.log("Previous State:", prev);
      const updated = [perpendicularPoint, ...prev];
      // console.log("Updated State:", updated);
      return updated;
    });
    // setCenterCoord(center);
    console.log("CenterCoord:", centerCoord);
    const squareCoordinates = [
      [center[0] - squareSide / 2, center[1] - squareSide / 2], // Top-left
      [center[0] + squareSide / 2, center[1] - squareSide / 2], // Top-right
      [center[0] + squareSide / 2, center[1] + squareSide / 2], // Bottom-right
      [center[0] - squareSide / 2, center[1] + squareSide / 2]  // Bottom-left
    ];
    if(l==0 && b==0)
    {
      l=10;
      b=5;
    }
    l=l*5;
    b=b*5;
    const pcoordinates=[
      [perpendicularPoint[0] - l, perpendicularPoint[1] - b/2], // Top-left
      [perpendicularPoint[0] - l, perpendicularPoint[1] + b/2],
      [perpendicularPoint[0] , perpendicularPoint[1] + b/2], // Bottom-right
      [perpendicularPoint[0] , perpendicularPoint[1] - b/2], // Top-right
       // Bottom-left

    ]

    setPstructures(prevStructures => [
      ...prevStructures,
      { coordinates: pcoordinates }
    ]);
    console.log("pcoordinates:",pcoordinates);
  
    // console.log("Square Coordinates:", squareCoordinates);
    // setSquareCoordinates(squareCoordinates);

    // createSquareVisualization(squareCoordinates, vizElement);
    return { nearestStructure, squareCoordinates };
  
  }
  function getPerpendicularDistance(x, z, x1, z1, x2, z2) {
    let A = z2 - z1;
    let B = -(x2 - x1);
    let C = x2 * z1 - z2 * x1;
  
    let numerator = Math.abs(A * x + B * z + C);
    let denominator = Math.sqrt(A ** 2 + B ** 2);
    let perpendicularDistance = numerator / denominator;
  
    // Find the projection point (xp, zp) on the line
    let t = ((x - x1) * (x2 - x1) + (z - z1) * (z2 - z1)) / ((x2 - x1) ** 2 + (z2 - z1) ** 2);
  
    if (t >= 0 && t <= 1) {
        // The perpendicular falls inside the segment, return the perpendicular distance
        return perpendicularDistance;
    } else {
        // The perpendicular falls outside, return the minimum distance to an endpoint
        let distanceToStart = Math.sqrt((x - x1) ** 2 + (z - z1) ** 2);
        let distanceToEnd = Math.sqrt((x - x2) ** 2 + (z - z2) ** 2);
        return Math.min(distanceToStart, distanceToEnd);
    }
  }
  function createSquareVisualization(squareCoordinates, vizElement) {
    // Clear existing square visualization
    setCenterX(vizDimensions.width / 2);
      setCenterZ(vizDimensions.height / 2);
     const centerx = vizDimensions.width / 2;
     const centerz = vizDimensions.height / 2;
  
    // Create an SVG element
   const newSquare=()=>{
    squareCoordinates.forEach((coord, index) => {
      const screenX = centerx + coord[0];
      const screenZ = centerz + coord[1];

      pathData += index === 0 ? `M ${screenX} ${screenZ} ` : `L ${screenX} ${screenZ} `;
    });
    pathData += "Z"; // Close the polygon

      const centerCoord = getPolygonCenter(squareCoordinates);
      const textX = centerx + centerCoord[0];
      const textY = centerz + centerCoord[1];

      return {
        id: Math.random().toString(36).substr(2, 9),
        name: 'test',
        type: 'counter',
        pathData,
        textX,
        textY,
        color: '#E6E7F8',
      };
   }
   setSquare(newSquare);
  }
  function renderAllImages(history) {
    console.log("render images")
    console.log(imageHistory);
  }
  // function parseImageUrl(url) {
  //   try {
  //     // First, decode the URL to handle any encoded characters
  //     const decodedUrl = decodeURIComponent(url);
      
  //     // Extract the filename portion from the URL
  //     let filename = null;
  //     if (decodedUrl.includes('/o/ARTracker%2F')) {
  //       filename = decodedUrl.split('/o/ARTracker%2F')[1];
  //     } else if (decodedUrl.includes('/o/ARTracker/')) {
  //       filename = decodedUrl.split('/o/ARTracker/')[1];
  //     }
      
  //     if (filename) {
  //       // Remove the query parameters
  //       filename = filename.split('?')[0];
        
  //       // Split the filename by underscores
  //       const parts = filename.split('_');
        
  //       // Handle case when there are no underscores in the filename
  //       if (parts.length === 1) {
  //         // Try to extract information from single part
  //         const nameParts = parts[0].replace(/\.png$/, '').split(/(?=[A-Z])/);
  //         if (nameParts.length > 2) {
  //           return {
  //             brand: nameParts[0] || "Unknown",
  //             visual: nameParts[1] || "Unknown",
  //             product: nameParts[2] || "Unknown",
  //             measurement: "N/A"
  //           };
  //         }
  //       }
        
  //       // Extract components based on position
  //       const brand = parts[0] || "Unknown";
        
  //       // Handle "Dummy device" which contains a space
  //       let visual = parts[1] || "Unknown";
  //       let productIndex = 2;
        
  //       // If visual has a space that was encoded in the URL, it might span multiple parts
  //       if (parts.length > 2 && parts[2] && !parts[2].toLowerCase().includes("phone") && 
  //           !parts[2].toLowerCase().includes("tablet") && !parts[2].toLowerCase().includes("tv")) {
  //         visual = visual + " " + parts[2];
  //         productIndex = 3;
  //       }
        
  //       // Get product and remove .png extension if it exists
  //       let product = parts[productIndex] || "Unknown";
  //       product = product.replace(/\.png$/i, '');
        
  //       // Check if we have a measurement (next part after product before .png)
  //       let measurement = "N/A";
  //       if (parts.length > productIndex + 1) {
  //         // Extract measurement without the .png extension
  //         measurement = parts[productIndex + 1].replace(/\.png$/i, '');
  //       }
        
  //       return {
  //         brand,
  //         visual,
  //         product,
  //         measurement
  //       };
  //     }
  
  //     // Fallback if parsing fails
  //     return {
  //       brand: "Unknown",
  //       visual: "Unknown",
  //       product: "Unknown",
  //       measurement: "N/A"
  //     };
  //   } catch (error) {
  //     console.error("Error parsing image URL:", error);
  //     return {
  //       brand: "Unknown",
  //       visual: "Unknown",
  //       product: "Unknown",
  //       measurement: "N/A"
  //     };
  //   }
  // }
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
  useEffect(() => {

    if (!structures.length || !vizDimensions) return;
      console.log(vizDimensions.width,vizDimensions.height);
      setCenterX(vizDimensions.width / 2);
      setCenterZ(vizDimensions.height / 2);
     const centerx = vizDimensions.width / 2;
     const centerz = vizDimensions.height / 2;


    const newPolygons = structures.map((structure) => {
      let pathData = "";
      structure.coordinates.forEach((coord, index) => {
        const screenX = centerx + coord[0];
        const screenZ = centerz + coord[1];

        pathData += index === 0 ? `M ${screenX} ${screenZ} ` : `L ${screenX} ${screenZ} `;
      });

      pathData += "Z"; // Close the polygon

      const centerCoord = getPolygonCenter(structure.coordinates);
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
  }, [vizDimensions]);

// useEffect(() => {
//   console.log("setting squareCoordinates");
//    squares = squareCoordinates??squareCoordinates.map((coords, index) => {
//     // Generate path data from coordinates
//     const pathData = coords.map((point, i) => {
//       return `${i === 0 ? 'M' : 'L'} ${point[0]},${point[1]}`;
//     }).join(' ') + ' Z'; // Close the path
    
//     // Calculate center point for text
//     const centerX = coords.reduce((sum, point) => sum + point[0], 0) / coords.length;
//     const centerY = coords.reduce((sum, point) => sum + point[1], 0) / coords.length;
    
//     return {
//       id: `square-${index}`,
//       pathData: pathData,
//       color: "#717AEA",
//       type: "shelf", // or any other classification you need
//       name: `Square ${index + 1}`,
//       textX: centerX,
//       textY: centerY
//     };
//   });

// }, [squareCoordinates])

  // Refs
useEffect(()=>{
  console.log(vizDimensions.width,vizDimensions.height);
      setCenterX(vizDimensions.width / 2);
      setCenterZ(vizDimensions.height / 2);
      const centerx = vizDimensions.width / 2;
      const centerz = vizDimensions.height / 2;

      const newPolygons = pstructures.map((structure,structureIndex) => {
        console.log("ploygon structure:",structure);
        let pathData = "";
        structure.coordinates.forEach((coord, index) => {
          const screenX = centerx + coord[0];
          const screenZ = centerz + coord[1];
  
          pathData += index === 0 ? `M ${screenX} ${screenZ} ` : `L ${screenX} ${screenZ} `;
        });
  
        pathData += "Z"; // Close the polygon
  
        const centerCoord = getPolygonCenter(structure.coordinates);
        const textX = centerx + centerCoord[0];
        const textY = centerz + centerCoord[1];
  
        return {
          id: structureIndex.toString(), 
          name:"",
          type: 'counter',
          pathData,
          textX,
          textY,
          color: 'red',
        };
      });
    //  const newQuad=


setPPolygons(newPolygons);

},[pstructures,vizDimensions])

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
    socketRef.current = io(backendUrl);
    socketRef.current.on("connect", () => {
      console.log("Connected to server with ID:", socketRef.current.id);
    });
    socketRef.current.on("connect_error", (err) => {
      console.error("Connection error:", err.message);
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
      setImageHistory(history);
      updateImagePointMap();
      renderAllImages(history);
    });
  
    // Receive new coordinate
    socketRef.current.on("new-coordinate", (data) => {
      console.log("New coordinate received:", data);
      setCoordinates(prevCoordinates => [...prevCoordinates, data]);
      // setTotalDistance(data.distance);
      updateDistanceDisplay(data);
      // console.log("render coordinate")
      renderCoordinate(data);
    });
  
    // Receive new image
    socketRef.current.on("new-image", (data) => {
      console.log("New image received:", data);
      setImageResponse(true);
      setImageResponseUrl(data.url);
      let aisummary=getAI(data.url);
      console.log("AI Summaryrrrrrrr:", aisummary);
      // setAIDetails((prevdetails) => [aisummary, ...prevdetails]);
      // Add to beginning of array so newest is first
      setImageHistory(prevHistory => [data, ...prevHistory]);
      updateImagePointMap();
      renderAllImages();
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
  

  // const updateDistanceDisplay = (data) => {
  //   setDistance(data.distance || 0);
  // };
  
  // Helper function to update the image point map
  const updateImagePointMap = () => {
    imagePointMap.clear();

    // Find matching coordinates for each image
    imageHistory.forEach((image) => {
      // Find the closest coordinate point by timestamp
      const closestCoord = findClosestCoordinateByTimestamp(image.timestamp);
      if (closestCoord) {
        imagePointMap.set(closestCoord.timestamp, {
          image: image,
          coordinate: closestCoord,
        });
      }
    });
  };
  
  // Add these functions to handle button actions
  const handleClearButton = () => {
    if (socketRef.current) {
      socketRef.current.emit("clear-coordinates");
      socketRef.current.emit("clear-images");
    }
    fetch(`${backendUrl}/api/all`, {
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

    fetch(`${backendUrl}/api/coordinates`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          Number.parseFloat(totalDistance.toFixed(2)),
          x,
          z,
          photoCapture,
          l,
          b,

        ],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Response:", data);

        // If photo was captured, send a test image URL
        if (photoCapture === 1) {
          // Use a random selection of image URLs for testing
          // const testImages = [
          //   "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FGoogle_Poster_Phone_0.9244657.png?alt=media&token=7affeac9-1f60-42b1-9e1f-d2c65a348da8",
          //   "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FApple_Poster_Phone.png?alt=media&token=7f75f533-e249-44e3-8056-adca5caef03d",
          //   "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FSamsung_Display_Tablet.png?alt=media&token=12345678",
          //   "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FLGE_Banner_TV.png?alt=media&token=87654321",
          // ];
          const testImages=[
            // "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2FSamsung_DummyDevice_Watch_0_0.png?alt=media&token=57327a02-caf0-4bd5-a13c-7dcb3604f497"
          
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

          // First post the image
          fetch(`${backendUrl}/api/image`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",S
            },
            body: JSON.stringify({
              imageUrl: imageUrl,
              metadata: {
                timestamp: timestamp,
              },
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Image Response:", data);
              
              // Then post the banner data
              fetch(`${backendUrl}/api/banner_data`, {
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
            .catch((error) => console.error("Error sending image:", error));
        }
      })
      .catch((error) => console.error("Error:", error));
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

return (
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
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
        <h1 style={{ margin: 0, color: 'black', fontWeight: 500 }}>Store Visit Tracking</h1>
      </div>
      <div className="control-panel" style={{ textAlign: 'right' }}>
        <div>
          <button
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
          </button>

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
            <span>Structure</span>
            <input
              type="checkbox"
              id="structureToggle"
              checked={isStructureVisible}
              onChange={toggleStructure}
            />
            <span className="slider"></span>
          </label>
        </div>
      </div>
    </div>

{/* Distance Display */}
<div className="info-display">
  <span className="distance-box">
    <span
      id="distance"
      ref={distanceDisplayRef}
      style={{ color: 'black', fontWeight: 500 }}
    >
      Distance: {totalDistance.toFixed(2)}
    </span>
    <span className="arrow">◀</span>
  </span>
</div>


    {/* Main Layout */}
    <div className="layout-container">
      <div className="left-container">
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
      {coordinates.map((point, index) => (
        <div
          key={index}
          className={`point ${point.photoCapture ? 'photo-captured' : ''}`}
          style={{
            left: `${centerX + point.x}px`,
            top: `${centerZ + point.z}px`
          }}
        />
      ))}
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

  {isPathVisible && (
    <svg width="100%" height="100%" style={{ position: 'absolute', top: 0, left: 0 }}>
      {pPolygons.map((polygon, index) => (
        <g
          key={polygon.id}
          className={`structure ${polygon.type}`}
          title={polygon.name}
          onMouseEnter={() => { setIsHovering(index); console.log('hovering', index); }}
          onMouseLeave={() => setIsHovering(null)}
          onClick={() => setSelectedImage(index)}
        >
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
            perpendicularCoord.map((center, index) => {
              let a = parseImageUrl(imageHistory[index]?.url);
              // console.log("parsed:",a);
              return (
                <>
                  <div
                    className="tooltip"
                    style={{ position: 'absolute', top: centerZ + center[1]-10, left: centerX + center[0] ,
                    display: isHovering===perpendicularCoord.length-index-1 ? "block" : "none"
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
                        {parseFloat(a.measurementL).toFixed(1)}&times;{parseFloat(a.measurementB).toFixed(1)}
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
      <div className="right-container">
        <div
          style={{
            paddingLeft: '10px',
            paddingTop: '10px',
            fontWeight: 'bold',
            boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1)',
            color: 'black'
          }}
        >
          Reports
        </div>
        <div id="imageContainer">
          {imageHistory.length > 0 && aiDetails.length>0 ? (
            console.log("ai details",aiDetails),
            imageHistory.map((image, index) => {
              let a = parseImageUrl(image.url);
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
                      src={image.url}
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
                        <span className="card-info-value">{image.metadata.bannerData?.brand || 'N/A'}</span>
                        <span className="card-info-value">{a.merchandise || 'N/A'}</span>
                        <span className="card-info-value">{a.product || 'N/A'}</span>
                        <span className="card-info-value">
                          {parseFloat(a.measurementL).toFixed(3)}&times;{parseFloat(a.measurementB).toFixed(3)}
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
                          <strong>Brand:</strong> {aiDetails[index]?.brand || 'N/A'} <br />
                          <strong>Position:</strong> {aiDetails[index]?.position || 'N/A'} <br />
                          <strong>Summary:</strong> {aiDetails[index]?.summary || 'No AI analysis available.'}
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
            <div className="no-images-message">
              No reports available. Start tracking to capture store data.
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
);
};
export default StoreVisitTracking;