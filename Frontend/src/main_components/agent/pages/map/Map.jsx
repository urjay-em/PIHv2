import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css"; // Import Leaflet styles

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
