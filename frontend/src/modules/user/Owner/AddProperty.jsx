import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  FloatingLabel,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";

function AddProperty() {
  const [image, setImage] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState({
    propertyType: "residential",
    propertyAdType: "rent",
    propertyAddress: "",
    ownerContact: "",
    propertyAmt: 0,
    additionalInfo: "",
  });

  const handleImageChange = (e) => {
    const files = e.target.files;
    setImage(files);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPropertyDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  useEffect(() => {
    setPropertyDetails((prevDetails) => ({
      ...prevDetails,
      propertyImages: image,
    }));
  }, [image]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("propertyType", propertyDetails.propertyType);
    formData.append("propertyAdType", propertyDetails.propertyAdType);
    formData.append("propertyAddress", propertyDetails.propertyAddress);
    formData.append("ownerContact", propertyDetails.ownerContact);
    formData.append("propertyAmt", propertyDetails.propertyAmt);
    formData.append("additionalInfo", propertyDetails.additionalInfo);

    if (image) {
      for (let i = 0; i < image.length; i++) {
        formData.append("propertyImages", image[i]);
      }
    }

    axios
      .post("http://localhost:8000/api/owner/postproperty", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          message.success(res.data.message);
        } else {
          message.error(res.data.message);
        }
      })
      .catch((error) => {
        console.error("Error adding property:", error);
      });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="add-property-form">
        <h2 className="text-center mb-4">Add New Property</h2>
        <Row className="mb-4">
          <Form.Group as={Col} md="4" className="mb-3 mb-md-0">
            <Form.Label>Property Type</Form.Label>
            <Form.Select
              name="propertyType"
              value={propertyDetails.propertyType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="choose.." disabled>Choose Property Type</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="land/plot">Land/Plot</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md="4" className="mb-3 mb-md-0">
            <Form.Label>Property Ad Type</Form.Label>
            <Form.Select
              name="propertyAdType"
              value={propertyDetails.propertyAdType}
              onChange={handleChange}
              className="form-select"
            >
              <option value="choose.." disabled>Choose Ad Type</option>
              <option value="rent">Rent</option>
              <option value="sale">Sale</option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Property Full Address</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter complete address"
              required
              name="propertyAddress"
              value={propertyDetails.propertyAddress}
              onChange={handleChange}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="4" className="mb-3 mb-md-0">
            <Form.Label>Property Images</Form.Label>
            <Form.Control
              type="file"
              required
              name="propertyImages"
              onChange={handleImageChange}
              multiple
              className="form-control"
            />
            <small className="text-muted">Select multiple images if needed</small>
          </Form.Group>
          <Form.Group as={Col} md="4" className="mb-3 mb-md-0">
            <Form.Label>Owner Contact Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter contact number"
              required
              name="ownerContact"
              value={propertyDetails.ownerContact}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Property Amount (₹)</Form.Label>
            <InputGroup>
              <InputGroup.Text>₹</InputGroup.Text>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                required
                name="propertyAmt"
                value={propertyDetails.propertyAmt}
                onChange={handleChange}
              />
            </InputGroup>
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="12">
            <Form.Label>Additional Details</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="additionalInfo"
              value={propertyDetails.additionalInfo}
              onChange={handleChange}
              placeholder="Describe your property (size, amenities, features, etc.)"
            />
          </Form.Group>
        </Row>
        <div className="d-flex justify-content-center">
          <Button type="submit" className="btn btn-primary px-5">
            Submit Property
          </Button>
        </div>
      </Form>
    </Container>
  );
}

export default AddProperty;
