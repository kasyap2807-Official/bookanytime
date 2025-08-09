import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import "./TrackedData.css";

const TrackedData = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProperty, setSelectedProperty] = useState("");

  // Check screen size
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const itemsPerPage = isMobile ? 5 : 15; // Mobile: 5, Laptop: 15

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

  // Fetch contacts on component mount and when selected property changes
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/trackdata/contacts`);
      setContacts(response.data.contacts || []);
      setFilteredContacts(response.data.contacts || []); // Initially display all contacts
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedProperty(""); // Reset property when category changes
  };

  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
  };

  // Filter contacts based on selected property
  useEffect(() => {
    if (selectedProperty) {
      const filtered = contacts.filter(
        (contact) => contact.propertyId === selectedProperty
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts); // Show all contacts if no property is selected
    }
    setCurrentPage(1); // Reset to first page when filter changes
  }, [selectedProperty, contacts]);

  // **Pagination Logic on Frontend**
  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentContacts = filteredContacts.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container mt-4">
      <h2 className="text-center">Tracked Contacts</h2>

      {/* Category dropdown */}
      <select className="form-select my-2" onChange={handleCategoryChange} value={selectedCategory}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat.name}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Property dropdown, which updates based on category selection */}
      <select
        className="form-select my-2"
        onChange={handlePropertyChange}
        value={selectedProperty}
        disabled={!properties.length}
      >
        <option value="">Select Property</option>
        {properties.map((prop) => (
          <option key={prop._id} value={prop._id}>
            {prop.name} - {prop.address}
          </option>
        ))}
      </select>

      {/* Table displaying the filtered contacts */}
      <div className="table-responsive">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Sl.No</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Property Name</th>
              <th>Address</th>
              <th>Contact Date</th>
            </tr>
          </thead>
          <tbody>
            {currentContacts.map((contact, index) => (
              <tr key={contact._id}>
                <td>{indexOfFirstItem + index + 1}</td>
                <td>{contact.userName}</td>
                <td>{contact.userEmail}</td>
                <td>{contact.userPhoneNumber}</td>
                <td>{contact.propertyName}</td>
                <td>{contact.propertyAddress}</td>
                <td>{new Date(contact.contactDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.Prev
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      )}
    </div>
  );
};

export default TrackedData;
