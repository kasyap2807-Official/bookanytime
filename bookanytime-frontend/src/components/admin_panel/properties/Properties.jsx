import { useState, useEffect } from "react";
import { Button, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Properties = () => {
  const navigate = useNavigate();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState({ category: "", propertyId: "" });
  const [updateData, setUpdateData] = useState({ category: "", propertyId: "" });
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);


  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`)
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  useEffect(() => {
    if (!deleteData.category && !updateData.category) return;

    const category = deleteData.category || updateData.category;
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties?category=${encodeURIComponent(category)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          console.log("delete data", data)
          setProperties(data);
        } else {
          setProperties([]);
        }
      })
      .catch((error) => console.error("Error fetching properties:", error));
  }, [deleteData.category, updateData.category]);

  const handleCategoryChange = (e, type) => {
    const category = e.target.value;
    if (type === "delete") {
      setDeleteData({ category, propertyId: "" });
    } else {
      setUpdateData({ category, propertyId: "" });
    }
  };

  const handlePropertyChange = (e, type) => {
    const propertyId = e.target.value;
    if (type === "delete") {
      setDeleteData((prev) => ({ ...prev, propertyId }));
    } else {
      setUpdateData((prev) => ({ ...prev, propertyId }));
    }
  };

  const handleDeleteSubmit = () => {
    if (!deleteData.propertyId) return alert("Please select a property to delete");

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/properties/${deleteData.propertyId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message);
        setDeleteModalOpen(false);
        setProperties(properties.filter((p) => p._id !== deleteData.propertyId));
      })
      .catch((error) => console.error("Error deleting property:", error));
  };

  const handleUpdateSubmit = () => {
    if (!updateData.propertyId) {
      alert("Please select a property to update");
      return;
    }

    const updatePath = `/admin/update-property/${updateData.propertyId}`;
    navigate(updatePath);
  };

  return (
    <div className="container mt-5 text-center">
      <h2 className="mb-4">Admin Panel - Properties</h2>
      <div className="d-flex justify-content-center gap-3">
        <Button variant="contained" color="primary" onClick={() => navigate("/admin/add-property")}>
          Add Property
        </Button>
        <Button variant="contained" color="secondary" onClick={() => setDeleteModalOpen(true)}>
          Delete Property
        </Button>
        <Button variant="contained" color="warning" onClick={() => setUpdateModalOpen(true)}>
          Update Property
        </Button>
        {/* <Button variant="outlined" color="default" onClick={() => navigate("/admin")}>
              Go Back
            </Button> */}
      </div>

      {/* Delete Property Modal */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <div className="position-absolute top-50 start-50 translate-middle bg-white p-4 rounded shadow" style={{ width: "350px" }}>
          <h5>Delete Property</h5>
          <select className="form-select my-2" onChange={(e) => handleCategoryChange(e, "delete")}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
                 <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
          </select>
          <select className="form-select my-2" onChange={(e) => handlePropertyChange(e, "delete")} disabled={!properties.length}>
            <option value="">Select Property</option>
            {properties.map((prop) => (
              <option key={prop._id} value={prop._id}>
                {prop.name} - {prop.address}
              </option>
            ))}
          </select>
          <div className="d-flex gap-2 mt-3">
            <Button variant="contained" color="error" className="w-50" onClick={handleDeleteSubmit} disabled={!deleteData.propertyId}>
              Confirm Delete
            </Button>
            <Button variant="contained" color="secondary" className="w-50" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Property Modal */}
      <Modal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)}>
        <div className="position-absolute top-50 start-50 translate-middle bg-white p-4 rounded shadow" style={{ width: "350px" }}>
          <h5>Update Property</h5>
          <select className="form-select my-2" onChange={(e) => handleCategoryChange(e, "update")}>
            <option value="">Select Category</option>
            {categories.map((cat) => (
                 <option key={cat._id} value={cat.name}>{cat.name}</option>
              ))}
          </select>
          <select className="form-select my-2" onChange={(e) => handlePropertyChange(e, "update")} disabled={!properties.length}>
            <option value="">Select Property</option>
            {properties.map((prop) => (
              <option key={prop._id} value={prop._id}>
                {prop.name} - {prop.address}
              </option>
            ))}
          </select>
          <div className="d-flex gap-2 mt-3">
            <Button variant="contained" color="primary" className="w-50" onClick={handleUpdateSubmit} disabled={!updateData.propertyId}>
              Proceed to Update
            </Button>
            <Button variant="contained" color="secondary" className="w-50" onClick={() => setUpdateModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Properties;
