import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import AddOfferModal from "./AddOffersModal";
import DeleteOfferModal from "./DeleteOffersModal";
import UpdateOfferModal from "./UpdateOfferModal";

const OffersPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <Container className="mt-4">
      {/* Top Back Button to Admin Page */}
      {/* <Button variant="secondary" className="mb-3" onClick={() => navigate("/admin")}>
        ← Back to Admin Page
      </Button> */}

      <h2>Manage Offers</h2>
      <div className="d-flex gap-3">
        <Button variant="primary" onClick={() => setShowAddModal(true)}>Add Offer</Button>
        <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete Offer</Button>
        <Button variant="warning" onClick={() => setShowUpdateModal(true)}>Update Offer</Button>
      </div>

      {/* Add Offer Modal */}
      <AddOfferModal show={showAddModal} handleClose={() => setShowAddModal(false)} />

      {/* Delete Offer Modal */}
      <DeleteOfferModal show={showDeleteModal} handleClose={() => setShowDeleteModal(false)} />


      {/* Update Offer Modal */}
      <UpdateOfferModal show={showUpdateModal} handleClose={() => setShowUpdateModal(false)} />

    </Container>
  );
};

export default OffersPage;
