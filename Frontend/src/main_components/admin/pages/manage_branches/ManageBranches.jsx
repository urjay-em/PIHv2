import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Popup, ImageOverlay, Marker } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw";
import 'leaflet/dist/leaflet.css';

const CemeteryMap = () => {
  const [selectedLot, setSelectedLot] = useState(null);

  const blocks = [
    { id: 1, name: "Block A", coordinates: [[9.840972700656032, 118.71822953224182], [9.840821513357708, 118.71797807514668], [9.840439118774944, 118.71826037764552], [9.840614733912162, 118.71849507093431]] },
    { id: 2, name: "Block B", coordinates: [[9.840602131980551, 118.7185024470091], [9.840427177044095, 118.7182690948248], [9.840050890723427, 118.71854770928624], [9.84023079741828, 118.71877636760476]] },
    { id: 3, name: "Block 1", coordinates: [[9.840901965099484, 118.71890075504783], [9.840699281631604, 118.71862649917604], [9.840330225746897, 118.7189067900181], [9.840534229855772, 118.71917501091959]] },
    { id: 4, name: "Block 2", coordinates: [[9.841229009611775, 118.71865868568422], [9.84105471521359, 118.71836364269258], [9.840712381191274, 118.71862381696704], [9.840914404444613, 118.71889740228654]] },
    { id: 5, name: "Block 3", coordinates: [[9.841134055554205, 118.7192125618458], [9.840906728844784, 118.71890645474197], [9.84053981615928, 118.71918104588987], [9.840616211539535, 118.71927827596667], [9.840760796863766, 118.71941037476066]] },
    { id: 6, name: "Block 4", coordinates: [[9.841497653950949, 118.71902681887151], [9.841237533422879, 118.71866874396802], [9.8409221312552, 118.71890544891357], [9.84113933911995, 118.71920719742776]] },
    { id: 7, name: "Block 5", coordinates: [[9.841814714169631, 118.71885851025583], [9.84159221983547, 118.71854268014432], [9.841310312114638, 118.71874988079071], [9.841508373770333, 118.71902011334898]] },
    { id: 8, name: "Block 6", coordinates: [[9.84213003343394, 118.7186948955059], [9.841897964658845, 118.71838577091694], [9.841629261300813, 118.71858626604082], [9.841821380923061, 118.7188544869423]] },
    { id: 9, name: "Block 7", coordinates: [[9.842255502860615, 118.7186345458031], [9.842419233369252, 118.7184374034405], [9.84213666615028, 118.71820539236072], [9.841908235464743, 118.71837705373765], [9.84214422967362, 118.7186908721924]] },
    { id: 10, name: "Block 8", coordinates: [[9.843005759940946, 118.71826641261579], [9.842878340867097, 118.71804714202882], [9.84249130854935, 118.71824495494367], [9.842701913352819, 118.71842265129091]] },
  ];

  const lots = [
    { id: 1, owner: "John Doe", lotId: "L001", lat: 51.5, lng: -0.1 },
    { id: 2, owner: "Jane Smith", lotId: "L002", lat: 51.51, lng: -0.11 },
  ];

  const handleLotClick = (lot) => setSelectedLot(lot);

  // Coordinates for the image overlay (Example values, replace with your own image bounds)
  const imageBounds = [
    [51.48, -0.13], // Bottom-left corner
    [51.55, -0.08], // Top-right corner
  ];

  // URL of the image to overlay (replace with your image path)
  const imageUrl = 'https://example.com/your-image.png'; // Replace with your image URL

  return (
    <div style={{ height: '650px', position: 'relative', width: '100%' }}>
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={[9.841205, 118.719037]}
        zoom={18}
        maxZoom={25}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
          maxZoom={25}
        />
        
        {/* Image overlay on the map */}
        <ImageOverlay
          url={imageUrl}
          bounds={imageBounds}
          opacity={0.6} // You can adjust the opacity as needed
        />
        
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
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default CemeteryMap;
