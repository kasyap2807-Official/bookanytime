import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";

const UpdateOfferModal = ({ show, handleClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [properties, setProperties] = useState([]);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState("");
  const [image, setImage] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // Store previous images
  const [newImages, setNewImages] = useState([]); // Store new images
  const [removeImages, setRemoveImages] = useState([]); // Store images to be removed

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

      // Fetch properties when category changes
      useEffect(() => {
        if (selectedCategory) {
          fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties?category=${encodeURIComponent(selectedCategory)}`)
            .then((res) => res.json())
            .then((data) => {
              if (Array.isArray(data)) {
                setProperties(data);
              } else {
                setProperties([]);
              }
            })
            .catch((error) => console.error("Error fetching properties:", error));
        } else {
          setProperties([]); // Reset properties if no category is selected
        }
      }, [selectedCategory]);
  
  const fetchOffers = (category) => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/offers/category/${category}`)
      .then((res) => setOffers(res.data))
      .catch((err) => console.error("Error fetching offers:", err));
  };

  const fetchOfferDetails = (offerId) => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/offers/${offerId}`)
      .then((res) => {
        console.log("data",res.data)
        setStartDate(res.data.startDate.split("T")[0]); // Formatting date
        setEndDate(res.data.endDate.split("T")[0]);
        setImage(res.data.image || []); 
        setExistingImages(res.data.image || [])
      })
      .catch((err) => console.error("Error fetching offer details:", err));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handlePropertySelection = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedProps = selectedOptions.map((option) => ({
      _id: option.value,
      name: option.text,
    }));
    setSelectedProperties(selectedProps);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedOffer) {
      alert("Please select an offer to update.");
      return;
    }

    const formData = new FormData();
    formData.append("properties", JSON.stringify(selectedProperties)); // Send selected properties
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    // Send selected images for removal
  if (removeImages.length > 0) {
    formData.append("removeImages", JSON.stringify(removeImages));
  }

  // Send newly added images
  newImages.forEach((image) => {
    formData.append("images", image);
  });
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/offers/update/${selectedOffer}`, formData);
      alert("Offer updated successfully!");
      setSelectedCategory("")
      setSelectedOffer("")
      setSelectedProperties([]); // Clear selected properties
      setNewImages([])
      setExistingImages([])
      setStartDate("")
      setEndDate("")
      handleClose();
    } catch (error) {
      console.error("Error updating offer:", error);
      alert("Failed to update offer.");
    }
  };
  const handleRemoveImage = (img) => {
    setRemoveImages([...removeImages, img]);
    setExistingImages(existingImages.filter((image) => image !== img));
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Offer</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleUpdate}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                fetchOffers(e.target.value);
              }}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
            <Form.Control as="select" multiple  onChange={handlePropertySelection}>
              <option value="">Select Property</option>
              {properties.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label>Select Offer</Form.Label>
            <Form.Control
              as="select"
              value={selectedOffer}
              onChange={(e) => {
                setSelectedOffer(e.target.value);
                fetchOfferDetails(e.target.value);
              }}
            >
              <option value="">Select Offer</option>
              {offers.map((offer) => (
                <option key={offer._id} value={offer._id}>
                  {offer.category} - {new Date(offer.startDate).toDateString()}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
{/* Update part */}
          <Form.Group>
          <Form.Group>
  {existingImages.length > 0 && (
    <div>
      <p>Existing Images:</p>
      {existingImages.map((img, index) => (
        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={`${import.meta.env.VITE_API_BASE_URL}${img}`} alt="Offer" style={{ width: "100px", height: "100px" }} />
          <Button
            variant="danger"
            size="sm"
            onClick={() => setRemoveImages([...removeImages, img])}
          >
            Remove
          </Button>
        </div>
      ))}
    </div>
  )}
</Form.Group>


<Form.Group>
  <Form.Label>Upload More Images</Form.Label>
  <Form.Control
    type="file"
    accept="image/*"
    multiple
    onChange={(e) => setNewImages([...newImages, ...Array.from(e.target.files)])}
  />
</Form.Group>
</Form.Group>


          <Form.Group>
            <Form.Label>Start Date</Form.Label>
            <Form.Control type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </Form.Group>

          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <Form.Control type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </Form.Group>

          <Button variant="primary" type="submit" className="mt-3">
            Update Offer
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UpdateOfferModal;
