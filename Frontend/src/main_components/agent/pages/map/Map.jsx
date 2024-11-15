import React, { useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Popup, Marker, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { EditControl } from "react-leaflet-draw";
import 'leaflet-draw/dist/leaflet.draw.css';
import { ChromePicker } from 'react-color';
import { Box } from '@mui/material';
import Header from '../../Header';

const Map = () => {
    const [markers, setMarkers] = useState([]);
    const [polygons, setPolygons] = useState([]);
    const [currentColor, setCurrentColor] = useState('#ff0000');
    const [showColorPicker, setShowColorPicker] = useState(false);

    const featureGroupRef = useRef(null);

    // Handle the color change from the color picker
    const handleColorChange = (color) => {
        setCurrentColor(color.hex);
    };

    // Called when a new shape is created
    const handleCreated = (e) => {
        const { layerType, layer } = e;
        if (layerType === "marker") {
            setMarkers([...markers, { position: layer.getLatLng(), color: currentColor }]);
        } else if (layerType === "polygon") {
            setPolygons([...polygons, { positions: layer.getLatLngs()[0], color: currentColor }]);
        }

        setShowColorPicker(false); // Hide color picker after choosing color
    };

    return (
      <Box m="15px" maxWidth="1000px" mx="auto">
            <Header title="Paradise in Heaven Memorial Park" subtitle="Map" />
            <MapContainer
                center={[51.505, -0.09]}
                zoom={13}
                style={{ height: "75vh", width: "100%" }}
            >
              <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; <a href='https://osm.org/copyright'>OpenStreetMap</a> contributors"
              />

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
                  <div style={{ position: 'absolute', buttom: 10, right: 10, zIndex: 1000 }}>
                      <ChromePicker color={currentColor} onChange={handleColorChange} />
                      <button onClick={() => setShowColorPicker(false)}>Done</button>
                  </div>
              )}

            <button
                style={{ position: 'absolute', buttom: 10, left: 10, zIndex: 1000 }}
                onClick={() => setShowColorPicker(true)}
            >
                Choose Color
            </button>
        </MapContainer>
      </Box>
    );
};

export default Map;