import React, { useState, useRef, useEffect } from "react"; // Add useEffect import
import axios from "axios"; // Add axios import
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CityDetailsPage from "./CityDetailsPage";

// API configuration - KEEP THIS AT TOP LEVEL
const API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-app.vercel.app/api' 
  : 'http://localhost:8000';

const FORECAST_API_BASE = process.env.NODE_ENV === 'production' 
  ? 'https://your-app.vercel.app/api' 
  : 'http://localhost:8001';

// leaflet config (keep this)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// mock data (keep this)
const mockData = {
  countries: [
    { name: "Norway", lat: 60.472, lon: 8.4689, avg_aqi: 25 },
    { name: "Canada", lat: 56.1304, lon: -106.3468, avg_aqi: 35 },
    { name: "Australia", lat: -25.2744, lon: 133.7751, avg_aqi: 45 },
    { name: "Japan", lat: 36.2048, lon: 138.2529, avg_aqi: 55 },
    { name: "Germany", lat: 51.1657, lon: 10.4515, avg_aqi: 65 },
    { name: "India", lat: 20.5937, lon: 78.9629, avg_aqi: 220 },
    { name: "China", lat: 35.8617, lon: 104.1954, avg_aqi: 165 },
    { name: "United States", lat: 37.0902, lon: -95.7129, avg_aqi: 110 },
    { name: "Azerbaijan", lat: 40.1431, lon: 47.5769, avg_aqi: 95 },
    { name: "Brazil", lat: -14.235, lon: -51.9253, avg_aqi: 85 },
  ],
};

// AQI function (keep this)
const getAQIEmoji = (aqi) => {
  if (aqi <= 50) return "🌱";
  if (aqi <= 100) return "😵‍💫";
  if (aqi <= 150) return "🤯";
  if (aqi <= 200) return "⚠️";
  if (aqi <= 300) return "☣️";
  return "☠️";
};

// MapController component (keep this)
function MapController({ onZoomChange, onCenterChange, center, zoom }) {
  const map = useMap();

  React.useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom());
    },
    moveend: () => {
      const currentCenter = map.getCenter();
      onCenterChange([currentCenter.lat, currentCenter.lng]);
    },
  });

  return null;
}

export default function AirQualityMap() {
  // MOVE ALL HOOKS INSIDE THE COMPONENT FUNCTION
  const [zoom, setZoom] = useState(2);
  const [center, setCenter] = useState([20, 0]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [todayData, setTodayData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [selectedCoords, setSelectedCoords] = useState({ lat: 34.05, lon: -118.24 });
  const mapRef = useRef();

  useEffect(() => {
    if (selectedCoords) {
      console.log("🔄 FETCHING DATA for:", selectedCoords);
      console.log("📡 API URL:", `${API_BASE}/api/data?lat=${selectedCoords.lat}&lon=${selectedCoords.lon}`);
      
      // Today's data
      axios.get(`${API_BASE}/api/data?lat=${selectedCoords.lat}&lon=${selectedCoords.lon}`)
        .then(res => {
          console.log("✅ DATA API SUCCESS:", res.data);
          setTodayData(res.data);
        })
        .catch(err => {
          console.error("❌ DATA API FAILED:", err.message);
          console.error("❌ Full error:", err);
          setTodayData(null);
        });
  
      // Forecast data
      axios.get(`${FORECAST_API_BASE}/api/forecast?lat=${selectedCoords.lat}&lon=${selectedCoords.lon}&category=general`)
        .then(res => {
          console.log("✅ FORECAST API SUCCESS:", res.data);
          setForecast(res.data);
        })
        .catch(err => {
          console.error("❌ FORECAST API FAILED:", err.message);
          setForecast(null);
        });
    }
  }, [selectedCoords]);

  const isWorldView = zoom <= 3;

  const handleCountryClick = (country) => {
    setSelectedCoords({ lat: country.lat, lon: country.lon });
    setSelectedCity(country);
  };

  const handleBackToMap = () => {
    setSelectedCity(null);
  };

  const resetView = () => {
    setCenter([20, 0]);
    setZoom(2);
  };

  const handleZoomIn = () => {
    setZoom((prev) => {
      const newZoom = Math.min(18, prev + 1);
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom((prev) => {
      const newZoom = Math.max(1, prev - 1);
      return newZoom;
    });
  };

  // link
  if (selectedCity) {
    return (
      <CityDetailsPage 
        city={selectedCity} 
        onBack={handleBackToMap} 
        todayData={todayData}  // Make sure this is passed
        forecast={forecast}    // And this too
      />
    );
  }

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative" }}>
      {/* text1 */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          color: "#0f172a",
          textAlign: "center",
          zIndex: 1000,
          opacity: isWorldView ? 1 : 0,
          transition: "opacity 0.5s",
          textShadow: "0 0 10px rgba(255,255,255,0.8)",
          fontFamily: "Nunito, sans-serif",
        }}
      >
        <div style={{ fontSize: "20px", fontWeight: "600" }}>
          Zoom in and choose your city,
        </div>
        <div style={{ fontSize: "28px", fontWeight: "800", marginTop: "5px" }}>
          breathe wisely.
        </div>
      </div>

      {/* map */}
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <MapController
          onZoomChange={setZoom}
          onCenterChange={setCenter}
          center={center}
          zoom={zoom}
        />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* country */}
        {mockData.countries.map((country) => (
          <Marker
            key={country.name}
            position={[country.lat, country.lon]}
            eventHandlers={{
              click: () => handleCountryClick(country),
            }}
          >
            <Popup>
              <div style={{ fontFamily: "Nunito, sans-serif" }}>
                <h3 style={{ margin: "0 0 10px 0", fontWeight: "700" }}>
                  {country.name}
                </h3>
                <p style={{ margin: "5px 0", fontWeight: "600" }}>
                  AQI: {country.avg_aqi} {getAQIEmoji(country.avg_aqi)}
                </p>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "#666" }}>
                  Click to view details
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* reset view */}
      <button
        onClick={resetView}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          background: "rgba(15, 23, 42, 0.95)",
          color: "silver",
          border: "1px solid rgba(192,192,192,0.5)",
          padding: "12px 18px",
          borderRadius: "8px",
          cursor: "pointer",
          zIndex: 1000,
          fontFamily: "Nunito, sans-serif",
          fontWeight: "700",
        }}
      >
        🌍 Reset View
      </button>

      {/* zoom in out */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          left: "20px",
          background: "rgba(15,23,42,0.95)",
          borderRadius: "8px",
          border: "1px solid rgba(192,192,192,0.5)",
          overflow: "hidden",
          zIndex: 1000,
        }}
      >
        <button
          onClick={handleZoomIn}
          style={{
            width: "40px",
            height: "40px",
            background: "transparent",
            border: "none",
            color: "silver",
            fontSize: "20px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          +
        </button>
        <div style={{ borderTop: "1px solid rgba(192,192,192,0.3)" }} />
        <button
          onClick={handleZoomOut}
          style={{
            width: "40px",
            height: "40px",
            background: "transparent",
            border: "none",
            color: "silver",
            fontSize: "20px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          −
        </button>
      </div>
    </div>
  );
}