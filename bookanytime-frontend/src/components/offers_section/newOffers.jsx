import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import "../recently_viewed/RecentlyViewed.css";
import "./newOffers.css"
const RecentlyViewed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [offers, setOffers] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [categories, setCategories] = useState([]);
  
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((response) => setCategories([{ _id: "all", name: "All" }, ...response.data]))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/offers`);
      setOffers(response.data);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }finally {
        setLoading(false);
      }
  };

  const handleCategoryChange = (category) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes("All")
          ? [category]
          : prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }
  };

  const filteredOffers = offers.filter(
    (offer) => selectedCategories.includes("All") || selectedCategories.includes(offer.category)
  );

  const checkScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const handleScrollLeft = () => {
    containerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };
  
  const handleScrollRight = () => {
    containerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };
  

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      checkScroll();
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      }
    };
  }, [checkScroll]);

  return (
    <Container fluid className="offer-container">
      <div className="offers-header d-flex align-items-center justify-content-between mb-3 flex-wrap">
        <h2 className="me-3 mb-2">Offers</h2>
  
        <div className="d-flex overflow-auto category-tabs mb-3 ">
    {categories.map((cat) => (
      <button
        key={cat._id}
        className={`category-tab btn fw-bold ${selectedCategories.includes(cat.name) ? "btn-link-active" : "btn-link-inactive"}`}
        onClick={() => handleCategoryChange(cat.name)}
      >
        {cat.name}
      </button>
    ))}
  </div>
  
  {/* <div className="arrow-controls d-flex align-items-center ms-3 mb-2">
  <span className="view-all-text me-3">View All</span>

  <button className="scroll-arrow btn btn-light me-2" onClick={handleScrollLeft}>
    <ChevronLeft size={20} />
  </button>

  <button className="scroll-arrow btn btn-light" onClick={handleScrollRight}>
    <ChevronRight size={20} />
  </button>
</div> */}

      </div>
  
      <div className="offers-scroll-wrapper position-relative">
  <div className="offers-grid" ref={containerRef}>
    {loading ? (
      <Spinner animation="border" variant="primary" />
    ) : error ? (
      <Alert variant="danger">{error}</Alert>
    ) : filteredOffers.length > 0 ? (
      filteredOffers.map((offer, index) => (
        <div key={index} className="offer-card-wrapper">
        <div className="offer-viewed-card d-flex">
          {/* Image */}
          <div
            className="property-image-container me-3"
            onClick={() => navigate(`/offers/${offer._id}`)}
          >
            <img
              src={`${import.meta.env.VITE_API_BASE_URL}${offer.image[0]}`}
              alt={offer.name}
              className="property-image"
              draggable="false"
            />
          </div>
      
          {/* Text Details */}
          {/* <div className="property-details position-relative d-flex flex-column justify-content-start" style={{ minHeight: '100px', backgroundColor:"transparent" }}>
  <h6 className="property-name mb-1 mt-1">{offer.name}</h6>
  <h6 className="font-bold text-primary mb-1">{offer.category}</h6>
  <p className="text-muted mb-0">
    Valid: {new Date(offer.startDate).toLocaleDateString("en-GB")} -{" "}
    {new Date(offer.endDate).toLocaleDateString("en-GB")}
  </p>

  <h6
    onClick={() => navigate(`/offers/${offer._id}`)}
    style={{
      color: "#008cff",
      position: "absolute",
      bottom: 0,
      right: 0,
      margin: "10px",
      cursor: "pointer",
    }}
  >
    Book Now
  </h6>
</div> */}

        </div>
      </div>
      
      ))
    ) : (
      <p className="no-categories-message">No Offers available</p>
    )}
  </div>
</div>

    </Container>
  );
  
};

export default RecentlyViewed;
