# RentRider - Bike Rental Platform

A comprehensive bike rental platform built with React, Node.js, and MongoDB.

## Features

### For Customers
- Browse and search available bikes
- View bike details and pricing
- Book bikes for specific dates
- Secure payment processing
- Booking history and management
- User profile management
- Review and rating system

### For Bike Owners
- List and manage bikes
- Set pricing and availability
- View bookings and earnings
- Dashboard with analytics
- Communication with customers

### For Admins
- Comprehensive admin dashboard
- User and vehicle management
- Booking and payment oversight
- Reports and analytics
- Platform settings

## Tech Stack

- **Frontend**: React.js with modern UI components
- **Backend**: Node.js with Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based authentication
- **Payment**: Razorpay integration
- **File Storage**: Firebase Storage
- **Notifications**: Email and SMS notifications

## Project Structure

```
rentrider/
├── client/           # Customer and Owner React App
├── admin-panel/      # Admin Dashboard React App
├── server/           # Node.js Backend API
├── mobile-app/       # Mobile App (Optional)
└── package.json      # Root configuration
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rentrider
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in the server directory
   - Update the environment variables with your configurations

4. Start the development servers:
```bash
npm run dev
```

This will start:
- Client app on http://localhost:3000
- Admin panel on http://localhost:3001
- Server API on http://localhost:5000

### Individual Services

To run services individually:

```bash
# Start only the server
npm run server:dev

# Start only the client
npm run client:dev

# Start only the admin panel
npm run admin:dev
```

## API Documentation

The API documentation will be available at `http://localhost:5000/api-docs` when the server is running.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
