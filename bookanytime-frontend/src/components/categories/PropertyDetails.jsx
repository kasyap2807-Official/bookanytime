import React, { useEffect, useState, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { FaWhatsapp, FaHeart, FaShareAlt, FaShareSquare, FaInstagram } from "react-icons/fa";
import WishlistModal from "./WishlistModal";
import { Typography } from "@mui/material";
//import Footer from "/home/ubuntu/bookanytime/bookanytime-frontend/src/Footer"; // Adjust the path as needed
import Footer from "../../Footer";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAllImages, setShowAllImages] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({});
  const [ratings, setRatings] = useState([]);

  const [showReservationBox, setShowReservationBox] = useState(true); // Set to true to show by default
  const [isFixed, setIsFixed] = useState(true);

  const ratingsRef = useRef(null);
  const reservationBoxRef = useRef(null);
  const containerRef = useRef(null);


  // Default map center (can be dynamically set based on property location)
  const [mapCenter, setMapCenter] = useState({ lat: 0, lng: 0 });


  useEffect(() => {
    const handleScroll = () => {
      if (!ratingsRef.current || !reservationBoxRef.current || !containerRef.current) return;

      const ratingsTop = ratingsRef.current.getBoundingClientRect().top;
      const containerBottom = containerRef.current.getBoundingClientRect().bottom;
      const windowHeight = window.innerHeight;

      // Calculate when to switch from fixed to absolute positioning
      if (ratingsTop < windowHeight) {
        setIsFixed(false);
      } else if (containerBottom > windowHeight) {
        setIsFixed(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate top position when not fixed
  const calculateTopPosition = () => {
    if (!ratingsRef.current || isFixed) return 'auto';
    const containerRect = containerRef.current.getBoundingClientRect();
    const ratingsRect = ratingsRef.current.getBoundingClientRect();
    return `${ratingsRect.top - containerRect.top}px`;
  };

  const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
  };

  // Then use it in your component:
  const { width } = useWindowSize();
  const isMobile = width <= 768;
  const boxStyle = useMemo(() => ({
    position: isFixed ? 'fixed' : 'absolute',
    bottom: isFixed ? (isMobile ? '15px' : '30px') : 'auto',
    right: isFixed ? (isMobile ? '15px' : '30px') : '0',
    // ... rest of styles
  }), [isFixed, isMobile]);

  useEffect(() => {
    setLoading(true);
    setError("");

    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${id}`)
      .then((response) => {
        if (response.data) {
          setProperty(response.data);
          console.log("data from backed in properties list", response.data);
          // console.log("data from backed in properties list", response.data.category);
          // Set map center based on property location
          if (response.data.latitude && response.data.longitude) {
            setMapCenter({
              lat: parseFloat(response.data.latitude),
              lng: parseFloat(response.data.longitude),
            });
          }

          // Store recently viewed properties
          const recentlyViewed = JSON.parse(localStorage.getItem("recentlyViewed")) || [];

          // Remove duplicate entries
          const updatedList = recentlyViewed.filter((prop) => prop.id !== response.data._id);

          // Add the current property to the beginning
          updatedList.unshift({
            id: response.data._id,
            name: response.data.name,
            image: response.data.images?.[0], // Store the first image
            city: response.data.city,
            maxPrice: response.data.maxPrice,
            minPrice: response.data.minPrice,
            adults: response.data.capacity.adults,
            bedroom: response.data.bedrooms,
            category:response.data.category
          });

          // Limit the number of recently viewed properties (e.g., last 5)
          if (updatedList.length > 10) updatedList.pop();

          localStorage.setItem("recentlyViewed", JSON.stringify(updatedList));
        } else {
          setError("Property not found.");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching property details:", error);
        setError("No properties available.");
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (!property?._id) return; // Ensure property is available before fetching ratings

    const fetchRatings = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/ratings/${property._id}`
        );
        setRatings(response.data);
        console.log("ratings data", response.data)
        
      } catch (error) {
        console.error("Error fetching ratings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [property]);



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUser(user);
    setUserId(user ? user.id : null);
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchWishlists = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
        const wishlists = response.data;
        const propertyExists = wishlists.some((wishlist) => wishlist.properties.includes(id));
        setIsWishlisted(propertyExists);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlists();
  }, [userId, id]);

  const openWhatsAppChat = async () => {
    if (!userId) {
      window.location.href = "/login"; // Redirect to login page
      return;
    }

    if (!property || !property.whatsappNumber) {
      alert("WhatsApp number not available.");
      return;
    }

    let phoneNumber = property.whatsappNumber.trim(); // Remove extra spaces
    phoneNumber = phoneNumber.replace(/\D/g, ""); // Remove non-numeric characters

    if (phoneNumber.length < 10) {
      alert("Invalid WhatsApp number.");
      return;
    }

    // Ensure the number has a country code; assume +91 (India) if missing
    if (phoneNumber.length === 10) {
      phoneNumber = "91" + phoneNumber; // Add default country code
    }

    // Construct data to save
    const contactData = {
      userId: user.id,
      userName: user.fullName,
      userEmail: user.email,
      userPhoneNumber: user.phoneNumber,
      propertyId: property._id,
      propertyName: property.name,
      propertyAddress: property.address,
      contactDate: new Date().toISOString(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/trackdata/contacts`, contactData);
      console.log("Contact data saved successfully.", contactData);
    } catch (error) {
      console.error("Error saving contact data:", error);
    }

    const url = `https://wa.me/${phoneNumber}`;
    console.log("Opening WhatsApp chat:", url); // Debugging
    window.open(url, "_blank");
  };

  const openInstagram = async () => {
    if (!userId) {
      window.location.href = "/login"; // Redirect to login page
      return;
    }
    let instagram = property.instagram.trim(); // Remove extra spaces
    const url = `https://www.instagram.com/${instagram}`;
    console.log("Opening instagram chat:", url); // Debugging
    window.open(url, "_blank");
  };

  const handleWishlistClick = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
      const wishlists = response.data;
      const wishlistWithProperty = wishlists.find((wishlist) => wishlist.properties.includes(id));

      if (wishlistWithProperty) {
        await removeFromWishlist(id, wishlistWithProperty.name);
      } else {
        setShowModal(true);
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  const removeFromWishlist = async (propertyId, wishlistName) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}/remove`, {
        headers: { "Content-Type": "application/json" },
        data: { propertyId, wishlistName },
      });

      setIsWishlisted(false);
      alert(`"${property.name}" has been removed from "${wishlistName}".`);
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      alert("Failed to remove the property. Please try again.");
    }
  };

  const handleWishlistUpdate = () => {
    setIsWishlisted(true);
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  if (loading) return <p className="text-center mt-5">Loading property details...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (!property) return null;


  return (
    <div className="container-fluid mt-4 custom-container" ref={containerRef}>
      <div
        className="d-flex justify-content-between align-items-center mb-4 mt-4"
        style={{
          position: 'sticky',
          top: '65px',
          zIndex: '1000',
          backgroundColor: '#fff',
          padding: '5px '
          // boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        {/* Property Name on the left */}
        <h1
          className="m-0 fw-bold fs-3 fs-md-2"
          style={{
            letterSpacing: '0.5px',
            maxWidth: 'calc(100% - 300px)', // Prevent overlap with buttons
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          <div 
            className="search-section mb-4 p-1 bg-white rounded "
            style={{ display: window.innerWidth >= 1024 ? 'block' : 'none' }}
          >
            { property.name }
          </div>
        </h1>

        {/* Icons container on the right - with text next to icons */}
        <div
          className="d-flex align-items-center gap-3"
          style={{
            flexShrink: 0 // Prevent shrinking on small screens
          }}
        >
          {/* Share button with text inline */}
          <button
            className="btn btn-link p-0 text-decoration-none d-flex align-items-center"
            onClick={handleShareClick}
            style={{ color: '#000' }}
          >
            <FaShareSquare className="me-1" style={{ fontSize: '1.5rem' }} />
            <span className="small">Share</span>
          </button>

          {/* Saved/Wishlist button with text inline */}
          <button
            className="btn btn-link p-0 text-decoration-none d-flex align-items-center"
            onClick={handleWishlistClick}
            style={{ color: isWishlisted ? '#ff0000' : '#000' }}
          >
            <FaHeart className="me-1" style={{ fontSize: '1.5rem' }} />
            <span className="small">Saved</span>
          </button>

          {/* Instagram Button */}
          <button
            className="btn btn-link p-0 text-decoration-none d-flex align-items-center"
            onClick={openInstagram}
          >
            <FaInstagram className="me-1" style={{ fontSize: '1.5rem', color: '#E1306C' }} />
            <span className="small">Instagram</span>
          </button>
        </div>
      </div>
      {/* Image Grid Layout */}
      <div className="row g-2">
  <div className="col-12 col-lg-8">
    <img
      src={property.images?.[0]}
      alt="Property"
      className="img-fluid main-image"
      style={{ height: '418px', objectFit: 'cover', borderRadius: '10px' }}
    />
  </div>
  <div className="col-12 col-lg-4 d-flex flex-column">
    <img
      src={property.images?.[1]}
      alt="Property"
      className="img-fluid side-image mb-2"
      style={{ height: '250px', objectFit: 'cover', borderRadius: '10px' }}
    />
    <div className="d-flex position-relative">
      <img
        src={property.images?.[2]}
        alt="Property"
        className="img-fluid small-image me-2"
        style={{ height: '160px', objectFit: 'cover', borderRadius: '10px' }}
      />
      <div className="position-relative">
        <img
          src={property.images?.[3]}
          alt="Property"
          className="img-fluid small-image"
          style={{ height: '160px',width:'180px',objectFit: 'cover', borderRadius: '10px' }}
        />
        {property.images?.length > 4 && (
          <div
            className="more-overlay d-flex align-items-center justify-content-center"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '160px',
              width: '180px',
              backgroundColor: 'rgba(0, 0, 0, 0.4)',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              borderRadius: '10px',
            }}
            onClick={() => setShowAllImages(true)}
          >
            + More
          </div>
        )}
      </div>
    </div>
  </div>
</div>


      {/* Black Line */}
      <hr className="my-4 border-black" />

      {/* Property Details */}
      <div className="d-flex flex-column flex-lg-row">
        <div className="p-3 bg-light rounded flex-fill me-lg-0">
          {/* <button
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`,
                "_blank"
              );
            }}
            className="text-primary fs-5 fs-md-4 bi bi-geo-alt-fill border-0 bg-transparent p-0"
            style={{ cursor: "pointer" }}
          >
            Address
          </button> */}
          <div className="mb-4">
            {/* Details row */}
            
            <div className="d-flex justify-content-between align-items-start mb-4">
              {/* Left side - Property details */}
              <div>
                {/* Location - with thinner font */}
                <div 
                  className="search-section mb-5 p-9"
                  style={{ 
                    display: window.innerWidth < 576 ? 'block' : 'none',
                    fontWeight: 'bold',
                    // marginBottom: '1.5rem' ,
                    padding: window.innerWidth < 576 ? '0.1rem' : 'inherit', // Reduced mobile padding
                    fontSize: window.innerWidth < 576 ? '19px' : 'inherit' // Larger font on mobile

                  }}
                >
                  {property.name}
                </div>
                <div className="d-flex align-items-center" style={{ fontWeight: '700', color: '#000000' }}>
                  <i className="bi bi-geo-alt me-2"></i>
                  <span  onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`,
                "_blank"
              );
            }}
            className="text-primary fs-5 fs-md-4 border-0 bg-transparent p-0"

            >{property.city}, {property.address}</span>
                </div>

                {/* Capacity details - with thinner font */}
                <div className="d-flex flex-wrap align-items-center gap-4 mb-3" style={{ fontWeight: '700', color: '#000000' }}>
                <span>
                    <i className="bi bi-people me-1"></i>
                    {property.capacity?.adults} {property.capacity?.adults === 1 ? 'adult' : 'adults'}
                  </span>
                  <span>
                    <i className="bi bi-door-closed me-1"></i>
                    {property.capacity?.bedrooms} {property.capacity?.bedrooms === 1 ? 'bedroom' : 'sleeps'}
                  </span>

                 
                </div>
              </div>

              {/* Right side - Average rating */}
              {ratings.length > 0 && (
                <div className="text-end">
                  <div className="d-flex align-items-center justify-content-end mb-1">
                    {/* Calculate average rating */}
                    <span className="fw-bold me-2" style={{ fontSize: '1.2rem' }}>
                      {(
                        ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
                      ).toFixed(1)}
                    </span>
                    <div className="text-warning">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i
                          key={i}
                          className={`bi ${i < Math.floor(
                            ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
                          ) ? 'bi-star-fill' : 'bi-star'
                            }`}
                        ></i>
                      ))}
                    </div>
                  </div>
                  <div className="text-muted small">
                    ({ratings.length} {ratings.length === 1 ? 'review' : 'reviews'})
                  </div>
                </div>
              )}
            </div>
          </div>

          <WishlistModal
            show={showModal}
            onClose={() => setShowModal(false)}
            userId={userId}
            propertyId={id}
            onWishlistUpdate={handleWishlistUpdate}
          />

          <h5 className="mt-3 fs-5 fs-md-4"><i className="bi bi-list-check"></i> What this place offers</h5>
          <hr className="my-4 border-black" />
          <div className="row">
            {property.amenities?.map((amenity, index) => {
              const amenityIcons = {
                // Basic amenities
                "Kitchen": "bi bi-house-door",
                "WiFi": "bi bi-wifi",
                "Air conditioning": "bi bi-snow",
                "Heating": "bi bi-thermometer-sun",
                "Free washing machine": "bi bi-arrow-repeat",
                "Dryer": "bi bi-moisture",
                "HDTV with Netflix": "bi bi-tv",
                "Iron": "bi bi-iron",
                "Hair dryer": "bi bi-wind",
                "Dedicated workspace": "bi bi-laptop",
                // Outdoor amenities
                "Swimming Pool": "bi bi-water",
                "Hot tub": "bi bi-hot-tub",
                "Free parking on premises": "bi bi-p-circle",
                "Paid parking": "bi bi-p-circle-fill",
                "Gym": "bi bi-activity",
                "BBQ grill": "bi bi-fire",

                // Special amenities
                "box cricket": "bi bi-trophy",
                "barbeque setup": "bi bi-fire",
                "projector": "bi bi-projector",
                "jacuzzi": "bi bi-water",
                "camp fire": "bi bi-fire",

                // Rules
                "Smoking allowed": "bi bi-smoke",
                "Pets allowed": "bi bi-paw",

                // Services
                "Breakfast included": "bi bi-cup-hot",
                "Security cameras": "bi bi-camera-video",
                "Fire extinguisher": "bi bi-fire-extinguisher",
                "First aid kit": "bi bi-heart-pulse",
                "Hot water": "bi bi-droplet-fill",

                // Outdoor spaces
                "Private back garden – Fully fenced": "bi bi-tree",
                "Window AC unit": "bi bi-snow",
                "Patio or balcony": "bi bi-door-open",

                "bath tubs": "bi bi-water",          // Bath tub icon
                "lawn": "bi bi-tree",               // Lawn/garden icon
                "outdoor barbeque": "bi bi-fire"
              };

              const iconClass = amenityIcons[amenity] || "bi bi-check-circle";

              return (
                <div key={index} className="col-12 col-md-6 d-flex align-items-center mb-2">
                  <i className={`${iconClass} text-success me-2 fs-5`}></i>
                  <span className={`amenity-text ${amenity.includes("Not available") ? "text-decoration-line-through text-muted" : ""}`}>
                    {amenity}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Black Line */}
          <hr className="my-4 border-black" />

          {/* Dynamic Content Section */}
          <div className="row mt-4">
            <div className="col-12">
              <h4 className="text-primary mb-3 fs-5 fs-md-4">About {property.name}</h4>
              <Typography sx={{ whiteSpace: 'pre-line' }}>
                {property.description}</Typography>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-12">
              <div className="p-4 rounded" style={{
                backgroundColor: '#f8f9fa',
                borderLeft: '4px solid #0d6efd'
              }}>
                <h4 className="mb-4" style={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: '600',
                  color: '#212529',
                  fontSize: '1.5rem'
                }}>
                  <i className="bi bi-journal-text me-2"></i>
                  House Rules
                </h4>

                {/* <ul className="list-unstyled" style={{
                  fontFamily: "'Roboto', sans-serif",
                  fontSize: '1.05rem'
                }}>
                  <li className="mb-3 d-flex align-items-start">
                    <i className="bi bi-clock-history me-3 mt-1" style={{ color: '#0d6efd' }}></i>
                    <span>Check-in after <strong>12:00 pm</strong></span>
                  </li>
                  <li className="mb-3 d-flex align-items-start">
                    <i className="bi bi-clock me-3 mt-1" style={{ color: '#0d6efd' }}></i>
                    <span>Checkout before <strong>10:00 am</strong></span>
                  </li>
                  <li className="d-flex align-items-start">
                    <i className="bi bi-people me-3 mt-1" style={{ color: '#0d6efd' }}></i>
                    <span><strong>6 guests</strong> maximum</span>
                  </li>
                </ul> */}

                <div className="col-12">
                  {/* <h4 className="text-primary mb-3 fs-5 fs-md-4">About {property.name}</h4> */}
                  <Typography sx={{ whiteSpace: 'pre-line' }}>
                    {property.house_rules}</Typography>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* // Add this section before the LoadScript/GoogleMap component in your return statement */}
      <div className="ratings-section mt-5" ref={ratingsRef}>
        <h3 className="mb-4">Guest Reviews</h3>

        {ratings.length > 0 ? (
          <div className="row">
          {ratings.map((rating, index) => {
            const firstLetter = rating.username ? rating.username.charAt(0).toUpperCase() : 'U';
            const colors = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
              '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D'];
            const bgColor = colors[firstLetter.charCodeAt(0) % colors.length];
        
            return (
              <div key={index} className="col-12 col-sm-12 col-md-6 col-lg-4 mb-4">
                <div className="card h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                      <div
                        className="profile-circle d-flex align-items-center justify-content-center me-3"
                        style={{ backgroundColor: bgColor, width: 40, height: 40, borderRadius: '50%' }}
                      >
                        <span className="text-white fw-bold">{firstLetter}</span>
                      </div>
        
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5 className="card-title mb-0">{rating.username}</h5>
                          <div className="d-flex align-items-center">
                            <span className="badge bg-primary me-2">{rating.category}</span>
                            <span className="text-warning">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <i
                                  key={i}
                                  className={`bi ${i < Math.floor(rating.rating) ? 'bi-star-fill' : 'bi-star'} ${i === Math.floor(rating.rating) && rating.rating % 1 >= 0.5 ? 'bi-star-half' : ''}`}
                                ></i>
                              ))}
                            </span>
                            <span className="ms-2">{rating.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <div className="text-muted small">
                          {rating.month} {rating.year}
                        </div>
                      </div>
                    </div>
                    <p className="card-text">{rating.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        ) : (
          <p className="text-muted">No reviews yet. Be the first to review!</p>
        )}
      </div>
      <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={{ width: "100%", height: "400px" }}
          center={mapCenter}
          zoom={15}
        >
          <Marker
            position={mapCenter}
            onClick={() => {
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${mapCenter.lat},${mapCenter.lng}`,
                "_blank"
              );
            }}
          />
        </GoogleMap>
      </LoadScript>

      {/* Floating WhatsApp Button */}
      {showReservationBox && (
        <div
          ref={reservationBoxRef}
          className="reservation-box"
          style={{
            position: isFixed ? 'fixed' : 'absolute',
            bottom: isFixed ? (window.innerWidth <= 768 ? '15px' : '30px') : 'auto',
            right: isFixed ? (window.innerWidth <= 768 ? '15px' : '30px') : '0',
            top: calculateTopPosition(),
            width: window.innerWidth <= 768 ? '240px' : '320px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
            padding: window.innerWidth <= 768 ? '8px' : '16px',
            zIndex: '1000',
            transition: 'all 0.3s ease'
          }}
        >
          <div className="reservation-header d-flex justify-content-between align-items-center mb-3">
            <h5
              className="m-0 fw-bold"
              style={{ fontSize: window.innerWidth <= 768 ? '14px' : '18px' }}
            >
              Contact Host
            </h5>
            {/* <button
              className="close-btn bg-transparent border-0 p-0"
              onClick={() => setShowReservationBox(false)}
              style={{
                lineHeight: '1',
                fontSize: window.innerWidth <= 768 ? '14px' : '20px'
              }}
            >
              ×
            </button> */}
          </div>

          <div className="price-section mb-3">
            <span
              className="price fw-bold"
              style={{ fontSize: window.innerWidth <= 768 ? '16px' : '22px' }}
            >
              {property.minPrice && property.maxPrice
                ? `${property.minPrice} - ${property.maxPrice}`
                : 'Price Range Not Available'}
            </span>
            <span
              className="duration text-muted"
              style={{
                fontSize: window.innerWidth <= 768 ? '10px' : '14px',
                marginLeft: '8px'
              }}
            >
              for 5 nights
            </span>
          </div>


          <button
            className="whatsapp-reserve-btn w-100 py-2 border-0 rounded fw-bold text-white d-flex align-items-center justify-content-center"
            style={{
              backgroundColor: '#25D366',
              fontSize: window.innerWidth <= 768 ? '14px' : '16px'
            }}
            onClick={openWhatsAppChat}
          >
            <FaWhatsapp
              className="me-2"
              style={{ fontSize: window.innerWidth <= 768 ? '1.2rem' : '1.2rem' }}
            />
            WhatsApp Host
          </button>

          <div
            className="text-center small mt-2 text-muted"
            style={{ fontSize: window.innerWidth <= 768 ? '11px' : '12px' }}
          >
            Contact host directly for booking
          </div>
        </div>
      )}
      <Footer /> {/* Added Footer component */}
      {/* Scrollable Full Image Modal */}
      {showAllImages && (
        <div className="modal-overlay" onClick={() => setShowAllImages(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowAllImages(false)}>×</button>
            <h3 className="text-center">All Property Images</h3>
            <div className="image-scroll-container">
              {property.images.map((img, index) => (
                <img key={index} src={img} alt={`Property ${index}`} className="scroll-image" />
              ))}
            </div>
          </div>
        </div>

      )}

      <style>
        {` 
          .custom-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 15px; /* Default padding for mobile */
            margin-top: 40px;
          }

          @media (min-width: 992px) {
            .custom-container {
              padding:  70px; /* Larger padding for laptop/desktop */
              margin-top: -10px;
            }
            .ratings-section .card {
              // width: 700px; /* Adjust this value as needed */
              margin-left: 0;
              margin-right: auto;
            }
          }

          /* Make the property name stand out like in the screenshot */
          h1 {
            font-weight: 600;
            color: #333;
          }
          
          /* Style the icon buttons to match your screenshot */
          .btn-link {
            transition: all 0.2s ease;
          }
          
          .btn-link:hover {
            transform: scale(1.05);
          }
          
          /* Text below icons */
          .small {
            font-size: 0.75rem;
            font-weight: 500;
          }
                
          /* Make the property name take available space */
          .text-start {
            text-align: left;
            padding-right: 20px;
          }
          .main-image {
            width: 100%;
            height: 300px;
            object-fit: cover;
            border-radius: 10px;
          }

          .side-image {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
          }

          .small-image {
            width: 49%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
          }

          .more-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            font-size: 24px;
            font-weight: bold;
            border-radius: 10px;
            cursor: pointer;
          }

          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }

          .modal-content {
            background: white;
            padding: 20px;
            border-radius: 10px;
            width: 90%;
            max-width: 800px;
            text-align: center;
            position: relative;
          }

          .close-btn {
            position: absolute;
            top: 10px;
            right: 15px;
            font-size: 24px;
            border: none;
            background: none;
            cursor: pointer;
          }

          .image-scroll-container {
            display: flex;
            overflow-x: auto;
            gap: 10px;
            padding: 10px;
            white-space: nowrap;
            max-width: 100%;
          }

          .image-scroll-container::-webkit-scrollbar {
            height: 8px;
          }

          .image-scroll-container::-webkit-scrollbar-thumb {
            background: #aaa;
            border-radius: 5px;
          }

          .scroll-image {
            height: 150px;
            width: auto;
            border-radius: 5px;
          }

          .amenity-text {
            font-size: 16px;
            font-weight: 500;
          }

          .instagram-icon-container {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: radial-gradient(
              circle at 30% 107%, 
              #fdf497 0%, 
              #fdf497 5%, 
              #fd5949 45%, 
              #d6249f 60%, 
              #285AEB 90%
            );
            cursor: pointer;
            transition: transform 0.2s;
          }

          .instagram-icon-container:hover {
            transform: scale(1.1);
          }

          .instagram-icon {
            color: white;
            font-size: 1.5rem;
          }


          /* WhatsApp floating button styles */
          .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background-color: #25D366;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 100;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
          }

          .whatsapp-icon {
            font-size: 36px;
          }
          // Add this to your style section
          .ratings-section {
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 10px;
          }

          .card {
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .card:hover {
            transform: translateY(-5px);
          }

          .profile-circle {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            font-size: 1.2rem;
          }

          .bi-star-fill, .bi-star-half {
            color: #ffc107;
          }

          .bi-star {
            color: #e4e5e9;
          /* Add to your style section */
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Roboto&display=swap');

          .house-rules-card {
            background-color: #f8f9fa;
            border-left: 4px solid #0d6efd;
            border-radius: 8px;
            padding: 1.5rem;
          }

          .house-rules-title {
            font-family: 'Playfair Display', serif;
            font-weight: 600;
            color: #212529;
            font-size: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .house-rules-list {
            font-family: 'Roboto', sans-serif;
            font-size: 1.05rem;
          }

          .house-rules-list li {
            margin-bottom: 1rem;
            display: flex;
            align-items: flex-start;
          }

          .house-rules-icon {
            color: #0d6efd;
            margin-right: 1rem;
            margin-top: 0.2rem;
          }

          .hover-underline:hover {
            text-decoration: underline !important;

            }
          .reservation-box {
            max-width: 100%;
          }
          
          @media (max-width: 768px) {
            .reservation-box {
              width: 280px !important;
              right: 15px !important;
            }
          }
          
          .whatsapp-reserve-btn:hover {
            background-color: #128C7E !important;
          }
        `}
      </style>
    </div>
  );
};

export default PropertyDetails;
