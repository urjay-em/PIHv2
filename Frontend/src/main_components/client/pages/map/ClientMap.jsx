import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Popup, Marker, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { EditControl } from "react-leaflet-draw";
import 'leaflet-draw/dist/leaflet.draw.css';
import { ChromePicker } from 'react-color';
import { Box } from '@mui/material';
import Header from '../../Header';
import L from 'leaflet';

const CenterButton = ({ centerCoords, zoomLevel }) => {
    const map = useMap();
    return (
        <button
            style={{
                position: 'absolute',
                top: 10,
                left: 10,
                zIndex: 1000,
                padding: '10px',
                background: 'white',
                border: '1px solid black',
                cursor: 'pointer'
            }}
            onClick={() => map.setView(centerCoords, zoomLevel)}
        >
            Center on Philippines
        </button>
    );
};

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

const Map = () => {
    const [markers, setMarkers] = useState([]);
    const [polygons, setPolygons] = useState([]);
    const [currentColor, setCurrentColor] = useState("#003BFF");
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [markerOpacity, setMarkerOpacity] = useState(1);

    const featureGroupRef = useRef(null);

    const imageBounds = [
        [9.8391, 118.7202],
        [9.8435, 118.7165]
    ];
    const imageUrl = '/assets/pih_map_data.png';

    const cemeteryLocation = [9.8413, 118.71835];

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

    const ZoomToOverlay = () => {
        const map = useMap();

        const zoomToOverlay = () => {
            map.fitBounds(imageBounds);
        };

        //opacity based on zoom level
        const handleZoom = () => {
            const zoomLevel = map.getZoom();
            if (zoomLevel > 18) {
                setMarkerOpacity(0); 
            } else {
                setMarkerOpacity(1);
            }
        };

        //zoom event
        useEffect(() => {
            map.on('zoom', handleZoom);

            return () => {
                map.off('zoom', handleZoom);
            };
        }, [map]);

        return (
            <Marker
                position={cemeteryLocation}
                icon={L.divIcon({
                    className: "custom-marker",
                    html: `<div style="background-color: ${currentColor}; width: 20px; height: 20px; border-radius: 50%; cursor: pointer;"></div>`,
                    opacity: markerOpacity,  // Use the opacity state for the cemetery marker
                })}
                eventHandlers={{
                    click: zoomToOverlay,
                }}
            >
                <Popup>Paradise in Heaven Memorial Park</Popup>
            </Marker>
        );
    };

    return (
        <Box m="100px" maxWidth="1000px" mx="auto">
            <Header title="Paradise in Heaven Memorial Park" subtitle="Map" />
            <MapContainer
                center={cemeteryLocation}
                zoom={5}  // Set the initial zoom level closer to the Philippines
                style={{ height: "75vh", width: "100%" }}
                maxZoom={22} // Increased maxZoom for detailed views
                minZoom={5}
                zoomControl={false} // Disable default zoom control
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

                {/* Cemetery marker that zooms to fit the image overlay */}
                <ZoomToOverlay />

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
                        icon={L.divIcon({
                            className: "custom-marker",
                            html: `<div style="background-color: ${marker.color}; width: 20px; height: 20px; border-radius: 50%;"></div>`,
                            opacity: markerOpacity
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

                {/* Add center button */}
                <CenterButton centerCoords={[12.8797, 121.7740]} zoomLevel={5} />

                {/* Re-add zoom control at bottom right */}
                <div style={{ position: 'absolute', bottom: 10, right: 10, zIndex: 1000 }}>
                    <div
                        style={{
                            background: "white",
                            padding: "5px",
                            border: "1px solid black",
                            borderRadius: "5px",
                            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.3)",
                        }}
                    >
                        <button onClick={() => map.zoomIn()} style={{ display: "block", margin: "5px auto" }}>
                            +
                        </button>
                        <button onClick={() => map.zoomOut()} style={{ display: "block", margin: "5px auto" }}>
                            - 
                        </button>
                    </div>
                </div>
            </MapContainer>
        </Box>
    );
};

export default Map;
