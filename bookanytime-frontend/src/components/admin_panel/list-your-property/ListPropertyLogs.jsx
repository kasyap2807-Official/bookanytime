import React, { useEffect, useState } from "react";
import axios from "axios";

const ListYourPropertyLogs = () => {
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/list-property`
      );
      setProperties(response.data);
    } catch (err) {
      setError("Failed to fetch data");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">List Your Property Logs</h2>

      {error && <p className="text-danger text-center">{error}</p>}

      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>Sl.No</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Category</th>
              {/* <th>Date</th> */}
            </tr>
          </thead>
          <tbody>
            {properties.length > 0 ? (
              properties.map((property, index) => (
                <tr key={property._id}>
                  <td>{index + 1}</td>
                  <td>{property.name}</td>
                  <td>{property.phone}</td>
                  <td>{property.email}</td>
                  <td>{property.category}</td>
                  {/* <td>{new Date(property.createdAt).toLocaleString()}</td> */}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListYourPropertyLogs;
