import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Modal, Button, Form, Spinner, Alert, Image } from "react-bootstrap";
import heartImage from "../../assets/heartImage.jpg"

const WishlistModal = ({ show, onClose, userId, propertyId, onWishlistUpdate }) => {
  const [userWishlists, setUserWishlists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false); 
  const [wishlistName, setWishlistName] = useState(""); 

  const navigate = useNavigate();


  useEffect(() => {
    if (show) {
      if (!userId) {
        onClose(); // Close modal
        navigate("/login"); // Redirect to login
      } else {
        fetchWishlists();
      }
    }
  }, [show, userId, navigate]);
  
  const fetchWishlists = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${userId}`);
      const wishlists = Array.isArray(response.data) ? response.data : [];
      
      // Fetch last property details for each wishlist
      const updatedWishlists = await Promise.all(
        wishlists.map(async (wishlist) => {
          if (wishlist.properties.length > 0) {
            const lastPropertyId = wishlist.properties[wishlist.properties.length - 1];
            try {
              const propertyResponse = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${lastPropertyId}`);
              return { ...wishlist, lastPropertyImage: propertyResponse.data.images[0] };
            } catch (error) {
              console.error("Error fetching property image:", error);
              return { ...wishlist, lastPropertyImage: null };
            }
          }
          return { ...wishlist, lastPropertyImage: null };
        })
      );

      setUserWishlists(updatedWishlists);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      setError("Failed to load wishlists. Please try again.");
      setUserWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToWishlist = async (selectedWishlist) => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/add`, {
        userId,
        propertyId,
        wishlistName: selectedWishlist,
      });

      await fetchWishlists();
      onWishlistUpdate();
      onClose();
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      setError("Failed to add to wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWishlist = async () => {
    if (!wishlistName.trim()) return;

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/create`, {
        userId,
        wishlistName,
      });

      await fetchWishlists();
      handleSaveToWishlist(wishlistName); // Save to newly created wishlist
      setShowCreateModal(false); // Close small modal
      setWishlistName(""); // Reset input field
    } catch (error) {
      console.error("Error creating wishlist:", error);
      if (error.response && error.response.data && error.response.data.error) {
        if (error.response.data.error.includes("already exists")) {
          setError("Wishlist name already exists. Please choose a different name.");
        } else {
          setError(error.response.data.error);
        }
      } else {
        setError("Failed to create wishlist. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Main Wishlist Modal */}
      <Modal show={show} onHide={onClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Save to Wishlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          {loading ? (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Loading wishlists...</p>
            </div>
          ) : userWishlists.length > 0 ? (
            <>
      <h5>Select a Wishlist</h5>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: "15px",
          maxHeight: "300px",
          overflowY: "auto",
          padding: "10px",
          scrollbarWidth: "thin",
          scrollbarColor: "#ccc transparent",
        }}
        className="wishlist-container"
      >
        {userWishlists.map((wishlist) => (
          <div
            key={wishlist._id}
            onClick={() => handleSaveToWishlist(wishlist.name)}
            style={{
              textAlign: "center",
              cursor: "pointer",
              minWidth: "150px",
            }}
          >
            <Image
              src={wishlist.lastPropertyImage || heartImage} // Show last property image or default heart.jpg
              alt={wishlist.name}
              thumbnail
              style={{
                width: "100%",
                height: "120px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
            <p
              style={{
                marginTop: "8px",
                fontSize: "14px",
                fontWeight: "bold",
              }}
            >
              {wishlist.name}
            </p>
          </div>
        ))}
      </div>
    </>
  ) : (
    <p>No wishlists found.</p>
  )}


          {/* Create New Wishlist Button */}
          <Button
            variant="success"
            className="mt-3"
            onClick={() => setShowCreateModal(true)}
          >
            + Create New Wishlist
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Small Create Wishlist Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Wishlist</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Wishlist Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter wishlist name"
              value={wishlistName}
              onChange={(e) => setWishlistName(e.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateWishlist}
            disabled={!wishlistName.trim() || loading}
          >
            {loading ? <Spinner size="sm" animation="border" /> : "Create & Save"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default WishlistModal;
