import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaHeart, FaBed, FaUser,FaRupeeSign,   FaStar } from "react-icons/fa";
import { Button, Spinner, Alert,Badge } from "react-bootstrap";
// import "./WishlistDetailsPage.css"; 
import WishlistModal from "../categories/WishlistModal";

const WishlistDetailsPage = () => {
  const { wishlistId } = useParams();
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isWishlisted, setIsWishlisted] = useState({});
  const [userId, setUserId] = useState(null);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);
     const [showModal, setShowModal] = useState(false);
     const [propertyRatings, setPropertyRatings] = useState({});
   
  console.log("Wishlist ID:", wishlistId); // Debugging
  useEffect(() => {
    fetchWishlistDetails();
  }, [wishlistId]);

  // Fetch wishlist details and associated properties
  const fetchWishlistDetails = async () => {
    setLoading(true);
    try {
      // Fetch wishlist details
      const wishlistResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/wishlistId/${wishlistId}`);
      console.log("Wishlist Response:", wishlistResponse.data); // Debugging
  
      const wishlist = wishlistResponse.data;
      setWishlist(wishlist); // Set the wishlist state
  
      // Ensure wishlist.properties is an array
      if (!wishlist.properties || !Array.isArray(wishlist.properties)) {
        console.error("Wishlist properties is not an array:", wishlist.properties);
        setError("Invalid wishlist data. Properties not found.");
        setLoading(false);
        return;
      }
  
      // Fetch details for each property in the wishlist
      const propertyDetails = await Promise.all(
        wishlist.properties.map(async (id) => {
          const propertyResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`);
          console.log("properties data", propertyResponse.data);
          return propertyResponse.data;
        })
      );
  
      setProperties(propertyDetails);
    } catch (error) {
      console.error("Error fetching wishlist details:", error);
      setError("Failed to load wishlist details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get user ID from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserId(user ? user.id : null);
  }, []);

  // Fetch wishlist status for properties
  useEffect(() => {
    if (!userId) return;

    const fetchWishlists = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
        const wishlists = response.data;
        const wishlistStatus = {};

        properties.forEach((property) => {
          const propertyExists = wishlists.some((wishlist) =>
            wishlist.properties.includes(property._id)
          );
          wishlistStatus[property._id] = propertyExists;
        });

        setIsWishlisted(wishlistStatus);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlists();
  }, [userId, properties]);

  // Handle wishlist click
  const handleWishlistClick = async (propertyId) => {
    setSelectedPropertyId(propertyId);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
      const wishlists = response.data;

      const wishlistWithProperty = wishlists.find((wishlist) =>
        wishlist.properties.includes(propertyId)
      );

      if (wishlistWithProperty) {
        await removeFromWishlist(propertyId, wishlistWithProperty.name);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  // Remove property from wishlist
  const removeFromWishlist = async (propertyId, wishlistName) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}/remove`, {
        headers: { "Content-Type": "application/json" },
        data: { propertyId, wishlistName },
      });

      setIsWishlisted((prev) => ({ ...prev, [propertyId]: false }));
      alert(`Property has been removed from "${wishlistName}".`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove the property. Please try again.");
    }
  };

  // Update wishlist status
  const handleWishlistUpdate = (propertyId) => {
    setIsWishlisted((prev) => ({ ...prev, [propertyId]: true }));
  };

  useEffect(() => {
    if (properties.length === 0) return;

    const fetchAllRatings = async () => {
      try {
        const ratingsData = {};
        
        await Promise.all(
          properties.map(async (property) => {
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_API_BASE_URL}/api/ratings/${property._id}`
              );
              if (response.data && response.data.length > 0) {
                const sum = response.data.reduce((acc, curr) => acc + curr.rating, 0);
                ratingsData[property._id] = sum / response.data.length;
              }
            } catch (error) {
              console.error(`Error fetching ratings for property ${property._id}:`, error);
            }
          })
        );
        
        setPropertyRatings(ratingsData);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchAllRatings();
  }, [properties]);

  
  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading wishlist details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  if (!wishlist) {
    return <p>No wishlist found.</p>;
  }

  return (
    <div className="container mt-lg-5 mt-md-4 mt-sm-3 mt-2 px-3">
      {/* Back Button */}
      <Button variant="outline-primary" onClick={() => navigate(-1)} className="mb-3">
        ← Back to Wishlists
      </Button>
  
      {/* Wishlist Name */}
      <h4 className="text-center fw-bold mb-3 fs-5 fs-md-4">{wishlist.name}</h4>
  
      {/* Property Grid */}
      <div className="row">
        {properties.length > 0 ? (
          properties.map((property) => {
            return (
              <div key={property._id} className="col-12 col-sm-6 col-md-6 col-lg-4 mb-3" style={{ maxWidth: "100%", flex: "1 1 auto" }}>
              <div className="property-item shadow-sm p-2 position-relative">
                {(property.popularity && property.popularity < 5) && (
                  <div className="position-absolute top-0 start-0 m-2">
                    <Badge bg="warning" text="dark" className="shadow-sm">
                      Popular
                    </Badge>
                  </div>
                )}
                <div
                  className="position-absolute top-0 end-0 m-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWishlistClick(property._id);
                  }}
                  style={{ cursor: "pointer", zIndex: 1 }}
                >
                  <FaHeart
                    size={20}
                    color={isWishlisted[property._id] ? "red" : "white"}
                  />
                </div>

                <img
                  src={property.images && property.images.length > 0 ? property.images[0] : "https://via.placeholder.com/150"}
                  alt={property.name}
                  className="img-fluid"
                  onClick={() => window.open(`/property/${property._id}`, "_blank")}
                />

                <div className="property-details text-center p-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="fw-bold mb-0 fs-6 text-start">{property.name}</h6>

                    {propertyRatings[property._id] && (
                      <div className="d-flex align-items-center">
                        <FaStar className="text-warning me-1" style={{ fontSize: "0.8rem" }} />
                        <span className="fw-bold text-muted">
                          {propertyRatings[property._id].toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <h6 className="fw-bold mb-0 fs-6 text-start">{property.category}</h6>

                  <p className="text-muted  mb-1 text-start">
                    {property.city}, {property.address}
                  </p>
                  
                  <div className="d-flex justify-content-between align-items-center border-top pt-2">
                    <div className="d-flex align-items-center">
                      <FaUser className="me-2 text-muted" />
                      <span className="">{property.capacity?.adults || 0} Adults</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <span className="text-muted  me-1">Cost</span>
                      <span className="fw-bold" style={{ fontSize: "0.9rem", color: "#28a745" }}>
                        <FaRupeeSign className="me-1" style={{ color: "black" }} />
                        {property.minPrice?.toLocaleString() || "0"} - {property.maxPrice?.toLocaleString() || "0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            );
          })
        ) : (
          <p className="text-center text-muted">No properties found in this wishlist.</p>
        )}
      </div>
            {/* Wishlist Modal */}
            <WishlistModal
              show={showModal}
              onClose={() => setShowModal(false)}
              userId={userId}
              propertyId={selectedPropertyId}
              onWishlistUpdate={() => handleWishlistUpdate(selectedPropertyId)}
            />
    </div>
  );
};

export default WishlistDetailsPage;