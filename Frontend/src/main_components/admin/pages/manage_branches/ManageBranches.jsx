import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup, useMap } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';
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
  const [blocks, setBlocks] = useState([]); 
  const [hoveredBlock, setHoveredBlock] = useState(null); // Track hovered block
  const featureGroupRef = useRef(null);

  const cemeteryLocation = [9.8413, 118.71835];
  const imageBounds = [
    [9.8391, 118.7202],
    [9.8435, 118.7165]
  ];
  const imageUrl = '/assets/pih_place_overlay.png'; 

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/v1/block/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log("Fetched blocks data:", data);
        if (Array.isArray(data)) {
          setBlocks(data); // Directly set the array if valid
        } else {
          console.error("Invalid blocks data format:", data);
          setBlocks([]); 
        }
      })
      .catch((error) => {
        console.error("Error fetching blocks:", error);
        setBlocks([]);
      });
  }, []);

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
  };

  const handleCreated = (e) => {
    const { layerType, layer } = e;
    if (layerType === "marker") {
      setMarkers([...markers, { position: layer.getLatLng(), color: currentColor }]);
    } else if (layerType === "polygon") {
      setPolygons([...polygons, { positions: layer.getLatLngs()[0], color: currentColor }]);
    }
    setShowColorPicker(false);
  };

  const handleMouseOver = (block, e) => {
    setHoveredBlock(block); // Set the hovered block
  };

  const handleMouseOut = () => {
    setHoveredBlock(null); // Clear the hovered block
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

        <ImageOverlay imageUrl={imageUrl} imageBounds={imageBounds} />

        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topright"
            onCreated={handleCreated}
            featureGroup={featureGroupRef.current}
            draw={{ rectangle: false }}
          />
        </FeatureGroup>

        {/* Render blocks */}
        {blocks.map((block) => {
          const { id, name, coordinates } = block;
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
                mouseover: (e) => handleMouseOver(block, e),
                mouseout: handleMouseOut,
              }}
            />
          );
        })}

        {/* Hovered block info */}
        {hoveredBlock && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: "grey",
              padding: "10px",
              borderRadius: "5px",
              boxShadow: "0 2px 5px rgba(0,0,0,0.3)",
              zIndex: 1000,
            }}
          >
            <strong>Block Name:</strong> {hoveredBlock.name}
          </div>
        )}

        {/* Color Picker */}
        {showColorPicker && (
          <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 1000 }}>
            <ChromePicker color={currentColor} onChange={handleColorChange} />
            <button onClick={() => setShowColorPicker(false)}>Done</button>
          </div>
        )}

        <button
          style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000 }}
          onClick={() => setShowColorPicker(true)}
        >
          Choose Color
        </button>
      </MapContainer>
    </Box>
  );
};

export default CemeteryMap;
