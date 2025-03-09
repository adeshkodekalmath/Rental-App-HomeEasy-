import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { UserContext } from "../../../App";
import AllPropertiesCards from "../AllPropertiesCards";
import AllProperty from "./AllProperties";

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
          <Typography>{children}</Typography>
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

const RenterHome = () => {
  const [value, setValue] = useState(0);
  const { userData } = useContext(UserContext);
  const [filterPropertyType, setPropertyType] = useState("");
  const [filterPropertyAdType, setPropertyAdType] = useState("");
  const [filterPropertyAddress, setPropertyAddress] = useState("");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className="dashboard-container">
      <Container>
        <h2 className="dashboard-title">Welcome, {userData?.name}</h2>
        
        {/* Advanced Search Section */}
        <section className="advanced-search">
          <div className="search-container">
            <div className="search-filters">
              <div className="filter-group">
                <select
                  className="form-control"
                  value={filterPropertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                >
                  <option value="">Property Type</option>
                  <option value="commercial">commercial</option>
                  <option value="residential">residential</option>
                  <option value="land/plot">land/plot</option>
                </select>
              </div>
              
              <div className="filter-group">
                <select
                  className="form-control"
                  value={filterPropertyAdType}
                  onChange={(e) => setPropertyAdType(e.target.value)}
                >
                  <option value="">Ad Type</option>
                  <option value="rent">rent</option>
                  <option value="sale">sale</option>
                </select>
              </div>
              
              <div className="filter-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by location..."
                  value={filterPropertyAddress}
                  onChange={(e) => setPropertyAddress(e.target.value)}
                />
              </div>
            </div>
          </div>
        </section>

        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="All Properties" {...a11yProps(0)} />
              <Tab label="My Properties" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <AllPropertiesCards
              loggedIn={true}
              searchQuery={filterPropertyAddress}
              filterPropertyType={filterPropertyType}
              filterPropertyAdType={filterPropertyAdType}
              filterPropertyAddress={filterPropertyAddress}
            />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <AllProperty />
          </CustomTabPanel>
        </Box>
      </Container>
    </div>
  );
};

export default RenterHome;
