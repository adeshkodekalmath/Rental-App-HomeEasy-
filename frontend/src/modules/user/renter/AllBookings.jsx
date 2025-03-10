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

const AllBookings = () => {
  const [allBookings, setAllBookings] = useState([]);

  const getAllBookings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/getallbookings",
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
    getAllBookings();
  }, []);

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
              <TableCell align="center">Property Address</TableCell>
              <TableCell align="center">Owner Name</TableCell>
              <TableCell align="center">Owner Phone</TableCell>
              <TableCell align="center">Booking Status</TableCell>
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
                <TableCell align="center">{booking.propertyAddress}</TableCell>
                <TableCell align="center">{booking.ownerName}</TableCell>
                <TableCell align="center">{booking.ownerPhone}</TableCell>
                <TableCell align="center">
                  <span className={`status-badge ${booking.bookingStatus.toLowerCase()}`}>
                    {booking.bookingStatus}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AllBookings; 