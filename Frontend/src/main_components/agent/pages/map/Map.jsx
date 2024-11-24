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
    const map = useMap(); // Get the map instance

    useEffect(() => {
        const overlay = L.imageOverlay(imageUrl, imageBounds, { opacity: 1 }).addTo(map);

        return () => {
            // Cleanup if component unmounts
            map.removeLayer(overlay);
        };
    }, [map, imageUrl, imageBounds]);

    return null; // This component only manages the overlay
};

const Map = () => {
    const [markers, setMarkers] = useState([]);
    const [polygons, setPolygons] = useState([]);
    const [currentColor, setCurrentColor] = useState('#ff0000');
    const [showColorPicker, setShowColorPicker] = useState(false);

    const featureGroupRef = useRef(null);

    // Coordinates for the image corners (Southwest and Northeast corners)
    const imageBounds = [
        [9.8391, 118.7202], // Southwest corner (Bottom Left)
        [9.8435, 118.7165]  // Northeast corner (Top Right)
    ];

    // URL for the image overlay
    const imageUrl = '/assets/pih_map_data.png'; // Ensure the path is correct and publicly accessible

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
