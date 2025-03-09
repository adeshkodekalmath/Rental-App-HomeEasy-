import React, { useState } from "react";
import { Link } from "react-router-dom";
import AllPropertiesCards from "../user/AllPropertiesCards";
import heroImage from "../../images/p1.jpg";

const Home = () => {
  const [filterPropertyType, setPropertyType] = useState("");
  const [filterPropertyAdType, setPropertyAdType] = useState("");
  const [filterPropertyAddress, setPropertyAddress] = useState("");

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" style={heroStyle}>
        <div className="hero-content">
          <h1>Find Your Perfect Home</h1>
          <p>Discover thousands of rental properties in your desired location</p>
          
          <div className="hero-cta">
            <p>Are you a property owner?</p>
            <Link to="/register" className="btn btn-secondary">
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      {/* Advanced Search Section */}
      <section className="advanced-search">
        <div className="search-container">
          <h2>Find Your Ideal Property</h2>
          <div className="search-filters">
            <div className="filter-group">
              <input
                type="text"
                className="form-control"
                placeholder="Location"
                value={filterPropertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                className="form-control"
                value={filterPropertyAdType}
                onChange={(e) => setPropertyAdType(e.target.value)}
              >
                <option value="">Property Purpose</option>
                <option value="sale">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                className="form-control"
                value={filterPropertyType}
                onChange={(e) => setPropertyType(e.target.value)}
              >
                <option value="">Property Type</option>
                <option value="commercial">Commercial</option>
                <option value="land/plot">Land/Plot</option>
                <option value="residential">Residential</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="padding-left-100 featured-section">
        <div className="section-header">
          <h2>Featured Properties</h2>
          <p className="section-description">
            Explore our handpicked selection of premium properties
          </p>
        </div>

        <div className="properties-grid">
          <AllPropertiesCards 
            searchQuery={filterPropertyAddress}
            filterPropertyType={filterPropertyType}
            filterPropertyAdType={filterPropertyAdType}
            filterPropertyAddress={filterPropertyAddress}
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Why Choose Us</h2>
        </div>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">👤</div>
            <h3>Verified Owners</h3>
            <p>All the owners are verified by the app admin</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Best Prices</h3>
            <p>Find the most competitive rental rates in the market</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Trusted Platform</h3>
            <p>Join thousands of satisfied tenants and property owners</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;