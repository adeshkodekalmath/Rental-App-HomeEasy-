import { Table, Button, Space, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AllProperty = () => {
  const [properties, setProperties] = useState([]);

  const getAllProperties = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/getallproperties", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (propertyId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/admin/deleteproperty/${propertyId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        message.success("Property deleted successfully");
        getAllProperties();
      }
    } catch (error) {
      console.log(error);
      message.error("Error deleting property");
    }
  };

  useEffect(() => {
    getAllProperties();
  }, []);

  const columns = [
    {
      title: "Property ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Owner ID",
      dataIndex: "ownerId",
      key: "ownerId",
    },
    {
      title: "Property Type",
      dataIndex: "propertyType",
      key: "propertyType",
    },
    {
      title: "Ad Type",
      dataIndex: "propertyAdType",
      key: "propertyAdType",
    },
    {
      title: "Address",
      dataIndex: "propertyAddress",
      key: "propertyAddress",
    },
    {
      title: "Owner Contact",
      dataIndex: "ownerContact",
      key: "ownerContact",
    },
    {
      title: "Amount",
      dataIndex: "propertyAmt",
      key: "propertyAmt",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="primary"
            danger
            onClick={() => handleDelete(record._id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h1>All Properties</h1>
      <Table columns={columns} dataSource={properties} rowKey="_id" />
    </div>
  );
};

export default AllProperty;
