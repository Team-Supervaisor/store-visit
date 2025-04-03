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
      console.log('Store Visit Details:', storeVisitDetails);
      if(storeVisitDetails.status=='finished'){
        setCoordinates(storeVisitDetails.x_y_coords);
        setPPolygons(storeVisitDetails.polygon_coordinates);
        setImageHistory(storeVisitDetails.images);
        
      }
    }, []);




    return (
      <>
        {/* Render your details here */}
      </>
    );
}
