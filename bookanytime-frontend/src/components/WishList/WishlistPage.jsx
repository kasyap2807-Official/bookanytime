import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image, Spinner, Alert, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import heartImage from "../../assets/heartImage.jpg"; // Default image for empty wishlists
import "./WishlistPage.css";

const WishlistPage = () => {
  const [wishlists, setWishlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedWishlist, setSelectedWishlist] = useState(null);
  const navigate = useNavigate();

  // Fetch user ID from localStorage
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!userId) {
      navigate("/login"); // Redirect to login if user is not authenticated
      return;
    }
    fetchWishlists();
  }, [userId, navigate]);

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

      setWishlists(updatedWishlists);
    } catch (error) {
      console.error("Error fetching wishlists:", error);
      setError("Failed to load wishlists. Please try again.");
      setWishlists([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (wishlist) => {
    setSelectedWishlist(wishlist);
    setShowModal(true);
  };

  const deleteWishlist = async () => {
    if (!selectedWishlist) return;

    try {
      console.log("Deleting wishlist ID:", selectedWishlist._id);

      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/wishlist/${selectedWishlist._id}`);
      setWishlists(wishlists.filter(w => w._id !== selectedWishlist._id));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting wishlist:", error);
      setError("Failed to delete wishlist. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" />
        <p>Loading wishlists...</p>
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

  return (
    <div className="wishlist-container">
      <h2 className="wishlist-heading">My Wishlists</h2>

      {wishlists.length > 0 ? (
        <div className="wishlist-grid">
          {wishlists.map((wishlist) => (
            <div key={wishlist._id} className="wishlist-card">
              {/* Delete Button (X) on hover */}
              {wishlist.name !== "Favourites" && (
              <div className="delete-button" onClick={() => handleDeleteClick(wishlist)}>✖</div>
              )}

              <Image
                src={wishlist.lastPropertyImage || heartImage}
                alt={wishlist.name}
                thumbnail
                className="wishlist-image"
                onClick={() => navigate(`/wishlist/${wishlist._id}`)}
              />
              <h5 className="wishlist-name">{wishlist.name}</h5>
              <p className="wishlist-count">{wishlist.properties.length} Saved</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-wishlists">No wishlists found.</p>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Body>
          <h5>Delete this wishlist?</h5>
          <p>“{selectedWishlist?.name}” will be permanently deleted.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteWishlist}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};



export default WishlistPage;
