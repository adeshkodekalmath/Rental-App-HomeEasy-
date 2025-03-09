import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create email content with proper formatting
    const emailContent = `
Name: ${formData.name}
Email: ${formData.email}

${formData.message}

Best regards,
${formData.name}
    `.trim();

    // Encode the parameters for the mailto link
    const mailtoLink = `mailto:askodekalmath@outlook.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailContent)}`;

    // Try to open default mail client first
    window.location.href = mailtoLink;

    // Set a timeout to redirect to Gmail if mail client doesn't open
    setTimeout(() => {
      // Check if the mailto link was successful (this is a basic check)
      if (document.hasFocus()) {
        // If still on the page, redirect to Gmail compose
        const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=askodekalmath@outlook.com&su=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(emailContent)}`;
        window.open(gmailLink, '_blank');
      }
    }, 500);
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-info">
          <h1>Get in Touch</h1>
          <p>Have questions about our rental services? We're here to help!</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <div className="contact-text">
                <h3>Address</h3>
                <p>Vijayapura, Karnataka, India</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <div className="contact-text">
                <h3>Phone</h3>
                <p>+91 8217099506</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <div className="contact-text">
                <h3>Email</h3>
                <p>askodekalmath@outlook.com</p>
              </div>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="subject"
              className="form-control"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <textarea
              name="message"
              className="form-control"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
            ></textarea>
          </div>
          
          <button type="submit" className="btn btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact; 