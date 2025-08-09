import React, { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Spinner, Alert } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./CategoryList.css";

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isLaptopView, setIsLaptopView] = useState(false);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLaptopView(window.innerWidth >= 992); // 992px is Bootstrap's lg breakpoint
    };
    
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleNavigation = useCallback(
    (categoryName) => {
      navigate(`/${categoryName}`);
    },
    [navigate]
  );

  const checkScroll = useCallback(() => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftArrow(scrollLeft > 10);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  const handleScrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const handleScrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
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
    <>
<Container
  fluid
  className="p-3 text-center position-fixed"
  style={{
    top: "64px",
    zIndex: 999,
    background: "#fff",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  }}
>
        <div className={`categories-wrapper ${isLaptopView ? 'laptop-view' : ''}`} style={{marginTop:'20px' ,height:'120px'}}>
          <div className="position-relative categories-scroll-container" >
            {showLeftArrow && (
              <button className="scroll-arrow left" onClick={handleScrollLeft}>
                <ChevronLeft size={16} />
              </button>
            )}
            <div
              className="categories-container"
              ref={containerRef}
            >
              {loading ? (
                <Spinner animation="border" variant="primary" />
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <div
                    key={category._id}
                    className="category-wrapper"
                    onClick={() => handleNavigation(category.name)}
                  >
                    <div className="category-card">
                      {category.image ? (
                        <img
                          src={`${import.meta.env.VITE_API_BASE_URL}${category.image}`}
                          alt={category.name}
                          draggable="false"
                        />
                      ) : (
                        <div className="text-muted text-center">No Image</div>
                      )}
                    </div>
                    <h6 className="category-name fw-bold">{category.name}</h6>
                  </div>
                ))
              ) : (
                <p className="text-muted">No categories available</p>
              )}
            </div>
            {showRightArrow && (
              <button className="scroll-arrow right" onClick={handleScrollRight}>
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {isLaptopView && (
            <div className="decorative-side-panel">
              <div className="animated-circle"></div>
              <div className="animated-line"></div>
              <div className="floating-dots">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="dot" style={{
                    animationDelay: `${i * 0.2}s`,
                    top: `${10 + (i % 4) * 20}%`,
                    left: `${20 + (Math.floor(i / 4) * 60)}%`
                  }}></div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
      

    </>
  );
};

export default CategoriesList;