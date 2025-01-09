import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axiosInstance from "../../../../features/axiosInstance.js";
import L from "leaflet"; 
import Form from "../../pages/manage_client/clientform.jsx";


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
    const [lots, setLots] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [selectedPlot, setSelectedPlot] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const cemeteryLocation = [9.8413, 118.71835];

    //bounds for image
    const imageBounds = [
        [9.8391, 118.7202],
        [9.8435, 118.7165],
    ];
    const imageUrl = '/assets/pih_place_overlay.png';

    //icon based on status
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

    //blocks and lots
    useEffect(() => {
        const fetchData = async () => {
            try {
                const plotResponse = await axiosInstance.get("plots");
                console.log("Fetched Lots:", plotResponse.data);

                const blockResponse = await axiosInstance.get("blocks"); 
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

    const groupedPlots = blocks.reduce((acc, block) => {
        acc[block.id] = lots.filter(lot => lot.block === block.id);
        return acc;
    }, {});

    const handleMarkerClick = (lot, map) => {
        setSelectedPlot(lot); 
        handleAddClient(lot); 
        zoomToPlot(lot, map);
    };

    const handleAddClient = (lot) => {
        setSelectedPlot(lot);
        setIsFormVisible(true);
    };

    const zoomToPlot = (lot, map) => {
      const plotLocation = [lot.latitude, lot.longitude];
      map.setView(plotLocation, map.getZoom());
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

                {/* Image*/}
                <ImageOverlay imageUrl={imageUrl} imageBounds={imageBounds} />

                {/* as polygons */}
                {blocks.map((block) => {
                    const blockCoordinates = JSON.parse(block.coordinates);
                    return (
                        <Polygon key={block.id} positions={blockCoordinates} color="blue">
                            <Popup>
                                <h4>{block.block_name}</h4>
                                <p>{block.description}</p>
                            </Popup>

                            {/*plots inside the block */}
                            {groupedPlots[block.id]?.map((lot) => {
                                const markerIcon = getMarkerIcon(lot.status);

                                return (
                                    <Marker
                                        key={lot.plot_id}
                                        position={[lot.latitude, lot.longitude]}
                                        icon={markerIcon}
                                        eventHandlers={{
                                            click: (e) => handleMarkerClick(lot, e.target._map),
                                        }}
                                    >
                                        <Popup>
                                            <h4>{lot.plot_name || "Unnamed Plot"}</h4>
                                            <p>Block ID: {lot.block}</p>
                                            <p>Status: {lot.status}</p>
                                        </Popup>
                                    </Marker>
                                );
                            })}
                        </Polygon>
                    );
                })}
            </MapContainer>

            {/* client form */}
            {isFormVisible && (
                <Form
                    plot={selectedPlot}
                    onClose={() => setIsFormVisible(false)}
                />
            )}
        </div>
    );
};

export default CemeteryMap;
