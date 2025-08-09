import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import axios from "axios";
import { FaMapMarkedAlt } from "react-icons/fa"; // Airbnb-style map icon
import marker from "../../assets/image.png"
const mapContainerStyle = {
  position: "fixed",
  top: "0",
  left: "0",
  width: "100%",
  height: "100vh", // Full screen map
  zIndex: "1000",
};

function MapComponent() {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);

  // Fetch properties when map is shown
  useEffect(() => {
    if (showMap) {
      setLoading(true);
      axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties`)
        .then((response) => {
          if (Array.isArray(response.data) && response.data.length > 0) {
            setProperties(response.data);
          } else {
            setError("No properties found.");
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching properties:", error);
          setError("Failed to load properties.");
          setLoading(false);
        });
    }
  }, [showMap]);

  const mapCenter =
    properties.length > 0
      ? { lat: parseFloat(properties[0].latitude), lng: parseFloat(properties[0].longitude) }
      : { lat: 20.5937, lng: 78.9629 }; // Default center (India)

  const handleMapLoad = (mapInstance) => {
    mapRef.current = mapInstance;
  };

  const handleMapUnmount = () => {
    if (mapRef.current) {
      google.maps.event.clearInstanceListeners(mapRef.current);
      mapRef.current = null;
    }
  };

  const renderMap = () => {
    if (window.google) {
      return (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={10}
          onLoad={handleMapLoad}
          onUnmount={handleMapUnmount}
        >
          {properties.map((property, index) => (
           <Marker
           key={index}
           position={{
             lat: parseFloat(property.latitude),
             lng: parseFloat(property.longitude),
           }}
           onClick={() => setSelectedProperty(property)}
           title={property.name}
           icon={{
             url: marker, // Use a better icon if desired
             scaledSize: new window.google.maps.Size(40, 40), // Adjust marker size
           }}
           label={{
             text: property.name,
             color: "#2D3142	", // Bright label text
             fontSize: "14px",
             fontWeight: "bold",
             className: "custom-label", // Optional: you can style it via CSS
           }}
         />
         
          ))}

          {selectedProperty && (
            <InfoWindow
              position={{
                lat: parseFloat(selectedProperty.latitude),
                lng: parseFloat(selectedProperty.longitude),
              }}
              onCloseClick={() => setSelectedProperty(null)}
            >
              <div style={{ textAlign: "center", maxWidth: "250px" }}>
                {/* Clickable Hotel Name */}
                <h4
                  style={{ cursor: "pointer", color: "#007BFF", marginBottom: "8px" }}
                  onClick={() => window.open(`/property/${selectedProperty._id}`, "_blank")}
                >
                  {selectedProperty.name}
                </h4>

                {/* Clickable Image with Increased Size */}
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.name}
                    style={{
                      width: "100%",
                      maxHeight: "150px", // Increased image size
                      objectFit: "cover",
                      cursor: "pointer",
                      borderRadius: "8px",
                    }}
                    onClick={() => window.open(`/property/${selectedProperty._id}`, "_blank")}
                  />
                )}

                {/* Get Directions Link */}
                <div style={{ marginTop: "10px" }}>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedProperty.latitude},${selectedProperty.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#007BFF", textDecoration: "none", fontWeight: "bold" }}
                  >
                    Get Directions
                  </a>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      );
    }
    return <p>Google Maps is not available.</p>;
  };

  return (
    <>
      <button
        onClick={() => setShowMap(!showMap)}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "12px 20px",
          fontSize: "16px",
          backgroundColor: "white",
          border: "1px solid #ddd",
          borderRadius: "30px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(206, 59, 59, 0.2)",
          zIndex: "1100",
        }}
      >
        <FaMapMarkedAlt size={20} color="#FF5A5F" />
        {showMap ? "Hide Map" : "Map"}
      </button>

      {showMap && (
        <div style={mapContainerStyle}>
          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            {loading ? <p>Loading map...</p> : error ? <p style={{ color: "red" }}>{error}</p> : renderMap()}
          </LoadScript>
        </div>
      )}
    </>
  );
}

export default MapComponent;
