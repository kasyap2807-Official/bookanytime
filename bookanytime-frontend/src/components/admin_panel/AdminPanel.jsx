import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "./AdminPanel.css"; // Add a separate CSS file for better responsiveness
import AddRatings from "./ratings/AddRatings"
import DeleteRatings from "./ratings/DeleteRatings"

const AdminPanel = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [selectedCategory, setSelectedCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAddRatingsOpen, setIsAddRatingsOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);


  useEffect(() => {
    const mainHeader = document.querySelector(".main-header");
    if (mainHeader) mainHeader.style.display = "none";
    return () => {
      if (mainHeader) mainHeader.style.display = "block";
    };
  }, []);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => {
    setShowAdd(false);
    setCategory("");
    setImage(null);
    setPreview(null);
  };

  const handleShowDelete = () => setShowDelete(true);
  const handleCloseDelete = () => {
    setShowDelete(false);
    setSelectedCategory("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleAddCategory = async () => {
    if (!category.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    const formData = new FormData();
    formData.append("name", category);
    if (image) {
      formData.append("image", image);
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/categories`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Category added successfully!");
      fetchCategories(); // Refresh category list
      handleCloseAdd();
    } catch (error) {
      console.error("Error adding category:", error);
      if (error.response && error.response.data && error.response.data.message) {
        if (error.response.data.message.includes("already exists")) {
          alert("Category name already exists. Please choose a different name.");
        } else {
          alert(`Failed to add category. ${error.response.data.message}`);
        }
      } else {
        alert("Failed to add category. Server error.");
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) {
      alert("Please select a category to delete!");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this category?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/categories/${selectedCategory}`);

      alert("Category deleted successfully!");
      fetchCategories(); // Refresh category list
      handleCloseDelete();
    } catch (error) {
      console.error("Error deleting category:", error);
      alert(`Failed to delete category. ${error.response?.data?.message || "Server error"}`);
    }
  };

  return (
    <div className="admin-container">
      <header className="admin-header">
        <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
        <h3>BookAnytime - Admin Panel</h3>
      </header>

      {/* Sidebar */}
      <nav className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/admin/properties" onClick={() => setSidebarOpen(false)}>Properties</Link></li>
          <li><Link to="/admin/offers" onClick={() => setSidebarOpen(false)}>Offers</Link></li>
          <li><Link to="/admin/trackData" onClick={() => setSidebarOpen(false)}>Tracked Data</Link></li>
          <li><Link to="/admin/list-property-logs" onClick={() => setSidebarOpen(false)}>List Your Property Logs</Link></li>
          <li><Link to="/admin/feedback-logs" onClick={() => setSidebarOpen(false)}>Feedback</Link></li>
        </ul>
        

        <Button variant="success" className="add-category-btn" onClick={handleShowAdd}>
          + Add Category
        </Button>
        <Button variant="danger" className="delete-category-btn mt-2" onClick={handleShowDelete}>
          🗑️ Delete Category
        </Button>

        <Button variant="success" className="add-rating-btn mt-2" onClick={() => setIsAddRatingsOpen(true)}>
        +  Add Ratings
        </Button>

        <Button variant="danger" className="delete-rating-btn mt-2" onClick={() => setDeleteModalOpen(true)}>
        🗑️ Delete Ratings
        </Button>
      </nav>

      {/* Page Content */}
      <div className="admin-content">
        <Outlet />
      </div>

      {/* AddRatings Modal */}
      {isAddRatingsOpen && <AddRatings open={isAddRatingsOpen} onClose={() => setIsAddRatingsOpen(false)} />}

      {/* deleteRatings Modal */}
      {isDeleteModalOpen && <DeleteRatings open={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} />}

      {/* Add Category Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="categoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="categoryImage" className="mt-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
            </Form.Group>
            {preview && (
              <div className="mt-3">
                <img src={preview} alt="Preview" className="preview-image" />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>Cancel</Button>
          <Button variant="primary" onClick={handleAddCategory}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Category Modal */}
      <Modal show={showDelete} onHide={handleCloseDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Delete Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="selectCategory">
              <Form.Label>Select Category to Delete</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDelete}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteCategory}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPanel;
