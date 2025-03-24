import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import './store.css';
import logo from '../assets/logo.png';
import star from '../assets/star.png';

const StoreVisitTracking = () => {
  // State variables
  const [modalImage, setModalImage] = useState(null);
  const [distance, setDistance] = useState(0);
  const [points, setPoints] = useState([]);
  const [isStructureVisible, setIsStructureVisible] = useState(false);
  const [isPathVisible, setIsPathVisible] = useState(true);
  const [images, setImages] = useState([]);
  const [isActive, setIsActive] = useState(false);
  const [coordinates, setCoordinates] = useState([]);
  const [imageHistory, setImageHistory] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [imagePointMap, setImagePointMap] = useState(new Map());
  const [vizDimensions, setVizDimensions] = useState({ width: 0, height: 0 });
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
  const socketRef = useRef(null);
  const vizRef = useRef(null);
  const imageRefs = useRef([]);
  // We'll use a ref to store the latest image so that timing issues are mitigated.
  const latestImageRef = useRef(null);

  const toggleCard = (index) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const structures = [
    {
      id: 'bottom-entry',
      name: 'B',
      type: 'counter',
      coordinates: [[-500, -250], [-500, -150], [-450, -150], [-450, -250]]
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
      coordinates: [[50, -250], [50, -190], [500, -190], [500, -250]]
    },
    {
      id: 'apple-accesory',
      name: 'G',
      type: 'entrance',
      coordinates: [[-450, 250], [-450, 220], [50, 220], [50, 250]]
    },
    {
      id: 'wall',
      name: 'L',
      type: 'counter',
      coordinates: [[-200, -110], [-200, 30], [-170, 30], [-170, -110]]
    },
    {
      id: 'pc-notebook',
      name: 'M',
      type: 'display',
      coordinates: [[-160, -100], [-160, 0], [50, 0], [50, -100]]
    },
    {
      id: 'samsung-smart2',
      name: 'Q',
      type: 'entrance',
      coordinates: [[250, 80], [250, 180], [300, 180], [300, 80]]
    },
    {
      id: 'best-denki',
      name: 'R',
      type: 'shelf',
      coordinates: [[120, -110], [120, 40], [220, 40], [220, -110]]
    },
    {
      id: 'samsung-oled',
      name: 'S',
      type: 'shelf',
      coordinates: [[260, -50], [260, 20], [390, 20], [390, -50]]
    }
  ];

  function getAI(imageurl) {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({ "image_link": imageurl });
    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    fetch("https://banner-backend-85801868683.us-central1.run.app/api/get_banner_data", requestOptions)
      .then((response) => response.text())
      .then((result) => result)
      .catch((error) => error);
  }

  function getPolygonCenter(coords) {
    let sumX = 0, sumZ = 0;
    coords.forEach(coord => {
      sumX += coord[0];
      sumZ += coord[1];
    });
    return [sumX / coords.length, sumZ / coords.length];
  }

  function renderAllCoordinates() {
    coordinates.forEach((coord, index) => {
      setTimeout(() => {
        renderPoint(coord);
      }, index * 20);
    });
  }

  function updateDistanceDisplay(coord) {
    const distanceDisplay = distanceDisplayRef.current;
    if (!distanceDisplay) return;
    const currentDistance = Number.parseFloat(distanceDisplay.textContent.replace("Distance: ", ""));
    const targetDistance = coord.distance;
    const animateDistance = (timestamp, startValue, endValue, startTime, duration = 500) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentValue = startValue + (endValue - startValue) * progress;
      distanceDisplay.textContent = `Distance: ${currentValue.toFixed(2)}`;
      setTotalDistance(currentValue);
      if (progress < 1) {
        requestAnimationFrame((time) => animateDistance(time, startValue, endValue, startTime, duration));
      }
    };
    requestAnimationFrame((timestamp) => animateDistance(timestamp, currentDistance, targetDistance));
  }

  function renderCoordinate(coord) {
    renderPoint(coord);
  }

  function renderPoint(coord) {
    let screenX = centerX + (coord.x * centerX) / 100;
    let screenZ = centerZ + (coord.z * centerZ) / 100;
    const pointElement = document.createElement("div");
    pointElement.className = "point";
    pointElement.dataset.timestamp = coord.timestamp;
    pointElement.style.transform = "translate(-50%, -50%) scale(0)";
    pointElement.style.backgroundColor = 'red';
    let diagonal = 2;
    if (coord.photoCapture === 1) {
      const vizElement = document.getElementById("visualization");
      find_nearest(coord.x, coord.z, coord.distance, vizElement, coord.l, coord.b);
      pointElement.addEventListener("click", () => {
        const pointData = imagePointMap.get(coord.timestamp);
        if (pointData) {
          const imageCard = document.querySelector(
            `.card[data-timestamp="${pointData.image.timestamp}"]`
          );
          if (imageCard) {
            document.querySelectorAll(".card").forEach((card) => card.classList.remove("active"));
            imageCard.classList.add("active");
            imageCard.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }
      });
    }
    pointElement.style.left = `${screenX}px`;
    pointElement.style.top = `${screenZ}px`;
    setTimeout(() => {
      pointElement.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
  }

  function getPerpendicularDistanceAndPoint(x, z, x1, z1, x2, z2) {
    const edgeVectorX = x2 - x1;
    const edgeVectorZ = z2 - z1;
    const pointVectorX = x - x1;
    const pointVectorZ = z - z1;
    const edgeLengthSquared = edgeVectorX ** 2 + edgeVectorZ ** 2;
    if (edgeLengthSquared === 0) {
      const distance = Math.sqrt(pointVectorX ** 2 + pointVectorZ ** 2);
      return { distance, point: [x1, z1] };
    }
    const t = Math.max(0, Math.min(1, (pointVectorX * edgeVectorX + pointVectorZ * edgeVectorZ) / edgeLengthSquared));
    const projX = x1 + t * edgeVectorX;
    const projZ = z1 + t * edgeVectorZ;
    const distance = Math.sqrt((x - projX) ** 2 + (z - projZ) ** 2);
    return { distance, point: [projX, projZ] };
  }

  // In find_nearest, if l or b are zero, use the latest image measurements and apply a scaling factor.
  function find_nearest(x, z, diagonal, vizElemen, l, b) {
    if (!structures || structures.length === 0) {
      return null;
    }
    let perpendicularPoint = null;
    let nearest = null;
    let minDistance = Infinity;
    structures.forEach(structure => {
      let minEdgeDistance = Infinity;
      let closestPointOnEdge = null;
      for (let i = 0; i < structure.coordinates.length; i++) {
        let [x1, z1] = structure.coordinates[i];
        let [x2, z2] = structure.coordinates[(i + 1) % 4];
        let result = getPerpendicularDistanceAndPoint(x, z, x1, z1, x2, z2);
        if (result.distance < minEdgeDistance) {
          minEdgeDistance = result.distance;
          closestPointOnEdge = result.point;
        }
      }
      if (minEdgeDistance < minDistance) {
        minDistance = minEdgeDistance;
        nearest = structure;
        perpendicularPoint = closestPointOnEdge;
        setNearestStructure(structure);
      }
    });
    if (minDistance === Infinity) {
      return null;
    }
    const squareSide = diagonal / Math.sqrt(2);
    const center = [...getPolygonCenter(nearest.coordinates)];
    setCenterCoord(prev => [center, ...prev]);
    setPerpendicularCoord(prev => [perpendicularPoint, ...prev]);

    // If l or b are zero, use the latest image measurements.
    if (l === 0 || b === 0) {
      if (latestImageRef.current) {
        const parsed = parseImageUrl(latestImageRef.current.url);
        l = parseFloat(parsed.measurementL) || 10;
        b = parseFloat(parsed.measurementB) || 5;
        console.log("Extracted measurements from Firebase:", l, b);
      } 
      //   l = 10;
      //   b = 5;
      // }
    }
    // Apply a scaling factor to make the dimensions more visible.
    const scaleFactor = 50; // Adjust this factor as needed
    l = l * scaleFactor;
    b = b * scaleFactor;

    // Create box coordinates centered at the perpendicular point.
    const pcoordinates = [
      [perpendicularPoint[0] - l / 2, perpendicularPoint[1] - b / 2],
      [perpendicularPoint[0] + l / 2, perpendicularPoint[1] - b / 2],
      [perpendicularPoint[0] + l / 2, perpendicularPoint[1] + b / 2],
      [perpendicularPoint[0] - l / 2, perpendicularPoint[1] + b / 2]
    ];
    setPstructures(prev => [
      ...prev,
      { coordinates: pcoordinates }
    ]);
    return { 
      nearestStructure: nearest, 
      squareCoordinates: [
        [center[0] - squareSide / 2, center[1] - squareSide / 2],
        [center[0] + squareSide / 2, center[1] - squareSide / 2],
        [center[0] + squareSide / 2, center[1] + squareSide / 2],
        [center[0] - squareSide / 2, center[1] + squareSide / 2]
      ]
    };
  }

  function getPerpendicularDistance(x, z, x1, z1, x2, z2) {
    let A = z2 - z1;
    let B = -(x2 - x1);
    let C = x2 * z1 - z2 * x1;
    let numerator = Math.abs(A * x + B * z + C);
    let denominator = Math.sqrt(A ** 2 + B ** 2);
    let perpendicularDistance = numerator / denominator;
    let t = ((x - x1) * (x2 - x1) + (z - z1) * (z2 - z1)) / ((x2 - x1) ** 2 + (z2 - z1) ** 2);
    if (t >= 0 && t <= 1) {
      return perpendicularDistance;
    } else {
      let distanceToStart = Math.sqrt((x - x1) ** 2 + (z - z1) ** 2);
      let distanceToEnd = Math.sqrt((x - x2) ** 2 + (z - z2) ** 2);
      return Math.min(distanceToStart, distanceToEnd);
    }
  }

  function createSquareVisualization(squareCoordinates, vizElemen) {
    setCenterX(vizDimensions.width / 2);
    setCenterZ(vizDimensions.height / 2);
    const centerx = vizDimensions.width / 2;
    const centerz = vizDimensions.height / 2;
    const newSquare = () => {
      let pathData = "";
      squareCoordinates.forEach((coord, index) => {
        const screenX = centerx + coord[0];
        const screenZ = centerz + coord[1];
        pathData += index === 0 ? `M ${screenX} ${screenZ} ` : `L ${screenX} ${screenZ} `;
      });
      pathData += "Z";
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
    };
    setSquare(newSquare);
  }

  function renderAllImages(history) {
    // No console logs here.
  }

  function parseImageUrl(url) {
    try {
      const decodedUrl = decodeURIComponent(url);
      let filename = null;
      if (decodedUrl.includes('/o/ARTracker%2F')) {
        filename = decodedUrl.split('/o/ARTracker%2F')[1];
      } else if (decodedUrl.includes('/o/ARTracker/')) {
        filename = decodedUrl.split('/o/ARTracker/')[1];
      }
      if (!filename) {
        return defaultResponse();
      }
      filename = filename.split('?')[0];
      const nameWithoutExtension = filename.split('.png')[0];
      const parts = nameWithoutExtension.split('_');
      if (parts.length < 3) {
        return defaultResponse();
      }
      const brand = parts[0] || "Unknown";
      const merchandise = parts[1] || "Unknown";
      const product = parts[2] || "Unknown";
      let measurementL = "N/A";
      let measurementB = "N/A";
      if (parts.length > 3) {
        measurementL = parts[3] || "N/A";
      }
      if (parts.length > 4) {
        measurementB = parts[4] || "N/A";
      }
      return { brand, merchandise, product, measurementL, measurementB };
    } catch (error) {
      console.error("Error parsing image URL:", error);
      return defaultResponse();
    }
  }

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
      pathData += "Z";
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

  useEffect(() => {
    setCenterX(vizDimensions.width / 2);
    setCenterZ(vizDimensions.height / 2);
    const centerx = vizDimensions.width / 2;
    const centerz = vizDimensions.height / 2;
    const newPolygons = pstructures.map((structure, structureIndex) => {
      let pathData = "";
      structure.coordinates.forEach((coord, index) => {
        const screenX = centerx + coord[0];
        const screenZ = centerz + coord[1];
        pathData += index === 0 ? `M ${screenX} ${screenZ} ` : `L ${screenX} ${screenZ} `;
      });
      pathData += "Z";
      const centerCoord = getPolygonCenter(structure.coordinates);
      const textX = centerx + centerCoord[0];
      const textY = centerz + centerCoord[1];
      return {
        id: structureIndex.toString(),
        name: "",
        type: 'counter',
        pathData,
        textX,
        textY,
        color: 'red',
      };
    });
    setPPolygons(newPolygons);
  }, [pstructures, vizDimensions]);

  useEffect(() => {
    const updateDimensions = () => {
      if (vizRef.current) {
        setVizDimensions({
          width: vizRef.current.offsetWidth,
          height: vizRef.current.offsetHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  useEffect(() => {
    socketRef.current = io("https://storevisualservice-test.onrender.com/");
    socketRef.current.on("connect", () => {});
    socketRef.current.on("connect_error", (err) => {});
    socketRef.current.on("coordinate-history", (history) => {
      setCoordinates(history);
      if (history.length > 0) {
        const lastCoord = history[history.length - 1];
        setTotalDistance(lastCoord.distance);
        updateDistanceDisplay(lastCoord);
      }
      renderAllCoordinates();
    });
    socketRef.current.on("image-history", (history) => {
      setImageHistory(history);
      if (history.length > 0) {
        latestImageRef.current = history[0];
      }
      updateImagePointMap();
      renderAllImages(history);
    });
    socketRef.current.on("new-coordinate", (data) => {
      setCoordinates(prev => [...prev, data]);
      updateDistanceDisplay(data);
      renderCoordinate(data);
    });
    socketRef.current.on("new-image", (data) => {
      setImageResponse(true);
      setImageResponseUrl(data.url);
      setImageHistory(prev => [data, ...prev]);
      latestImageRef.current = data;
      updateImagePointMap();
      renderAllImages();
    });
    socketRef.current.on("coordinates-cleared", () => {
      setCoordinates([]);
      setTotalDistance(0);
      updateDistanceDisplay({ distance: 0 });
      setImagePointMap(new Map());
    });
    socketRef.current.on("images-cleared", () => {
      setImageHistory([]);
      setImagePointMap(new Map());
    });
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const updateImagePointMap = () => {
    imagePointMap.clear();
    imageHistory.forEach((image) => {
      const closestCoord = findClosestCoordinateByTimestamp(image.timestamp);
      if (closestCoord) {
        imagePointMap.set(closestCoord.timestamp, {
          image: image,
          coordinate: closestCoord,
        });
      }
    });
  };

  const findClosestCoordinateByTimestamp = (timestamp) => {
    return coordinates[0] || null;
  };

  const handleClearButton = () => {
    if (socketRef.current) {
      socketRef.current.emit("clear-coordinates");
      socketRef.current.emit("clear-images");
    }
    fetch("https://storevisualservice-test.onrender.com/api/all", {
      method: "DELETE",
    })
      .then((response) => response.json())
      .catch((error) => {});
    setCoordinates([]);
    setImageHistory([]);
    setTotalDistance(0);
    setDistance(0);
    setImagePointMap(new Map());
    setCenterCoord([]);
    setPerpendicularCoord([]);
    setPPolygons([]);
    setPstructures([]);
  };

  const handleStartButton = () => {
    setIsActive(!isActive);
    if (socketRef.current) {
      socketRef.current.emit(isActive ? "stop-tracking" : "start-tracking");
    }
    let x = Math.round((Math.random() * 200 - 100) * 100) / 100;
    let z = Math.round((Math.random() * 200 - 100) * 100) / 100;
    x = (x / 100) * 500;
    z = (z / 100) * 250;
    let l = 0;
    let b = 0;
    setTotalDistance(prev => prev + Math.random() * 0.1);
    const photoCapture = Math.random() > 0.5 ? 1 : 0;
    const timestamp = Date.now();

    fetch("https://storevisualservice-test.onrender.com/api/coordinates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
        if (photoCapture === 1) {
          const testImages = [
            "https://firebasestorage.googleapis.com/v0/b/fieldapp-39256.appspot.com/o/ARTracker%2Fgoogle_dummy_phone_9_5.jpg?alt=media&token=8c13c2aa-dd7e-48c0-9353-607951ac7f39"
          ];
          const imageUrl = testImages[Math.floor(Math.random() * testImages.length)];
          const brands = ["Google", "Apple", "Samsung", "LGE"];
          const positions = ["Top Shelf", "Eye Level", "Bottom Shelf", "End Cap"];
          const types = ["Phone", "Tablet", "TV", "Laptop"];
          const randomBrand = brands[Math.floor(Math.random() * brands.length)];
          const randomPosition = positions[Math.floor(Math.random() * positions.length)];
          const randomType = types[Math.floor(Math.random() * types.length)];

          fetch("https://storevisualservice-test.onrender.com/api/image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              imageUrl: imageUrl,
              metadata: { timestamp: timestamp },
            }),
          })
            .then((response) => response.json())
            .then((data) => {
              fetch("https://storevisualservice-test.onrender.com/api/banner_data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  imageUrl: imageUrl,
                  brand: randomBrand,
                  position: randomPosition,
                  type: randomType,
                }),
              })
                .then((response) => response.json())
                .catch((error) => {});
            })
            .catch((error) => {});
        }
      })
      .catch((error) => {});
  };

  const toggleStructure = () => {
    setIsStructureVisible(!isStructureVisible);
  };

  const togglePath = () => {
    setIsPathVisible(!isPathVisible);
  };

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EFF4FE', padding: '5px', paddingLeft: '15px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={logo} alt="Logo" style={{ height: '40px', marginRight: '10px' }} />
          <h1 style={{ margin: 0, color: 'black', fontWeight: 500 }}>Store Visit Tracking</h1>
        </div>
        <div className="control-panel" style={{ textAlign: 'right' }}>
          <div>
            <button id="startButton" type="button" onClick={(e) => { createRipple(e); handleStartButton(); }}>
              Start
            </button>
            <button id="clearButton" type="button" className="clear" onClick={(e) => { createRipple(e); handleClearButton(); }}>
              Clear All
            </button>
            <label className="toggle-container">
              <span>View path</span>
              <input type="checkbox" id="pathToggle" checked={isPathVisible} onChange={togglePath} />
              <span className="slider"></span>
            </label>
            <label className="toggle-container">
              <span>Structure</span>
              <input type="checkbox" id="structureToggle" checked={isStructureVisible} onChange={toggleStructure} />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      {/* Distance Display */}
      <div className="info-display">
        <span className="distance-box">
          <span id="distance" ref={distanceDisplayRef} style={{ color: 'black', fontWeight: 500 }}>
            Distance: {totalDistance.toFixed(2)}
          </span>
          <span className="arrow">◀</span>
        </span>
      </div>

      {/* Main Layout */}
      <div className="layout-container">
        <div className="left-container">
        <div id="visualization" ref={vizRef} style={{ position: 'relative' }}>
  {isPathVisible && coordinates.length > 0 && (
    <svg
      width="100%"
      height="100%"
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
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
          onMouseEnter={() => setIsHovering(index)}
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
      return (
        <div key={index} className="tooltip"
          style={{
            position: 'absolute',
            top: centerZ + center[1] - 10,
            left: centerX + center[0],
            display: isHovering === (perpendicularCoord.length - index - 1) ? "block" : "none"
          }}
          onClick={() => setSelectedImage(index)}
        >
          <div className="imagetooltip-container">
            <img src={imageHistory[index]?.url} alt="" className="tooltip-image" />
          </div>
          <div className="measurement-text">
            <span className="measurement-label">Measurement:</span>
            <span className="measurement-value">
              {parseFloat(a.measurementL).toFixed(1)}&times;{parseFloat(a.measurementB).toFixed(1)}
            </span>
          </div>
          <div className="tooltip-pointer"></div>
        </div>
      );
    })
  )}
</div>
        </div>
        <div className="right-container">
          <div style={{ paddingLeft: '10px', paddingTop: '10px', fontWeight: 'bold', boxShadow: '0px 4px 6px -4px rgba(0, 0, 0, 0.1)', color: 'black' }}>
            Reports
          </div>
          <div id="imageContainer">
            {imageHistory.length > 0 ? (
              imageHistory.map((image, index) => {
                let a = parseImageUrl(image.url);
                return (
                  <div key={index} className={`card ${selectedImage === index ? 'active' : ''}`} ref={(el) => (imageRefs.current[index] = el)}>
                    <div className="card-image-container">
                      <img src={image.url} alt={`Report ${index}`} className="card-image" onClick={() => setModalImage(image.url)} />
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
                      {expandedCards[index] && (
                        <div className="extra-content-container">
                          <div className="extra-header">
                            <img src={star} alt="Icon" className="extra-icon" />
                            <span className="extra-title" style={{ fontWeight: 400, color: 'black' }}>
                              AI Analysis
                            </span>
                          </div>
                          <p className="extra-details">
                            <strong>Brand:</strong> {image.metadata.bannerData?.brand || 'N/A'} <br />
                            <strong>Position:</strong> {image.metadata.bannerData?.position || 'N/A'} <br />
                            <strong>Type:</strong> {image.metadata.bannerData?.type || 'N/A'}
                          </p>
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

      {modalImage && (
        <div className="modal" onClick={() => setModalImage(null)} style={{ zIndex: 20 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setModalImage(null)}>
              &times;
            </button>
            <img src={modalImage} alt="Full view" />
          </div>
        </div>
      )}
    </div>
  );
};
//
export default StoreVisitTracking;
