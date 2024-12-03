import React, { useState, useEffect } from "react";
import { TileLayer, Polygon, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Box } from "@mui/material";
import Header from "../main_components/admin/Header";
import L from "leaflet";

// Generate grid coordinates dynamically
const generateGrid = (center, rows, cols, size, rotation) => {
    const [lat, lng] = center;
    const grid = [];
    const angleRad = (rotation * Math.PI) / 180;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const offsetX = col * size;
            const offsetY = row * size;

            const xRotated = offsetX * Math.cos(angleRad) - offsetY * Math.sin(angleRad);
            const yRotated = offsetX * Math.sin(angleRad) + offsetY * Math.cos(angleRad);

            const cellCenter = [
                lat + yRotated / 111320,
                lng + xRotated / (111320 * Math.cos(lat * (Math.PI / 180))),
            ];

            const cellPolygon = [
                cellCenter,
                [cellCenter[0], cellCenter[1] + size / 111320],
                [cellCenter[0] - size / 111320, cellCenter[1] + size / 111320],
                [cellCenter[0] - size / 111320, cellCenter[1]],
            ];
            grid.push(cellPolygon);
        }
    }
    return grid;
};

const GridOverlay = ({ center, rows, cols, size, rotation }) => {
    const [grid, setGrid] = useState([]);

    useEffect(() => {
        const newGrid = generateGrid(center, rows, cols, size, rotation);
        setGrid(newGrid);
    }, [center, rows, cols, size, rotation]);

    return (
        <>
            {grid.map((cell, idx) => (
                <Polygon
                    key={idx}
                    positions={cell}
                    pathOptions={{
                        color: "blue",
                        fillColor: "lightblue",
                        fillOpacity: 0.5,
                    }}
                />
            ))}
        </>
    );
};

const Map = ({ user }) => {
    const initialCenter = [9.8413, 118.71835];
    const [gridSize, setGridSize] = useState(20);
    const [gridRotation, setGridRotation] = useState(0);
    const [gridCenter, setGridCenter] = useState(initialCenter);
    const isAdmin = user?.accountType === "admin";

    // Handlers
    const handleMove = () => {
        setGridCenter([gridCenter[0] + 0.001, gridCenter[1] + 0.001]);
    };

    const handleResize = () => {
        setGridSize(gridSize + 5);
    };

    const handleRotate = () => {
        setGridRotation(gridRotation + 10);
    };

    return (
        <Box m="15px" maxWidth="1000px" mx="auto">
            <Header
                title="Paradise in Heaven Memorial Park"
                subtitle="Map with Editable Grid for Admins"
            />

            <Box style={{ height: "75vh", position: "relative" }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {/* Add Grid */}
                <GridOverlay
                    center={gridCenter}
                    rows={10}
                    cols={10}
                    size={gridSize}
                    rotation={gridRotation}
                />

                {/* Move, Resize, Rotate Icons */}
                {isAdmin && (
                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            display: "flex",
                            gap: "10px",
                            zIndex: 1000,
                        }}
                    >
                        <button
                            onClick={handleMove}
                            style={{
                                padding: "5px",
                                backgroundColor: "blue",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Move
                        </button>
                        <button
                            onClick={handleResize}
                            style={{
                                padding: "5px",
                                backgroundColor: "green",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Resize
                        </button>
                        <button
                            onClick={handleRotate}
                            style={{
                                padding: "5px",
                                backgroundColor: "orange",
                                color: "white",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            Rotate
                        </button>
                    </div>
                )}
            </Box>

            {/* Grid Controls */}
            <Box mt="10px">
                {isAdmin && (
                    <>
                        <label>
                            Grid Size (meters):
                            <input
                                type="number"
                                value={gridSize}
                                onChange={(e) => setGridSize(parseFloat(e.target.value))}
                                style={{ marginLeft: "10px", width: "80px" }}
                            />
                        </label>
                        <label style={{ marginLeft: "20px" }}>
                            Rotation (degrees):
                            <input
                                type="number"
                                value={gridRotation}
                                onChange={(e) => setGridRotation(parseFloat(e.target.value))}
                                style={{ marginLeft: "10px", width: "80px" }}
                            />
                        </label>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Map;
