import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  FloatingLabel,
  Form,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";

const AllProperties = () => {
  const [image, setImage] = useState(null);
  const [editingPropertyId, setEditingPropertyId] = useState(null);
  const [editingPropertyData, setEditingPropertyData] = useState({
    propertyType: "",
    propertyAdType: "",
    propertyAddress: "",
    ownerContact: "",
    propertyAmt: 0,
    additionalInfo: "",
  });
  const [allProperties, setAllProperties] = useState([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = (propertyId) => {
    const propertyToEdit = allProperties.find(
      (property) => property._id === propertyId
    );
    if (propertyToEdit) {
      setEditingPropertyId(propertyId);
      setEditingPropertyData(propertyToEdit);
      setShow(true);
    }
  };

  const getAllProperty = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/owner/getallproperties",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setAllProperties(response.data.data);
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingPropertyData({ ...editingPropertyData, [name]: value });
  };

  useEffect(() => {
    setEditingPropertyData((prevDetails) => ({
      ...prevDetails,
      propertyImage: image,
    }));
  }, [image]);

  const saveChanges = async (propertyId, status) => {
    try {
      const formData = new FormData();
      formData.append("propertyType", editingPropertyData.propertyType);
      formData.append("propertyAdType", editingPropertyData.propertyAdType);
      formData.append("propertyAddress", editingPropertyData.propertyAddress);
      formData.append("ownerContact", editingPropertyData.ownerContact);
      formData.append("propertyAmt", editingPropertyData.propertyAmt);
      formData.append("additionalInfo", editingPropertyData.additionalInfo);
      formData.append("propertyImage", image);
      formData.append("isAvailable", status);
      const res = await axios.patch(
        `http://localhost:8001/api/owner/updateproperty/${propertyId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        handleClose();
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to save changes");
    }
  };

  const handleDelete = async (propertyId) => {
    let assure = window.confirm("are you sure to delete");
    if (assure) {
      try {
        const response = await axios.delete(
          `http://localhost:8000/api/owner/deleteproperty/${propertyId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.data.success) {
          message.success(response.data.message);
          getAllProperty();
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleAvailabilityToggle = async (propertyId, currentStatus) => {
    try {
      const newStatus = currentStatus === "Available" ? "Unavailable" : "Available";
      const response = await axios.patch(
        `http://localhost:8000/api/owner/updateproperty/${propertyId}`,
        { isAvailable: newStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        message.success(`Property marked as ${newStatus}`);
        getAllProperty();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Failed to update property availability");
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table
          className="table-custom"
          sx={{ minWidth: 650 }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              <TableCell>Property ID</TableCell>
              <TableCell align="center">Property Type</TableCell>
              <TableCell align="center">Property Ad Type</TableCell>
              <TableCell align="center">Property Address</TableCell>
              <TableCell align="center">Owner Contact</TableCell>
              <TableCell align="center">Property Amt</TableCell>
              <TableCell align="center">Property Availability</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allProperties.map((property) => (
              <TableRow
                key={property._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {property._id}
                </TableCell>
                <TableCell align="center">{property.propertyType}</TableCell>
                <TableCell align="center">{property.propertyAdType}</TableCell>
                <TableCell align="center">{property.propertyAddress}</TableCell>
                <TableCell align="center">{property.ownerContact}</TableCell>
                <TableCell align="center">{property.propertyAmt}</TableCell>
                <TableCell align="center">
                  <span className={`status-badge ${property.isAvailable.toLowerCase()}`}>
                    {property.isAvailable}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <div className="action-buttons">
                    <Button
                      variant={property.isAvailable === "Available" ? "danger" : "success"}
                      onClick={() => handleAvailabilityToggle(property._id, property.isAvailable)}
                      className="me-2"
                    >
                      {property.isAvailable === "Available" ? "Mark Unavailable" : "Mark Available"}
                    </Button>
                    <Button
                      variant="outline-info"
                      onClick={() => handleShow(property._id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={() => handleDelete(property._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllProperties;
