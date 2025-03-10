import { Table, Tag, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/admin/getallbookings", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setBookings(response.data.data);
      } else {
        message.error("Failed to fetch bookings");
      }
    } catch (error) {
      console.log(error);
      message.error("Error fetching bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, []);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'warning';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "_id",
      key: "_id",
      width: 220,
    },
    {
      title: "Property ID",
      dataIndex: "propertyId",
      key: "propertyId",
      width: 220,
    },
    {
      title: "Property Address",
      dataIndex: "propertyAddress",
      key: "propertyAddress",
      ellipsis: true,
    },
    {
      title: "Owner Name",
      dataIndex: "ownerName",
      key: "ownerName",
    },
    {
      title: "Status",
      dataIndex: "bookingStatus",
      key: "bookingStatus",
      render: (status) => (
        <Tag color={getStatusColor(status)} style={{ minWidth: 80, textAlign: 'center' }}>
          {status}
        </Tag>
      ),
    },
  ];

  useEffect(() => {
    console.log("Bookings data:", bookings);
  }, [bookings]);

  return (
    <div>
      <h1>All Bookings</h1>
      <Table 
        columns={columns} 
        dataSource={bookings} 
        rowKey="_id"
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} bookings`
        }}
        loading={loading}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default AllBookings;
