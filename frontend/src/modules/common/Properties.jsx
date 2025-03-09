import React, { useState } from 'react';
import AllPropertiesCards from '../user/AllPropertiesCards';

const Properties = () => {
  const [filterPropertyType, setPropertyType] = useState("");
  const [filterPropertyAdType, setPropertyAdType] = useState("");
  const [filterPropertyAddress, setPropertyAddress] = useState("");

  return (
    <div className="properties-page">
      {/* Advanced Search Section */}
      <div className="advanced-search">
        <div className="search-container">
          <h2>Find Your Perfect Property</h2>
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
                placeholder="Location"
                value={filterPropertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Properties Grid Section */}
      <div className="properties-container">
        <AllPropertiesCards
          filterPropertyType={filterPropertyType}
          filterPropertyAdType={filterPropertyAdType}
          filterPropertyAddress={filterPropertyAddress}
        />
      </div>
    </div>
  );
};

export default Properties; 