import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { UserContext } from "../../App";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import OwnerPermissions from "./OwnerPermissions";
import AllUsers from "./AllUsers";
import AllProperty from "./AllProperty";
import AllBookings from "./AllBookings";
import axios from "axios";
import { message } from "antd";
import { Paper, Button } from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HomeIcon from '@mui/icons-material/Home';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import RefreshIcon from '@mui/icons-material/Refresh';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const StatCard = ({ title, value, icon, color }) => (
  <Paper 
    elevation={3} 
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px',
      backgroundColor: color.bg,
      borderRadius: '10px',
      transition: 'transform 0.3s ease',
      width: '280px',
      height: '280px',
      '&:hover': {
        transform: 'translateY(-5px)'
      }
    }}
  >
    <div
      style={{
        backgroundColor: color.iconBg,
        borderRadius: '50%',
        padding: '20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {icon}
    </div>
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ color: color.text, marginBottom: '15px' }}>
        {title}
      </Typography>
      <Typography variant="h3" sx={{ color: color.value, fontWeight: 'bold' }}>
        {value}
      </Typography>
    </div>
  </Paper>
);

const AdminHome = () => {
  const user = React.useContext(UserContext);
  const [value, setValue] = useState(0);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
  });

  const getStats = async () => {
    try {
      const [usersRes, propertiesRes, bookingsRes] = await Promise.all([
        axios.get("http://localhost:8000/api/admin/getallusers", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        axios.get("http://localhost:8000/api/admin/getallproperties", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        axios.get("http://localhost:8000/api/admin/getallbookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
      ]);

      if (usersRes.data.success && propertiesRes.data.success && bookingsRes.data.success) {
        const nonAdminUsers = usersRes.data.data.filter(user => user.type !== "Admin");
        setStats({
          totalUsers: nonAdminUsers.length,
          totalProperties: propertiesRes.data.data.length,
          totalBookings: bookingsRes.data.data.length
        });
      }
    } catch (error) {
      console.log(error);
      message.error("Error fetching statistics");
    }
  };

  useEffect(() => {
    getStats();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleRefresh = () => {
    getStats();
    message.success("Dashboard refreshed!");
  };

  if (!user) {
    return null;
  }

  const cardColors = {
    users: {
      bg: '#f3f8ff',
      iconBg: '#e3f2fd',
      text: '#1976d2',
      value: '#0d47a1'
    },
    properties: {
      bg: '#f6fff7',
      iconBg: '#e8f5e9',
      text: '#2e7d32',
      value: '#1b5e20'
    },
    bookings: {
      bg: '#fff8f3',
      iconBg: '#fff3e0',
      text: '#f57c00',
      value: '#e65100'
    }
  };

  return (
    <div className="dashboard-container">
      <Container className="mt-4">
        <h1 className="dashboard-title" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          Admin Dashboard
        </h1>
        
        {/* Statistics Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            justifyContent: 'center',
            gap: '40px',
            marginBottom: '1rem'
          }}
        >
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<PeopleAltIcon sx={{ fontSize: 50, color: cardColors.users.text }} />}
            color={cardColors.users}
          />
          <StatCard
            title="Total Properties"
            value={stats.totalProperties}
            icon={<HomeIcon sx={{ fontSize: 50, color: cardColors.properties.text }} />}
            color={cardColors.properties}
          />
          <StatCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={<BookOnlineIcon sx={{ fontSize: 50, color: cardColors.bookings.text }} />}
            color={cardColors.bookings}
          />
        </Box>

        {/* Refresh Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            sx={{
              backgroundColor: '#2563eb',
              '&:hover': {
                backgroundColor: '#1d4ed8'
              }
            }}
          >
            Refresh Dashboard
          </Button>
        </Box>

        <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="admin dashboard tabs"
              centered
              sx={{ 
                '& .MuiTabs-indicator': { 
                  backgroundColor: '#2563eb',
                },
              }}
            >
              <Tab label="Owner Permissions" {...a11yProps(0)} />
              <Tab label="All Users" {...a11yProps(1)} />
              <Tab label="All Properties" {...a11yProps(2)} />
              <Tab label="All Bookings" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <OwnerPermissions />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <AllUsers />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <AllProperty />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={3}>
            <AllBookings />
          </CustomTabPanel>
        </Box>
      </Container>
    </div>
  );
};

export default AdminHome;
