import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboards.css";
import Dashpic from "../assets/Dash-pic.png";
import Login from "./Login";
import farmerImg from "../assets/Our-Prmise.png";
import networkImg from "../assets/Our-Transport-Network.png";
import growingImg from "../assets/Growing-Together.png";
import farmerServiceImg from "../assets/Solution-For-Farmers.png";
import transporterImg from "../assets/Solution-For-Transporters.png";
import dealerImg from "../assets/Solotions-For-Dealers.png";
import greenFieldImg from "../assets/Making-Transport-Better.jpg";

const Dashboard = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setShowLogin(true);
  };

  const handleCloseModal = () => {
    setShowLogin(false);
  };

  const handleSignup = () => {
    navigate("/Signup");
  };

  return (
    <div className="dashboard">
      {/* Fixed Navbar */}
      <nav className="fixed-navbar">
        <div className="navbar-wrapper">
          <div className="navbar-brand">
            <h2>AgroLogiX</h2>
          </div>

          <ul className="navbar-menu">
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#about">About Us</a>
            </li>
            <li>
              <a href="#contact">Contact Us</a>
            </li>
          </ul>

          <div className="navbar-buttons">
            <button className="nav-login-btn" onClick={handleLogin}>
              <span className="btn-icon">👤</span>
              <span className="btn-text">Login</span>
            </button>
            <button className="nav-signup-btn" onClick={handleSignup}>
              <span className="btn-icon">✍️</span>
              <span className="btn-text">Sign Up</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Login Component */}
      {showLogin && <Login onClose={handleCloseModal} />}

      {/* Main Header - Without Auth Buttons */}
      <div className="header" id="home">
        <div className="header-content">
          <div className="header-text-section">
            <h1>🌾 Empowering Agricultural Supply Chain Excellence</h1>
            <p>
              The Agri Transport & Logistics Management System (ATLMS) is
              designed to streamline the movement of agricultural products from
              farms to markets, warehouses, and retailers. It ensures better
              route planning, vehicle tracking, cost efficiency, and reduces
              post-harvest losses. ATLMS provides transparency and
              accountability in agricultural transportation, improves farmer
              income, ensures timely delivery, and strengthens the agri-supply
              chain ecosystem.
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Image */}
      <div className="image-container">
        <img src={Dashpic} alt="Dashboard" className="dashboard-image" />
      </div>

      {/* About Us Section - NEW */}
      <div className="header-container" id="about">
        <h2 className="header-title">ℹ️ About Us</h2>
      </div>
      <section className="about-us-section">
        <div className="about-content">
          <h3>Who We Are</h3>
          <p>
            AgroLogiX is a pioneering platform dedicated to revolutionizing
            agricultural logistics in India. We bridge the gap between farmers,
            transporters, buyers, and equipment providers through innovative
            technology and a deep understanding of the agricultural supply
            chain. Our mission is to empower every stakeholder in the
            agricultural ecosystem with tools that ensure efficiency,
            transparency, and profitability across transportation, equipment
            rental, and market access.
          </p>

          <h3>Our Vision</h3>
          <p>
            We envision an India where no farmer struggles with transportation
            challenges or lacks access to essential farming equipment. A future
            where fresh produce reaches markets on time without wastage, where
            modern agricultural machinery is accessible to all farmers through
            affordable rental options, and where technology empowers rural
            communities. By leveraging modern logistics solutions, real-time
            tracking, equipment sharing platforms, and data-driven insights,
            we're building a seamless, sustainable, and farmer-centric
            agricultural ecosystem.
          </p>

          <h3>What We Do</h3>
          <p>
            AgroLogiX provides comprehensive logistics and resource management
            solutions tailored for the agricultural sector. Our platform
            connects farmers with verified transporters for reliable
            farm-to-market delivery, offers real-time GPS tracking for
            shipments, and provides a rental marketplace for agricultural
            equipment including tractors, harvesters, ploughs, irrigation
            systems, and modern farming tools. Farmers can book transportation,
            rent equipment by the hour or day, track their produce in transit,
            and connect directly with buyers. Transporters gain access to
            consistent business opportunities, optimized routes, and fair
            pricing. Equipment owners can monetize idle machinery through our
            rental platform, creating additional income streams while helping
            fellow farmers access technology they couldn't otherwise afford.
          </p>

          <h3>Why Choose Us</h3>
          <p>
            With deep expertise in agriculture and technology, we understand the
            unique challenges faced by Indian farmers, transporters, and
            agricultural entrepreneurs. Our solutions combine simplicity with
            powerful features: easy booking systems, transparent pricing,
            verified users, secure payments, and 24/7 support. Whether you're a
            smallholder farmer needing a truck for market day, a transporter
            seeking reliable routes, or an equipment owner looking to share
            resources, AgroLogiX provides the digital infrastructure to succeed.
            We're committed to reducing post-harvest losses, ensuring fair
            compensation, democratizing access to agricultural technology, and
            empowering rural India through sustainable digital transformation.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <div className="header-container">
        <h2 className="header-title">✨ Why Choose AgroLogiX?</h2>
      </div>
      <section className="why-choose-section">
        <div className="why-choose-card">
          <h3>🎯 For Farmers</h3>
          <ul>
            <li>Direct market access without intermediaries</li>
            <li>Better prices for your produce</li>
            <li>Real-time transport tracking</li>
            <li>Flexible pickup scheduling</li>
            <li>Secure and timely payments</li>
          </ul>
        </div>
        <div className="why-choose-card">
          <h3>🚛 For Transporters</h3>
          <ul>
            <li>Consistent load availability</li>
            <li>Optimized route planning</li>
            <li>Fair and transparent pricing</li>
            <li>Quick payment processing</li>
            <li>Digital documentation</li>
          </ul>
        </div>
        <div className="why-choose-card">
          <h3>🏪 For Dealers/Buyers</h3>
          <ul>
            <li>Fresh produce directly from farms</li>
            <li>Quality assurance and tracking</li>
            <li>Scheduled and reliable deliveries</li>
            <li>Competitive pricing</li>
            <li>Easy order management</li>
          </ul>
        </div>
      </section>

      {/* Solutions For Farmers */}
      <div className="header-container">
        <h2 className="header-title">🌱 Solutions for Farmers</h2>
      </div>
      <section className="solutions-section">
        <div className="solution-image">
          <img
            src={farmerServiceImg}
            alt="Farmer Services"
            className="section-image"
          />
        </div>
        <div className="solution-content">
          <h3>Empowering Farmers</h3>
          <p>Our farmer-focused services include:</p>
          <ul className="solution-list">
            <li>Easy booking through mobile app or web platform</li>
            <li>Multiple transport options based on crop type</li>
            <li>Direct connection to mandis and wholesale buyers</li>
            <li>Real-time price updates and market information</li>
            <li>Insurance coverage for transported goods</li>
            <li>Training and support for digital adoption</li>
          </ul>
        </div>
      </section>

      {/* Solutions For Transporters */}
      <div className="header-container">
        <h2 className="header-title">🚚 Solutions for Transporters</h2>
      </div>
      <section className="solutions-section reverse">
        <div className="solution-content">
          <h3>Growing Your Transport Business</h3>
          <p>Transportation partners benefit from:</p>
          <ul className="solution-list">
            <li>Reduced empty return trips with load matching</li>
            <li>GPS-based route optimization to save fuel</li>
            <li>Digital contracts and automated billing</li>
            <li>Access to a large network of farmers and buyers</li>
            <li>Performance tracking and ratings system</li>
            <li>Insurance and safety guidelines</li>
          </ul>
        </div>
        <div className="solution-image">
          <img
            src={transporterImg}
            alt="Transporter Services"
            className="section-image"
          />
        </div>
      </section>

      {/* Solutions For Dealers */}
      <div className="header-container">
        <h2 className="header-title">🏪 Solutions for Dealers</h2>
      </div>
      <section className="solutions-section">
        <div className="solution-image">
          <img
            src={dealerImg}
            alt="Dealer Services"
            className="section-image"
          />
        </div>
        <div className="solution-content">
          <h3>Streamlined Procurement</h3>
          <p>Our platform offers dealers:</p>
          <ul className="solution-list">
            <li>Direct sourcing from verified farmers</li>
            <li>Quality checks and certification</li>
            <li>Scheduled deliveries matching your needs</li>
            <li>Bulk order management tools</li>
            <li>Invoice and payment tracking</li>
            <li>Cold chain logistics for perishables</li>
          </ul>
        </div>
      </section>

      {/* Making Transport Better */}
      <div className="header-container">
        <h2 className="header-title">🌿 Making Transport Better</h2>
      </div>
      <section className="transport-better-section">
        <div className="transport-image">
          <img
            src={greenFieldImg}
            alt="Green Transport"
            className="section-image"
          />
        </div>
        <div className="transport-content">
          <h3>Sustainable and Efficient</h3>
          <ul className="transport-list">
            <li>Eco-friendly transport options</li>
            <li>Route optimization to reduce carbon footprint</li>
            <li>Digital documentation - reducing paper waste</li>
            <li>Supporting local transport communities</li>
            <li>Technology-driven efficiency improvements</li>
          </ul>
        </div>
      </section>

      {/* Transport Network Section */}
      <div className="header-container">
        <h2 className="header-title">🚚 Our Transport Network</h2>
      </div>
      <section className="network-section">
        <div className="network-image">
          <img src={networkImg} alt="Network" className="section-image" />
        </div>
        <div className="network-content">
          <h3>Comprehensive Logistics Network</h3>
          <ul className="network-list">
            <li>Pan-India coverage connecting rural farms to urban markets</li>
            <li>Verified and reliable transport partners</li>
            <li>Multiple vehicle options for different cargo needs</li>
            <li>
              Cold storage and temperature-controlled transport facilities
            </li>
            <li>24/7 customer support and assistance</li>
          </ul>
        </div>
      </section>

      {/* Growing Together Section */}
      <div className="header-container">
        <h2 className="header-title">🤝 Growing Together</h2>
      </div>
      <section className="growing-section">
        <div className="growing-content">
          <p>
            AgroLogiX is more than just a logistics platform - it's a community
            of farmers, transporters, and buyers working together to build a
            stronger agricultural ecosystem.
          </p>
          <ul className="growing-list">
            <li>Community forums for knowledge sharing</li>
            <li>Training programs and workshops</li>
            <li>Market intelligence and insights</li>
            <li>Networking opportunities</li>
            <li>Government scheme awareness</li>
          </ul>
          <p className="growing-tagline">
            Together, we're building the future of agricultural logistics in
            India!
          </p>
        </div>
        <div className="growing-image">
          <img
            src={growingImg}
            alt="Growing Together"
            className="section-image"
          />
        </div>
      </section>

      {/* Our Promise Section */}
      <div className="header-container">
        <h2 className="header-title">📜 Our Promise</h2>
      </div>
      <section className="promise-section">
        <div className="promise-image">
          <img src={farmerImg} alt="Farmer" className="section-image" />
        </div>
        <div className="promise-content">
          <h3>At AgroLogiX, we believe in:</h3>
          <ul className="promise-list">
            <li>
              Fair pricing and transparent transactions for all stakeholders
            </li>
            <li>
              Real-time tracking and communication throughout the supply chain
            </li>
            <li>Building trust between farmers, transporters, and buyers</li>
            <li>Reducing wastage and ensuring timely deliveries</li>
            <li>Supporting sustainable agricultural practices</li>
          </ul>
          <p className="promise-tagline">
            Join us in making Indian agriculture better, one trip at a time!
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <div className="header-container" id="contact">
        <h2 className="header-title">📞 Get in Touch</h2>
      </div>
      <section className="contact-section">
        <div className="contact-content">
          <p>Need help or want to know more? Reach out to us:</p>
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📧</span>
              <span>support@AgroLogiX.com</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📱</span>
              <span>+91 1800-XXX-XXXX</span>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🌐</span>
              <span>www.AgroLogiX.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>© 2025 AgroLogiX - Empowering Agriculture Through Technology</p>
      </footer>

      {/* Login Modal */}
      {showLogin && <Login onClose={handleCloseModal} />}
    </div>
  );
};

export default Dashboard;
