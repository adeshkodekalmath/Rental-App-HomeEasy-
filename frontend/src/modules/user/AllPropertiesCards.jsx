import axios from "axios";
import React, { useEffect, useState } from "react";
import { message } from "antd";
import { Link } from "react-router-dom";

// Add styles for no properties message
const noPropertiesStyle = {
  textAlign: 'center',
  padding: '40px 20px',
  margin: '20px auto',
  maxWidth: '600px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};

const AllPropertiesCards = ({ loggedIn, searchQuery, filterPropertyType, filterPropertyAdType, filterPropertyAddress }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [allProperties, setAllProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [userDetails, setUserDetails] = useState({
    fullName: "",
    phone: 0,
  });

  // Set default values for filter props
  const safeFilterPropertyAddress = filterPropertyAddress || "";
  const safeFilterPropertyAdType = filterPropertyAdType || "";
  const safeFilterPropertyType = filterPropertyType || "";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProperty(null);
  };

  const handleShowModal = (property) => {
    setSelectedProperty(property);
    setShowModal(true);
    setCurrentImageIndex(0);
  };

  const getAllProperties = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/user/getAllProperties"
      );
      setAllProperties(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleBooking = async (status, propertyId, ownerId) => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/user/bookinghandle/${propertyId}`,
        { userDetails, status, ownerId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      
      if (response.data.success) {
        message.success(response.data.message);
        handleCloseModal();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("An error occurred while processing your request");
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const nextImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) =>
        prev === selectedProperty.propertyImage.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedProperty) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedProperty.propertyImage.length - 1 : prev - 1
      );
    }
  };

  const filteredProperties = allProperties
    .filter(
      (property) =>
        safeFilterPropertyAddress === "" ||
        property.propertyAddress.toLowerCase().includes(safeFilterPropertyAddress.toLowerCase())
    )
    .filter(
      (property) =>
        safeFilterPropertyAdType === "" ||
        property.propertyAdType.toLowerCase().includes(safeFilterPropertyAdType.toLowerCase())
    )
    .filter(
      (property) =>
        safeFilterPropertyType === "" ||
        property.propertyType.toLowerCase().includes(safeFilterPropertyType.toLowerCase())
    );

  return (
    <div className="properties-container">
      {filteredProperties.length === 0 ? (
        <div className="no-properties-message">
          <h3>No properties are currently available.</h3>
          <p>Please check back again later for new listings.</p>
        </div>
      ) : (
        <div className="properties-grid">
          {filteredProperties.map((property) => (
            <div key={property._id} className="property-card">
              <div className="property-image-container">
                <img
                  src={`http://localhost:8000${property.propertyImage[0].path}`}
                  alt="Property"
                  className="property-image"
                />
                <span className={`availability-badge ${property.isAvailable === "Available" ? "available" : "unavailable"}`}>
                  {property.isAvailable}
                </span>
              </div>
              <div className="property-details">
                <h3 className="property-location">{property.propertyAddress}</h3>
                <div className="property-info">
                  <span className="property-type">{property.propertyType}</span>
                  <span className="property-ad-type">{property.propertyAdType}</span>
                </div>
                {loggedIn && (
                  <div className="property-price">
                    <span>₹{property.propertyAmt}</span>
                  </div>
                )}
                {!loggedIn ? (
                  <Link to="/login" className="btn btn-primary">
                    Get Info
                  </Link>
                ) : (
                  property.isAvailable === "Available" && (
                    <button
                      className="btn btn-primary"
                      onClick={() => handleShowModal(property)}
                    >
                      View Details
                    </button>
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedProperty && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={handleCloseModal}>×</button>
            <h2>Property Details</h2>
            
            <div className="image-gallery">
              <img
                src={`http://localhost:8000${selectedProperty.propertyImage[currentImageIndex].path}`}
                alt={`Property ${currentImageIndex + 1}`}
                className="gallery-image"
              />
              {selectedProperty.propertyImage.length > 1 && (
                <div className="gallery-nav">
                  <button onClick={prevImage}>←</button>
                  <button onClick={nextImage}>→</button>
                </div>
              )}
            </div>

            <div className="property-details-grid">
              <div className="detail-item">
                <span className="label">Location:</span>
                <span className="value">{selectedProperty.propertyAddress}</span>
              </div>
              <div className="detail-item">
                <span className="label">Property Type:</span>
                <span className="value">{selectedProperty.propertyType}</span>
              </div>
              <div className="detail-item">
                <span className="label">Ad Type:</span>
                <span className="value">{selectedProperty.propertyAdType}</span>
              </div>
              <div className="detail-item">
                <span className="label">Owner Contact:</span>
                <span className="value">{selectedProperty.ownerContact}</span>
              </div>
              <div className="detail-item">
                <span className="label">Price:</span>
                <span className="value">₹{selectedProperty.propertyAmt}</span>
              </div>
            </div>

            <div className="booking-form">
              <h3>Interested? Contact Owner</h3>
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Your Full Name"
                  value={userDetails.fullName}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="Your Phone Number"
                  value={userDetails.phone}
                  onChange={handleChange}
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() =>
                  handleBooking(
                    "pending",
                    selectedProperty._id,
                    selectedProperty.ownerId
                  )
                }
              >
                Request Contact
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPropertiesCards;
