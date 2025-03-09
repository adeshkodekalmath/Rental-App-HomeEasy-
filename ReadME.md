# Space Easy Application

A modern web application for property rental and management, connecting property owners with potential renters.

## Features

### For Visitors
- Browse available properties
- View detailed property information
- Advanced property search with filters (type, ad type, location)
- Contact form for general inquiries

### For Renters
- User registration and authentication
- Property search and filtering
- Request property bookings
- Track booking status
- View booking history
- Contact property owners

### For Property Owners
- Dashboard to manage properties
- Add new properties with multiple images
- Edit property details
- Delete properties (automatically removes related bookings)
- Manage property bookings
- Update booking status (pending/booked)
- Track property availability

### For Administrators
- User management
- Property oversight
- Booking management
- System monitoring

## Technical Stack

### Frontend
- React.js
- Material-UI (MUI)
- React Bootstrap
- Axios for API calls
- React Router for navigation

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Multer for file uploads

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   PORT=8000
   MONGODB_URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

4. Start the application:
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd frontend
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/user/register` - User registration
- POST `/api/user/login` - User login
- POST `/api/user/forgotpassword` - Password reset

### Properties
- GET `/api/user/getallproperties` - Get all properties
- POST `/api/owner/postproperty` - Add new property
- DELETE `/api/owner/deleteproperty/:propertyid` - Delete property
- PATCH `/api/owner/updateproperty/:propertyid` - Update property

### Bookings
- POST `/api/user/bookinghandle/:propertyid` - Create booking
- GET `/api/owner/getallbookings` - Get owner's bookings
- POST `/api/owner/handlebookingstatus` - Update booking status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Contact

Email: contact@houserental.com
Phone: +91 8217099506
Address: Vijayapura, Karnataka, India
