import { Table, Button, Space } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  const getAllUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/admin/getallusers", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatus = async (userId, status) => {
    try {
      const response = await axios.post(
        "http://localhost:8000/api/admin/handlestatus",
        { userid: userId, status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        getAllUsers();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        record.type === "Owner" && (
          <Space size="middle">
            <Button
              type="primary"
              danger={record.granted === "granted"}
              onClick={() => handleStatus(record._id, record.granted === "granted" ? "ungranted" : "granted")}
            >
              {record.granted === "granted" ? "Ungrant" : "Grant"}
            </Button>
          </Space>
        )
      ),
    },
  ];

  return (
    <div>
      <h1>All Users</h1>
      <Table columns={columns} dataSource={users} rowKey="_id" />
    </div>
  );
};

export default AllUsers;
