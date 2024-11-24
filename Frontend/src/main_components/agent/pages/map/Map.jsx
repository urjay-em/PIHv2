<<<<<<< Updated upstream
import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet styles
=======
import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Popup, Marker, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { EditControl } from "react-leaflet-draw";
import 'leaflet-draw/dist/leaflet.draw.css';
import { ChromePicker } from 'react-color';
import { Box } from '@mui/material';
import Header from '../../Header';
import L from 'leaflet';

const ImageOverlay = ({ imageUrl, imageBounds }) => {
    const map = useMap();

    useEffect(() => {
        const overlay = L.imageOverlay(imageUrl, imageBounds, { opacity: 1 }).addTo(map);

        return () => {

            map.removeLayer(overlay);
        };
    }, [map, imageUrl, imageBounds]);

    return null;
};
>>>>>>> Stashed changes

function App() {
  useEffect(() => {
    // Check if the map is already initialized
    if (document.getElementById("map")._leaflet_id) {
      console.log("Map already initialized");   
      return;
    }

    // Define the origin coordinates
    const originCoordinates = [9.840895, 118.718932];
    
    // Initialize the map centered on the origin
    const map = L.map("map").setView(originCoordinates, 15); // Set initial view (latitude, longitude)

<<<<<<< Updated upstream
    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Define the bounds for the cemetery area based on the origin coordinates
    const topLeft = [9.840895, 118.718932]; // top-left corner coordinates (origin)
    const bottomRight = [9.845895, 118.723932]; // Adjust bottom-right corner coordinates for the grid
    const rows = 50; // Increased number of rows for smaller blocks
    const columns = 40; // Increased number of columns for smaller blocks

    const latStep = (bottomRight[0] - topLeft[0]) / rows;
    const lonStep = (bottomRight[1] - topLeft[1]) / columns;

    // Loop through and create smaller blocks (50 rows x 40 columns)
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        // Calculate the coordinates for each block
        const topLeftCorner = [
          topLeft[0] + i * latStep,
          topLeft[1] + j * lonStep,
        ];
        const bottomRightCorner = [
          topLeft[0] + (i + 1) * latStep,
          topLeft[1] + (j + 1) * lonStep,
        ];

        // Create a polygon for each block
        const blockCoords = [
          topLeftCorner,
          [topLeftCorner[0], bottomRightCorner[1]],
          bottomRightCorner,
          [bottomRightCorner[0], topLeftCorner[1]],
        ];

        // Create the polygon with a popup
        const block = L.polygon(blockCoords, {
          color: "blue",
          fillColor: "#add8e6",
          fillOpacity: 0.6,
        }).addTo(map);

        // Add a popup to each block with a label
        block.bindPopup(`Block ${i * columns + j + 1}`);
      }
    }

    // Set map to the variable for future checks
    map._leaflet_id = true;
  }, []); // Empty dependency array to run only once on mount

  return (
    <div>
      <h1>Cemetery Map with Smaller Blocks</h1>
      {/* Map container */}
      <div id="map" style={{ height: "600px", width: "100%" }}></div>
    </div>
  );
}

export default App;
=======

    const imageBounds = [
        [9.8391, 118.7202],
        [9.8435, 118.7165] 
    ];

    // URLimage
    const imageUrl = '/assets/pih_map_data.png'; 

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

    useEffect(() => {
        const savedMarkers = JSON.parse(localStorage.getItem("markers"));
        const savedPolygons = JSON.parse(localStorage.getItem("polygons"));

        if (savedMarkers) setMarkers(savedMarkers);
        if (savedPolygons) setPolygons(savedPolygons);
    }, []);

    useEffect(() => {
        localStorage.setItem("markers", JSON.stringify(markers));
        localStorage.setItem("polygons", JSON.stringify(polygons));
    }, [markers, polygons]);

    return (
        <Box m="15px" maxWidth="1000px" mx="auto">
            <Header title="Paradise in Heaven Memorial Park" subtitle="Map" />
            <MapContainer
                center={[9.8413, 118.71835]}
                zoom={16}
                style={{ height: "75vh", width: "100%" }}
                maxZoom={19}
                minZoom={5}
                zoomControl={true}
                scrollWheelZoom={true}
                doubleClickZoom={true}
                dragging={true}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {/* Add the image overlay */}
                <ImageOverlay imageUrl={imageUrl} imageBounds={imageBounds} />

                <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                        position="topright"
                        onCreated={handleCreated}
                        featureGroup={featureGroupRef.current}
                        draw={{
                            rectangle: false,
                        }}
                    />
                </FeatureGroup>

                {markers.map((marker, idx) => (
                    <Marker
                        key={idx}
                        position={marker.position}
                        icon={L.divIcon({ className: "custom-marker", html: `<div style="background-color: ${marker.color}; width: 20px; height: 20px; border-radius: 50%;"></div>` })}
                    >
                        <Popup>Marker with color: {marker.color}</Popup>
                    </Marker>
                ))}

                {polygons.map((polygon, idx) => (
                    <Polygon
                        key={idx}
                        positions={polygon.positions}
                        pathOptions={{ color: polygon.color }}
                    >
                        <Popup>Polygon with color: {polygon.color}</Popup>
                    </Polygon>
                ))}

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

export default Map;
>>>>>>> Stashed changes
