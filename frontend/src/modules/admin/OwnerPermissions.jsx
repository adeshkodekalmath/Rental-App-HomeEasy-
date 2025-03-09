import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { message } from "antd";
import axios from "axios";

const OwnerPermissions = () => {
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    getOwners();
  }, []);

  const getOwners = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/admin/getallusers",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (response.data.success) {
        // Filter only owner users
        const ownerUsers = response.data.data.filter(user => user.type === "Owner");
        setOwners(ownerUsers);
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Error fetching owners");
    }
  };

  const handlePermission = async (userid, status) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/handlestatus",
        { userid, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        message.success(`Owner ${status === "granted" ? "granted" : "ungranted"} successfully`);
        getOwners();
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      message.error("Error updating permission");
    }
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="owner permissions table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {owners.map((owner) => (
            <TableRow key={owner._id}>
              <TableCell>{owner.name}</TableCell>
              <TableCell>{owner.email}</TableCell>
              <TableCell>
                <span style={{ 
                  color: owner.granted === "granted" ? "green" : "red",
                  fontWeight: "bold"
                }}>
                  {owner.granted === "granted" ? "Granted" : "Ungranted"}
                </span>
              </TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color={owner.granted === "granted" ? "error" : "success"}
                  onClick={() => handlePermission(
                    owner._id,
                    owner.granted === "granted" ? "ungranted" : "granted"
                  )}
                >
                  {owner.granted === "granted" ? "Ungrant" : "Grant"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {owners.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No owner registrations pending
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OwnerPermissions; 