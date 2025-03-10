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
import { Button, Modal, Dropdown } from "react-bootstrap";

const AllProperty = () => {
  const [allBookings, setAllBookings] = useState([]);
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState(null);

  const getAllProperty = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/owner/getallbookings",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (response.data.success) {
        setAllBookings(response.data.data);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllProperty();
  }, []);

  const handleStatus = async (bookingId, propertyId, status) => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/owner/handlebookingstatus",
        { bookingId, propertyId, status },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        getAllProperty();
      } else {
        message.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleContactTenant = (tenant) => {
    setSelectedTenant(tenant);
    setShowTenantModal(true);
  };

  const handleCloseModal = () => {
    setShowTenantModal(false);
    setSelectedTenant(null);
  };

  const getStatusButton = (booking) => {
    const currentStatus = booking.bookingStatus.toLowerCase();
    let nextStatus = 'pending';
    let buttonVariant = 'warning';

    // Determine next status and button color based on current status
    switch (currentStatus) {
      case 'pending':
        nextStatus = 'approved';
        buttonVariant = 'warning';
        break;
      case 'approved':
        nextStatus = 'rejected';
        buttonVariant = 'success';
        break;
      case 'rejected':
        nextStatus = 'pending';
        buttonVariant = 'danger';
        break;
      default:
        nextStatus = 'pending';
        buttonVariant = 'warning';
    }

    return (
      <Button
        variant={buttonVariant}
        size="sm"
        onClick={() => handleStatus(booking._id, booking.propertyId, nextStatus)}
        className={`status-toggle-button status-${currentStatus}`}
      >
        {booking.bookingStatus}
      </Button>
    );
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
              <TableCell>Booking ID</TableCell>
              <TableCell align="center">Property ID</TableCell>
              <TableCell align="center">Tenant Name</TableCell>
              <TableCell align="center">Tenant Phone</TableCell>
              <TableCell align="center">Booking Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allBookings.map((booking) => (
              <TableRow
                key={booking._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {booking._id}
                </TableCell>
                <TableCell align="center">{booking.propertyId}</TableCell>
                <TableCell align="center">{booking.userName}</TableCell>
                <TableCell align="center">{booking.phone}</TableCell>
                <TableCell align="center">
                  {getStatusButton(booking)}
                </TableCell>
                <TableCell align="center">
                  <Button
                    onClick={() => handleContactTenant(booking)}
                    variant="primary"
                    size="sm"
                  >
                    Contact Tenant
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Tenant Info Modal */}
      <Modal 
        show={showTenantModal} 
        onHide={handleCloseModal}
        centered
        backdrop="static"
        keyboard={false}
        className="tenant-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Tenant Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTenant && (
            <div className="tenant-info">
              <div className="info-item">
                <strong>Name:</strong>
                <span className="text-truncate">{selectedTenant.userName}</span>
              </div>
              <div className="info-item">
                <strong>Phone:</strong>
                <span className="text-truncate">{selectedTenant.phone}</span>
              </div>
              <div className="info-item">
                <strong>Booking ID:</strong>
                <span className="text-truncate">{selectedTenant._id}</span>
              </div>
              <div className="info-item">
                <strong>Property ID:</strong>
                <span className="text-truncate">{selectedTenant.propertyId}</span>
              </div>
              <div className="info-item">
                <strong>Status:</strong>
                <span className={`status-badge ${selectedTenant.bookingStatus.toLowerCase()}`}>
                  {selectedTenant.bookingStatus}
                </span>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllProperty;
