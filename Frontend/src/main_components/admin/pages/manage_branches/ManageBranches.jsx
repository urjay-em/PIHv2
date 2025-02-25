import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "../../../../features/axiosInstance.js";
import L from "leaflet"; 
import Form from "./buyplotform.jsx";

const ImageOverlay = ({ imageUrl, imageBounds }) => {
    const map = useMap();

    useEffect(() => {
        const overlay = L.imageOverlay(imageUrl, imageBounds, { opacity: 0.9 }).addTo(map);

        return () => {
            map.removeLayer(overlay);
        };
    }, [map, imageUrl, imageBounds]);

    return null;
};

const CemeteryMap = () => {
    const [plots, setPlots] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [selectedPlot, setSelectedPlot] = useState(null); // Store the selected plot for the form
    const [isFormVisible, setIsFormVisible] = useState(false); // Toggle visibility of the form
    const cemeteryLocation = [9.8413, 118.71835];

    // Bounds for the image overlay
    const imageBounds = [
        [9.8391, 118.7202],
        [9.8435, 118.7165],
    ];
    const imageUrl = '/assets/pih_place_overlay.png';

    const getMarkerIcon = (status) => {
        let iconUrl;
        switch (status) {
            case "vacant":
                iconUrl = '/assets/blackg.png';
                break;
            case "occupied":
                iconUrl = '/assets/blueg.png';
                break;
            case "reserved":
                iconUrl = '/assets/yellowg.png';
                break;
            default:
                iconUrl = '/assets/blackg.png';
        }

        return new L.Icon({
            iconUrl: iconUrl,
            iconSize: [30, 45],
            iconAnchor: [15, 45],
            popupAnchor: [0, -45],
        });
    };

    // Fetch blocks and plots from the API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const plotResponse = await axiosInstance.get("plots");
                console.log("Fetched Plots:", plotResponse.data);

                const blockResponse = await axiosInstance.get("blocks");
                console.log("Fetched Blocks:", blockResponse.data);

                if (Array.isArray(plotResponse.data)) {
                    setPlots(plotResponse.data);
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

    const groupedPlots = blocks.reduce((acc, block) => {
        acc[block.id] = plots.filter((plot) => plot.block === block.id);
        return acc;
    }, {});

    const handleMarkerClick = (plot, map) => {
        setSelectedPlot(plot);
        zoomToPlot(plot, map);
    };

    const zoomToPlot = (plot, map) => {
        const plotLocation = [plot.latitude, plot.longitude];
        map.setView(plotLocation, map.getZoom());
    };


    const handleBuyPlot = (plot, blockId) => {
        const plotWithBlockId = { ...plot, block_id: blockId };
        setSelectedPlot(plotWithBlockId);
        setIsFormVisible(true);
    };

    const handleCloseForm = () => {
        setIsFormVisible(false); 
        setSelectedPlot(null);
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
    
                {/* Display blocks and their associated plots */}
                {blocks.map((block) => {
                    const blockCoordinates = JSON.parse(block.coordinates);
                    return (
                        <Polygon key={block.id} positions={blockCoordinates} color="blue">
                            <Popup>
                                <h4>{block.block_name}</h4>
                                <p>{block.description}</p>
                            </Popup>

                            {/* Display plots inside the block */}
                            {groupedPlots[block.id]?.map((plot) => {
                                const markerIcon = getMarkerIcon(plot.status);

                                return (
                                    <Marker
                                        key={plot.plot_id}
                                        position={[plot.latitude, plot.longitude]}
                                        icon={markerIcon}
                                        eventHandlers={{
                                            click: (e) => handleMarkerClick(plot, e.target._map),
                                        }}
                                    >
                                        <Popup>
                                            <h4>{plot.plot_name || "Unnamed Plot"}</h4>
                                            <p>Plot ID: {plot.plot_id}</p>
                                            <p>Status: {plot.status}</p>
                                            {plot.status === "vacant" && (
                                                <button
                                                    onClick={() => handleBuyPlot(plot, block.id)} // Pass block.id here
                                                    style={{
                                                        background: "#28a745",
                                                        color: "white",
                                                        border: "none",
                                                        padding: "5px 10px",
                                                        cursor: "pointer",
                                                        borderRadius: "5px",
                                                    }}
                                                >
                                                    Buy Plot
                                                </button>
                                            )}
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </Polygon>
                    );
                })}
            </MapContainer>
    
            {/* Floating client form */}
            {isFormVisible && selectedPlot && (
                <div
                    style={{
                        position: "fixed",
                        top: "20%",
                        right: "20px",
                        zIndex: 1000,
                        background: "#333",
                        color: "white", 
                        padding: "20px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.4)",
                        borderRadius: "10px",
                        width: "350px",
                        maxHeight: "70vh", 
                        overflowY: "auto",
                    }}
                >
                    <button
                        onClick={handleCloseForm}
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            background: "transparent",
                            border: "none",
                            fontSize: "18px",
                            color: "white", 
                            cursor: "pointer",
                        }}
                    >
                        ✖
                    </button>
                    <h2 style={{ color: "white" }}></h2>
                    <Form
                        plot={selectedPlot} 
                        onClose={handleCloseForm}
                    />
                </div>
            )}

            {/* Backdrop overlay */}
            {isFormVisible && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.5)", 
                        zIndex: 999,
                    }}
                    onClick={handleCloseForm}
                />
            )}

        </div>
    );
    
};

export default CemeteryMap;
