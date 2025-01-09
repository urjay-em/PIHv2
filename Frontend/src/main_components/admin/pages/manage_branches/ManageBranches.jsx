import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "../../../../features/axiosInstance.js";
import PushPinIcon from '@mui/icons-material/PushPin';
import L from "leaflet";
import Form from "../../pages/manage_client/clientform.jsx"; // Import your client form

// ImageOverlay component for adding an overlay image to the map
const ImageOverlay = ({ imageUrl, imageBounds }) => {
    const map = useMap();

    useEffect(() => {
        const overlay = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.9 }).addTo(map);
        // Adjust the initial map zoom to fit the overlay
        map.fitBounds(imageBounds);
        
        return () => {
            map.removeLayer(overlay);
        };
    }, [map, imageUrl, imageBounds]);

    return null;
};

const CemeteryMap = () => {
    const [lots, setLots] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [selectedPlot, setSelectedPlot] = useState(null); // Store the selected plot
    const [isFormVisible, setIsFormVisible] = useState(false); // Control form visibility
    const cemeteryLocation = [9.8413, 118.71835]; // Center of the map

    // Define the bounds for the image overlay
    const imageBounds = [
        [9.8391, 118.7202],
        [9.8435, 118.7165],
    ];
    const imageUrl = '/assets/pih_place_overlay.png'; // Path to your overlay image

    const getMarkerColor = (status) => {
        switch (status) {
            case "vacant":
                return "green";
            case "occupied":
                return "red";
            case "reserved":
                return "yellow";
            default:
                return "gray";
        }
    };

    // Fetch the blocks and lots
    useEffect(() => {
        const fetchData = async () => {
            try {
                const plotResponse = await axiosInstance.get("plots");
                console.log("Fetched Lots:", plotResponse.data);

                const blockResponse = await axiosInstance.get("blocks"); // Correct endpoint
                console.log("Fetched Blocks:", blockResponse.data);

                if (Array.isArray(plotResponse.data)) {
                    setLots(plotResponse.data);
                } else {
                    console.error("Invalid response format for plots:", plotResponse.data);
                }

                if (Array.isArray(blockResponse.data)) {
                    setBlocks(blockResponse.data);
                } else {
                    console.error("Invalid response format for blocks:", blockResponse.data);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    // Group plots by block_id
    const groupedPlots = blocks.reduce((acc, block) => {
        acc[block.id] = lots.filter(lot => lot.block === block.id);
        return acc;
    }, {});

    // Handle marker click to show the client form
    const handleMarkerClick = (lot) => {
        setSelectedPlot(lot); // Set the plot data
        handleAddClient(lot); // Open client form dialog
    };

    const handleAddClient = (lot) => {
        setSelectedPlot(lot);  // You can store the plot data in the form data as needed
        setIsFormVisible(true); // Open the form
    };

    return (
        <div>
            <MapContainer
                center={cemeteryLocation}
                zoom={18}
                style={{ height: "90vh", width: "99%" }}
                maxZoom={22}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {/* Image overlay */}
                <ImageOverlay imageUrl={imageUrl} imageBounds={imageBounds} />

                {/* Render blocks as polygons */}
                {blocks.map((block) => {
                    // Ensure coordinates are parsed into proper format for Leaflet
                    const blockCoordinates = JSON.parse(block.coordinates); // Ensure coordinates are in the correct format
                    return (
                        <Polygon key={block.id} positions={blockCoordinates} color="blue">
                            <Popup>
                                <h4>{block.block_name}</h4>
                                <p>{block.description}</p>
                            </Popup>

                            {/* Render plots inside the block */}
                            {groupedPlots[block.id]?.map((lot) => {
                                const markerColor = getMarkerColor(lot.status);

                                return (
                                    <Marker
                                        key={lot.plot_id}
                                        position={[lot.latitude, lot.longitude]}
                                        eventHandlers={{
                                            click: () => handleMarkerClick(lot), // Set selected plot on click
                                        }}
                                    >
                                        <Popup>
                                            <h4>{lot.plot_name || "Unnamed Plot"}</h4>
                                            <p>Block ID: {lot.block}</p>
                                            <p>Status: {lot.status}</p>
                                        </Popup>
                                        <div
                                            style={{
                                                fontSize: "30px", // Adjust the size of the icon
                                                color: markerColor, // Adjust color based on status
                                            }}
                                        >
                                            <PushPinIcon />
                                        </div>
                                    </Marker>
                                );
                            })}
                        </Polygon>
                    );
                })}
            </MapContainer>

            {/* Conditionally render the client form */}
            {isFormVisible && (
                <Form 
                    plot={selectedPlot} 
                    onClose={() => setIsFormVisible(false)} // Pass a function to close the form
                />
            )}
        </div>
    );
};

export default CemeteryMap;