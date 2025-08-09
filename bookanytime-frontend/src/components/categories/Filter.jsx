import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Badge } from "react-bootstrap";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { FaBed, FaUser } from "react-icons/fa";

const DEFAULT_FILTERS = {
  bedrooms: undefined,
  adults: undefined,
  priceRange: undefined,
  amenities: undefined
};

const AMENITIES = [
  { name: "WiFi", icon: "📶" },
  { name: "Swimming Pool", icon: "🏊‍♂️" },
  { name: "Parking", icon: "🅿️" },
  { name: "Air Conditioning", icon: "❄️" },
  { name: "Gym", icon: "💪" },
  { name: "Pet Friendly", icon: "🐾" }
];

const Filter = ({
  showFilterModal,
  setShowFilterModal,
  filters,
  setFilters,
  applyFilters,
  clearFilters
}) => {
  const [isSliderMoving, setIsSliderMoving] = useState(false);
  const [priceInputs, setPriceInputs] = useState({
    min: filters.priceRange?.[0] || 0,
    max: filters.priceRange?.[1] || 100000
  });

  useEffect(() => {
    setPriceInputs({
      min: filters.priceRange?.[0] || 0,
      max: filters.priceRange?.[1] || 100000
    });
  }, [filters.priceRange]);

  const calculateActiveFilters = () => {
    let count = 0;
    if (filters.bedrooms !== undefined) count++;
    if (filters.adults !== undefined) count++;
    if (filters.priceRange !== undefined) count++;
    if (filters.amenities?.length) count += filters.amenities.length;
    return count;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value === "" ? undefined : parseInt(value, 10)
    }));
  };

  const handlePriceInputChange = (e) => {
    const { name, value } = e.target;
    const numValue = value === "" ? (name === "min" ? 0 : 100000) : parseInt(value, 10);
    
    setPriceInputs(prev => ({ ...prev, [name]: numValue }));

    if (!isNaN(numValue)) {
      const newRange = [
        name === "min" ? numValue : filters.priceRange?.[0] || 0,
        name === "max" ? numValue : filters.priceRange?.[1] || 100000
      ];
      
      setFilters(prev => ({
        ...prev,
        priceRange: newRange[0] === 0 && newRange[1] === 100000 ? undefined : newRange
      }));
    }
  };

  const handlePriceRangeChange = (value) => {
    setFilters(prev => ({
      ...prev,
      priceRange: value[0] === 0 && value[1] === 100000 ? undefined : value
    }));
  };

  const handleAmenityToggle = (amenityName) => {
    setFilters(prev => {
      const current = prev.amenities || [];
      const updated = current.includes(amenityName)
        ? current.filter(a => a !== amenityName)
        : [...current, amenityName];
      return { ...prev, amenities: updated.length ? updated : undefined };
    });
  };

  const handleClearFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setPriceInputs({ min: 0, max: 100000 });
    clearFilters();
  };

  const handleApplyFilters = () => {
    applyFilters(filters);
    setShowFilterModal(false);
  };

  return (
    <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          Filters
          {calculateActiveFilters() > 0 && (
            <Badge bg="danger" className="ms-2">
              {calculateActiveFilters()}
            </Badge>
          )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>Price Range</Form.Label>
            <div className="d-flex justify-content-between mb-2 gap-2">
              <Form.Control
                type="number"
                placeholder="Min"
                name="min"
                value={priceInputs.min}
                onChange={handlePriceInputChange}
                min={0}
                max={100000}
              />
              <span className="align-self-center">to</span>
              <Form.Control
                type="number"
                placeholder="Max"
                name="max"
                value={priceInputs.max}
                onChange={handlePriceInputChange}
                min={0}
                max={100000}
              />
            </div>
            <Slider
              range
              min={0}
              max={100000}
              value={filters.priceRange || [0, 100000]}
              onChange={handlePriceRangeChange}
              trackStyle={{
                backgroundColor: "#0d6efd",
                height: "8px"
              }}
              handleStyle={{
                borderColor: "#0d6efd",
                backgroundColor: "#fff",
                width: "20px",
                height: "20px"
              }}
              railStyle={{ backgroundColor: "#e9ecef", height: "8px" }}
            />
            {/* {filters.priceRange && (
              <Button
                variant="link"
                size="sm"
                className="p-0 mt-1"
                onClick={() => setFilters(prev => ({ ...prev, priceRange: undefined }))}
              >
                Remove price filter
              </Button>
            )} */}
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: "230px", marginRight: "20px" }}>
                <FaBed className="me-2" />
                Bedrooms
              </Form.Label>
              <Button
                variant="outline-secondary"
                onClick={() => setFilters(prev => ({
                  ...prev,
                  bedrooms: Math.max(0, (prev.bedrooms || 0) - 1)
                }))}
              >
                -
              </Button>
              <Form.Control
                type="number"
                placeholder="Any"
                name="bedrooms"
                value={filters.bedrooms || ""}
                onChange={handleFilterChange}
                className="mx-2 text-center"
                style={{ width: "80px" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setFilters(prev => ({
                  ...prev,
                  bedrooms: (prev.bedrooms || 0) + 1
                }))}
              >
                +
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="d-flex align-items-center">
              <Form.Label className="me-3" style={{ minWidth: "230px" }}>
                <FaUser className="me-2" />
                Adults
              </Form.Label>
              <Button
                variant="outline-secondary"
                onClick={() => setFilters(prev => ({
                  ...prev,
                  adults: Math.max(0, (prev.adults || 0) - 1)
                }))}
              >
                -
              </Button>
              <Form.Control
                type="number"
                placeholder="Any"
                name="adults"
                value={filters.adults || ""}
                onChange={handleFilterChange}
                className="mx-2 text-center"
                style={{ width: "80px" }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setFilters(prev => ({
                  ...prev,
                  adults: (prev.adults || 0) + 1
                }))}
              >
                +
              </Button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <div className="border-top pt-3">
              <h6 className="fw-bold mb-3">Amenities</h6>
              <div className="d-flex flex-wrap gap-2">
                {AMENITIES.map((amenity, index) => (
                  <Button
                    key={index}
                    variant={
                      filters.amenities?.includes(amenity.name) 
                        ? "primary" 
                        : "outline-secondary"
                    }
                    onClick={() => handleAmenityToggle(amenity.name)}
                    className="d-flex align-items-center gap-2"
                  >
                    <span>{amenity.icon}</span>
                    <span>{amenity.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-secondary" onClick={handleClearFilters}>
          Clear All
        </Button>
        <Button variant="primary" onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Filter;