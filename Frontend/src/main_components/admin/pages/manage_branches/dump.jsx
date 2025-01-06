import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Polygon, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { ChromePicker } from 'react-color';
import { Box } from '@mui/material'; 


const ImageOverlay = ({ imageUrl, imageBounds }) => {
  const map = useMap();
  useEffect(() => {
    const overlay = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.6 }).addTo(map);
    return () => {
      map.removeLayer(overlay);
    };
  }, [map, imageUrl, imageBounds]);

  return null;
};

const CemeteryMap = () => {
  const [markers, setMarkers] = useState([]);
  const [polygons, setPolygons] = useState([]);
  const [currentColor, setCurrentColor] = useState("#003BFF");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [markerOpacity, setMarkerOpacity] = useState(1);
  const featureGroupRef = useRef(null);
  const [selectedLot, setSelectedLot] = useState(null);
  const [blocks, setBlocks] = useState([]);

  

  useEffect(() => {
    // Fetch the blocks data from your API
    fetch("http://127.0.0.1:8000/api/v1/block/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`, // Assuming token is stored in localStorage
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        // Since `data` is already an array, just set it directly
        setBlocks(data);
      })
      .catch((error) => {
        console.error("Error fetching blocks:", error);
        setBlocks([]); // Fallback to an empty array in case of error
      });
  }, []);

  const cemeteryLocation = [9.8413, 118.71835];
  const imageBounds = [
    [9.8391, 118.7202],
    [9.8435, 118.7165]
  ];

  const imageUrl = '/assets/pih_place_overlay.png'; // Replace with your actual image path

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
  };

  return (
    <Box m="15px" maxWidth="1000px" mx="auto">
          <h2>Paradise in Heaven Memorial Park</h2>
          <h4>Map</h4>
          <MapContainer
            center={cemeteryLocation}
            zoom={18}
            style={{ height: "75vh", width: "100%" }}
            maxZoom={22}
            minZoom={5}
            scrollWheelZoom={true}
            doubleClickZoom={true}
            dragging={true}
        >

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Render Blocks */}
        {blocks.map((block) => {
            const { id, name, coordinates } = block;

            // Validate coordinates
            if (!Array.isArray(coordinates) || coordinates.length === 0) {
                console.warn(`Invalid coordinates for block ID ${id}:`, coordinates);
                return null;
            }

            return (
                <Polygon
                key={id}
                positions={coordinates}
                color="blue"
                eventHandlers={{
                    mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                        color: "orange", // Highlight color on hover
                    });
                    setSelectedBlock(block); // Set the block data for display
                    },
                    mouseout: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                        color: "blue", // Reset to default color on hover out
                    });
                    setSelectedBlock(null); // Clear the block data
                    },
                }}
                >
                <Popup>
                    <h4>{name}</h4>
                </Popup>
                </Polygon>
            );
            })}

            {/* Render block info if hovered */}
            {selectedBlock && (
            <div
                style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "white",
                padding: "10px",
                borderRadius: "5px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
                }}
            >
                <h3>Block Details</h3>
                <p><strong>Name:</strong> {selectedBlock.name}</p>
                <p><strong>ID:</strong> {selectedBlock.id}</p>
                {/* Add more details as needed */}
            </div>
            )}
      </MapContainer>
    </Box>
  );
};

export default CemeteryMap;
