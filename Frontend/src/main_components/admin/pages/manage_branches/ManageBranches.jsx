import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup, Marker, useMap } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';
import { ChromePicker } from 'react-color'; // Ensure you have this dependency
import { Box } from '@mui/material'; // Adjust based on your UI library

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

    const cemeteryLocation = [9.8413, 118.71835];
    const imageBounds = [
        [9.8391, 118.7202],
        [9.8435, 118.7165]
    ];
    const imageUrl = '/assets/pih_place_overlay.png'; // Replace with your actual image path

    const blocks = [
        { id: 1, name: "Block A", coordinates: [[9.840972700656032, 118.71822953224182], [9.840821513357708, 118.71797807514668], [9.840439118774944, 118.71826037764552], [9.840614733912162, 118.71849507093431]] },
        { id: 2, name: "Block B", coordinates: [[9.840602131980551, 118.7185024470091], [9.840427177044095, 118.7182690948248], [9.840050890723427, 118.71854770928624], [9.84023079741828, 118.71877636760476]] },
        // Add other blocks as needed
    ];

    const lots = [
        { id: 1, owner: "John Doe", lotId: "L001", lat: 9.841, lng: 118.718 },
        { id: 2, owner: "Jane Smith", lotId: "L002", lat: 9.842, lng: 118.719 },
    ];

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

    const handleLotClick = (lot) => {
        setSelectedLot(lot);
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

                {blocks.map((block) => (
                    <Polygon
                        key={block.id}
                        positions={block.coordinates}
                        color="blue"
                    >
                        <Popup>
                            <h4>{block.name}</h4>
                        </Popup>
                    </Polygon>
                ))}

                {lots.map((lot) => (
                    <Polygon
                        key={lot.id}
                        positions={[
                            [lot.lat, lot.lng],
                            [lot.lat + 0.001, lot.lng],
                            [lot.lat + 0.001, lot.lng + 0.001],
                            [lot.lat, lot.lng + 0.001]
                        ]}
                        color="green"
                        eventHandlers={{
                            click: () => handleLotClick(lot),
                        }}
                    >
                        <Popup>
                            Lot ID: {lot.lotId}<br />Owner: {lot.owner}
                        </Popup>
                    </Polygon>
                ))}

                {markers.map((marker, idx) => (
                    <Marker
                        key={idx}
                        position={marker.position}
                        icon={L.divIcon({
                            className: "custom-marker",
                            html: `<div style="background-color: ${marker.color}; width: 20px; height: 20px; border-radius: 50%;"></div>`
                        })}
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

export default CemeteryMap;
