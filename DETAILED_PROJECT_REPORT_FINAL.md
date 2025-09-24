# Chapter 4: System Design

## 4.1 System Architecture

### Figure 4.1: System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           RENTRIDER SYSTEM ARCHITECTURE                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐            │
│  │   CLIENT APP    │  │  ADMIN PANEL    │  │   MOBILE APP    │            │
│  │   (Port 3000)   │  │  (Port 3001)    │  │   (Future)      │            │
│  │                 │  │                 │  │                 │            │
│  │ • React.js      │  │ • React.js      │  │ • React Native  │            │
│  │ • Tailwind CSS  │  │ • Admin UI      │  │ • Native APIs   │            │
│  │ • Context API   │  │ • Analytics     │  │ • Push Notif.   │            │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘            │
│           │                     │                     │                    │
│           └─────────────────────┼─────────────────────┘                    │
│                                 │                                          │
│                    ┌─────────────────────────────┐                        │
│                    │      LOAD BALANCER          │                        │
│                    │    (Nginx/CloudFlare)       │                        │
│                    └─────────────────────────────┘                        │
│                                 │                                          │
│                    ┌─────────────────────────────┐                        │
│                    │      BACKEND API            │                        │
│                    │     (Port 5001)             │                        │
│                    │                             │                        │
│                    │ • Express.js Server         │                        │
│                    │ • JWT Authentication        │                        │
│                    │ • RESTful APIs              │                        │
│                    │ • Middleware Stack          │                        │
│                    │ • File Upload Handler       │                        │
│                    └─────────────────────────────┘                        │
│                                 │                                          │
│         ┌───────────────────────┼───────────────────────┐                 │
│         │                       │                       │                 │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐           │
│  │  DATABASE   │    │ THIRD-PARTY     │    │ FILE STORAGE    │           │
│  │             │    │ SERVICES        │    │                 │           │
│  │ • MongoDB   │    │                 │    │ • Firebase      │           │
│  │ • Atlas     │    │ • Razorpay      │    │   Storage       │           │
│  │ • Mongoose  │    │ • Google Maps   │    │ • Cloudinary    │           │
│  │ • Indexing  │    │ • Firebase Auth │    │ • Image Opt.    │           │
│  │ • Backup    │    │ • Nodemailer    │    │ • CDN           │           │
│  └─────────────┘    │ • Twilio SMS    │    └─────────────────┘           │
│                     └─────────────────┘                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.1.1 Architecture Components

**Presentation Layer:**
- **Client Application:** React.js-based customer and owner interface
- **Admin Panel:** Dedicated administrative dashboard
- **Mobile Application:** Future React Native implementation

**Application Layer:**
- **API Gateway:** Request routing and load balancing
- **Authentication Service:** JWT and OAuth handling
- **Business Logic:** Core application functionality
- **Middleware Stack:** Security, logging, and validation

**Data Layer:**
- **Primary Database:** MongoDB Atlas for application data
- **File Storage:** Firebase Storage for documents and images
- **Cache Layer:** Redis for session and temporary data storage

**External Services:**
- **Payment Gateway:** Razorpay for transaction processing
- **Maps Service:** Google Maps for location services
- **Communication:** Email and SMS notification services
- **Analytics:** Google Analytics and custom metrics

## 4.2 Database Design

### Figure 4.2: Database Schema Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE SCHEMA DESIGN                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐│
│  │     USERS       │         │    VEHICLES     │         │    BOOKINGS     ││
│  │                 │         │                 │         │                 ││
│  │ _id (ObjectId)  │    ┌────│ _id (ObjectId)  │    ┌────│ _id (ObjectId)  ││
│  │ email (String)  │    │    │ owner (Ref)     │────┘    │ customer (Ref)  │──┐
│  │ role (Enum)     │────┘    │ brand (String)  │         │ vehicle (Ref)   │──┘
│  │ isProfileComp.. │         │ model (String)  │    ┌────│ startDate       ││
│  │ personalDetails │         │ type (Enum)     │    │    │ endDate         ││
│  │ address         │         │ year (Number)   │    │    │ totalAmount     ││
│  │ documents       │         │ specifications  │    │    │ status (Enum)   ││
│  │ ownerDetails    │         │ pricing         │    │    │ payment         ││
│  │ createdAt       │         │ location        │    │    │ createdAt       ││
│  │ updatedAt       │         │ images          │    │    │ updatedAt       ││
│  └─────────────────┘         │ availability    │    │    └─────────────────┘│
│                              │ verification    │    │                       │
│                              │ createdAt       │    │    ┌─────────────────┐│
│                              │ updatedAt       │    │    │    PAYMENTS     ││
│                              └─────────────────┘    │    │                 ││
│                                                     │    │ _id (ObjectId)  ││
│  ┌─────────────────┐                              │    │ booking (Ref)   │──┘
│  │    REVIEWS      │                              │    │ razorpayOrderId ││
│  │                 │                              │    │ paymentId       ││
│  │ _id (ObjectId)  │                              │    │ amount          ││
│  │ customer (Ref)  │──────────────────────────────┘    │ status (Enum)   ││
│  │ vehicle (Ref)   │───────────────────────────────────│ method          ││
│  │ booking (Ref)   │                                   │ createdAt       ││
│  │ rating (Number) │                                   │ updatedAt       ││
│  │ comment (String)│                                   └─────────────────┘│
│  │ createdAt       │                                                       │
│  │ updatedAt       │                                                       │
│  └─────────────────┘                                                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Table 4.1: Database Collections Overview

| Collection | Purpose | Key Fields | Relationships |
|------------|---------|------------|---------------|
| **users** | Store user information for all roles | email, role, personalDetails, documents | One-to-many with vehicles, bookings |
| **vehicles** | Store vehicle listings and details | owner, brand, model, pricing, location | Belongs to user, has many bookings |
| **bookings** | Store rental booking information | customer, vehicle, dates, amount, status | Belongs to user and vehicle |
| **payments** | Store payment transaction details | booking, razorpayOrderId, amount, status | Belongs to booking |
| **reviews** | Store customer reviews and ratings | customer, vehicle, rating, comment | Belongs to user, vehicle, booking |

### 4.2.1 Data Models

**User Model Schema:**
```javascript
{
  _id: ObjectId,
  email: { type: String, unique: true, required: true },
  role: { type: String, enum: ['customer', 'owner', 'admin'], default: 'customer' },
  isProfileComplete: { type: Boolean, default: false },
  personalDetails: {
    firstName: String,
    lastName: String,
    dateOfBirth: Date,
    gender: { type: String, enum: ['male', 'female', 'other'] },
    phone: String,
    bio: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  documents: {
    aadharNumber: String,
    drivingLicense: {
      number: String,
      expiryDate: Date,
      imageUrl: String
    },
    profilePicture: String
  },
  ownerDetails: {
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      accountHolderName: String
    },
    verificationStatus: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

**Vehicle Model Schema:**
```javascript
{
  _id: ObjectId,
  owner: { type: ObjectId, ref: 'User', required: true },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  type: { type: String, enum: ['motorcycle', 'scooter', 'bicycle'], required: true },
  year: { type: Number, required: true },
  specifications: {
    engine: String,
    mileage: String,
    fuelType: { type: String, enum: ['petrol', 'electric', 'hybrid'] },
    transmission: { type: String, enum: ['manual', 'automatic'] }
  },
  pricing: {
    hourlyRate: { type: Number, required: true },
    dailyRate: { type: Number, required: true },
    weeklyRate: Number,
    securityDeposit: { type: Number, required: true }
  },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  images: [{
    url: String,
    publicId: String,
    isPrimary: { type: Boolean, default: false }
  }],
  availability: {
    isAvailable: { type: Boolean, default: true },
    unavailableDates: [Date]
  },
  verification: {
    status: { type: String, enum: ['pending', 'verified', 'rejected'], default: 'pending' },
    documents: {
      registrationCertificate: String,
      insurance: String,
      pollutionCertificate: String
    }
  },
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

## 4.3 Data Flow Diagrams

### Figure 4.3: Level 0 DFD (Context Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LEVEL 0 DATA FLOW DIAGRAM                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                           ┌─────────────┐  │
│  │             │        Registration/Login Data            │             │  │
│  │  CUSTOMER   │──────────────────────────────────────────▶│             │  │
│  │             │        Booking Requests                   │             │  │
│  │             │◀──────────────────────────────────────────│             │  │
│  └─────────────┘        Vehicle Information                │             │  │
│                                                            │             │  │
│  ┌─────────────┐                                           │             │  │
│  │             │        Vehicle Listings                   │  RENTRIDER  │  │
│  │    OWNER    │──────────────────────────────────────────▶│   SYSTEM    │  │
│  │             │        Booking Confirmations              │             │  │
│  │             │◀──────────────────────────────────────────│             │  │
│  └─────────────┘        Earnings Reports                   │             │  │
│                                                            │             │  │
│  ┌─────────────┐                                           │             │  │
│  │             │        System Management                  │             │  │
│  │    ADMIN    │──────────────────────────────────────────▶│             │  │
│  │             │        Analytics & Reports                │             │  │
│  │             │◀──────────────────────────────────────────│             │  │
│  └─────────────┘                                           └─────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Figure 4.4: Level 1 DFD (System Overview)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LEVEL 1 DATA FLOW DIAGRAM                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐    ┌─────────────────┐    ┌─────────────────┐             │
│  │  CUSTOMER   │    │ 1.0 USER        │    │ 2.0 VEHICLE     │             │
│  │             │───▶│ MANAGEMENT      │    │ MANAGEMENT      │◀────────────┐│
│  │             │    │                 │    │                 │             ││
│  └─────────────┘    └─────────────────┘    └─────────────────┘             ││
│         │                     │                     │                      ││
│         │            ┌─────────────────┐            │              ┌───────┘│
│         │            │   USER DATA     │            │              │        │
│         │            │    STORE        │            │              │        │
│         │            └─────────────────┘            │              │        │
│         │                     │                     │              │        │
│         │            ┌─────────────────┐    ┌─────────────────┐    │        │
│         └───────────▶│ 3.0 BOOKING     │    │ 4.0 PAYMENT     │    │        │
│                      │ MANAGEMENT      │───▶│ PROCESSING      │    │        │
│                      │                 │    │                 │    │        │
│                      └─────────────────┘    └─────────────────┘    │        │
│                               │                     │              │        │
│                      ┌─────────────────┐    ┌─────────────────┐    │        │
│                      │ BOOKING DATA    │    │ PAYMENT DATA    │    │        │
│                      │    STORE        │    │    STORE        │    │        │
│                      └─────────────────┘    └─────────────────┘    │        │
│                                                                     │        │
│  ┌─────────────┐                                                   │        │
│  │    OWNER    │───────────────────────────────────────────────────┘        │
│  │             │                                                            │
│  └─────────────┘                                                            │
│                                                                             │
│  ┌─────────────┐    ┌─────────────────┐                                    │
│  │    ADMIN    │───▶│ 5.0 SYSTEM      │                                    │
│  │             │    │ ADMINISTRATION  │                                    │
│  └─────────────┘    └─────────────────┘                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Figure 4.5: Level 2 DFD (Detailed Process Flow)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LEVEL 2 DFD - BOOKING PROCESS                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                           │
│  │  CUSTOMER   │                                                           │
│  │             │                                                           │
│  └─────────────┘                                                           │
│         │                                                                  │
│         │ Search Request                                                   │
│         ▼                                                                  │
│  ┌─────────────────┐    Vehicle Data    ┌─────────────────┐               │
│  │ 3.1 SEARCH      │◀──────────────────│   VEHICLE       │               │
│  │ VEHICLES        │                   │   DATABASE      │               │
│  │                 │                   │                 │               │
│  └─────────────────┘                   └─────────────────┘               │
│         │                                                                  │
│         │ Search Results                                                   │
│         ▼                                                                  │
│  ┌─────────────────┐                                                      │
│  │ 3.2 SELECT      │                                                      │
│  │ VEHICLE         │                                                      │
│  │                 │                                                      │
│  └─────────────────┘                                                      │
│         │                                                                  │
│         │ Booking Request                                                  │
│         ▼                                                                  │
│  ┌─────────────────┐    Availability    ┌─────────────────┐               │
│  │ 3.3 CHECK       │◀──────────────────│   BOOKING       │               │
│  │ AVAILABILITY    │                   │   DATABASE      │               │
│  │                 │──────────────────▶│                 │               │
│  └─────────────────┘    Update Status   └─────────────────┘               │
│         │                                                                  │
│         │ Confirmation                                                     │
│         ▼                                                                  │
│  ┌─────────────────┐                                                      │
│  │ 3.4 CREATE      │                                                      │
│  │ BOOKING         │                                                      │
│  │                 │                                                      │
│  └─────────────────┘                                                      │
│         │                                                                  │
│         │ Payment Request                                                  │
│         ▼                                                                  │
│  ┌─────────────────┐                   ┌─────────────────┐               │
│  │ 3.5 PROCESS     │──────────────────▶│   RAZORPAY      │               │
│  │ PAYMENT         │                   │   GATEWAY       │               │
│  │                 │◀──────────────────│                 │               │
│  └─────────────────┘   Payment Status   └─────────────────┘               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.4 Use Case Diagrams

### Figure 4.6: Use Case Diagram - Customer

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CUSTOMER USE CASE DIAGRAM                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              ┌─────────────────┐                          │
│                              │                 │                          │
│  ┌─────────────┐             │   RENTRIDER     │             ┌─────────────┐│
│  │             │             │    SYSTEM       │             │             ││
│  │  CUSTOMER   │             │                 │             │   OWNER     ││
│  │             │             └─────────────────┘             │             ││
│  └─────────────┘                      │                      └─────────────┘│
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Register/Login │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Search Vehicles│                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ View Vehicle   │                    │       │
│         │                    │ Details        │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Book Vehicle   │────────────────────│       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Make Payment   │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ View Bookings  │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Cancel Booking │────────────────────│       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Rate & Review  │────────────────────│       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Manage Profile │                    │       │
│         │                    └────────────────┘                    │       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Figure 4.7: Use Case Diagram - Owner

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OWNER USE CASE DIAGRAM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              ┌─────────────────┐                          │
│                              │                 │                          │
│  ┌─────────────┐             │   RENTRIDER     │             ┌─────────────┐│
│  │             │             │    SYSTEM       │             │             ││
│  │    OWNER    │             │                 │             │  CUSTOMER   ││
│  │             │             └─────────────────┘             │             ││
│  └─────────────┘                      │                      └─────────────┘│
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Register/Login │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Add Vehicle    │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Manage Vehicles│                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Set Pricing    │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ View Bookings  │────────────────────│       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Approve/Reject │────────────────────│       │
│         │                    │ Bookings       │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ View Earnings  │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Communicate    │────────────────────│       │
│         │                    │ with Customers │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Update Profile │                    │       │
│         │                    └────────────────┘                    │       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Figure 4.8: Use Case Diagram - Admin

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ADMIN USE CASE DIAGRAM                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              ┌─────────────────┐                          │
│  ┌─────────────┐             │                 │             ┌─────────────┐│
│  │             │             │   RENTRIDER     │             │             ││
│  │    ADMIN    │             │    SYSTEM       │             │   USERS     ││
│  │             │             │                 │             │             ││
│  └─────────────┘             └─────────────────┘             └─────────────┘│
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Admin Login    │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Manage Users   │────────────────────│       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Verify Vehicles│                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Verify Owners  │────────────────────│       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Monitor        │                    │       │
│         │                    │ Transactions   │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Generate       │                    │       │
│         │                    │ Reports        │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ System         │                    │       │
│         │                    │ Configuration  │                    │       │
│         │                    └────────────────┘                    │       │
│         │                             │                             │       │
│         │                    ┌────────────────┐                    │       │
│         │────────────────────│ Handle Disputes│────────────────────│       │
│         │                    └────────────────┘                    │       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## 4.5 Entity Relationship Diagram

### Figure 4.9: Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ENTITY RELATIONSHIP DIAGRAM                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐                                   ┌─────────────────┐  │
│  │     USERS       │                                   │    VEHICLES     │  │
│  │                 │                                   │                 │  │
│  │ PK: _id         │                                   │ PK: _id         │  │
│  │    email        │                                   │ FK: owner_id    │  │
│  │    role         │                                   │    brand        │  │
│  │    isProfileC.. │            1        ∞             │    model        │  │
│  │    personalD..  │ ◄─────────────────────────────────│    type         │  │
│  │    address      │          OWNS                     │    year         │  │
│  │    documents    │                                   │    specifications│  │
│  │    ownerDetails │                                   │    pricing      │  │
│  │    createdAt    │                                   │    location     │  │
│  │    updatedAt    │                                   │    images       │  │
│  └─────────────────┘                                   │    availability │  │
│           │                                            │    verification │  │
│           │                                            │    rating       │  │
│           │                                            │    createdAt    │  │
│           │                                            │    updatedAt    │  │
│           │                                            └─────────────────┘  │
│           │                                                     │           │
│           │                                                     │           │
│           │ 1                                                   │ 1         │
│           │                                                     │           │
│           │                                                     │           │
│           │                    ┌─────────────────┐              │           │
│           │                    │    BOOKINGS     │              │           │
│           │                    │                 │              │           │
│           │                    │ PK: _id         │              │           │
│           │                    │ FK: customer_id │◄─────────────┘           │
│           └───────────────────►│ FK: vehicle_id  │◄─────────────────────────┘
│                          ∞     │    startDate    │
│                                │    endDate      │
│                         MAKES  │    totalAmount  │  BOOKED_FOR
│                                │    status       │
│                                │    payment      │        ∞
│                                │    createdAt    │
│                                │    updatedAt    │
│                                └─────────────────┘
│                                         │
│                                         │ 1
│                                         │
│                                         │
│                                         │
│                                ┌─────────────────┐
│                                │    PAYMENTS     │
│                                │                 │
│                                │ PK: _id         │
│                                │ FK: booking_id  │◄────────────────────────────┘
│                                │    razorpayO..  │
│                                │    paymentId    │         1
│                                │    amount       │
│                                │    status       │  PAYMENT_FOR
│                                │    method       │
│                                │    createdAt    │
│                                │    updatedAt    │
│                                └─────────────────┘
│                                                                             │
│  ┌─────────────────┐                            ┌─────────────────┐        │
│  │    REVIEWS      │                            │    BOOKINGS     │        │
│  │                 │                            │                 │        │
│  │ PK: _id         │                            │ PK: _id         │        │
│  │ FK: customer_id │◄───────────────────────────│ (Reference)     │        │
│  │ FK: vehicle_id  │                      1     │                 │        │
│  │ FK: booking_id  │◄───────────────────────────┘                 │        │
│  │    rating       │                                              │        │
│  │    comment      │                      ∞                       │        │
│  │    createdAt    │                                              │        │
│  │    updatedAt    │                   REVIEWS                    │        │
│  └─────────────────┘                                              │        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Table 4.2: API Endpoints Summary

| Module | Method | Endpoint | Description | Authentication |
|--------|--------|----------|-------------|----------------|
| **Authentication** |
| Auth | POST | /api/auth/register | User registration | No |
| Auth | POST | /api/auth/login | User login | No |
| Auth | POST | /api/auth/google | Google OAuth | No |
| Auth | POST | /api/auth/complete-profile | Complete user profile | Yes |
| Auth | GET | /api/auth/profile | Get user profile | Yes |
| Auth | PUT | /api/auth/profile | Update user profile | Yes |
| **Vehicle Management** |
| Vehicle | GET | /api/vehicles | Get all vehicles | No |
| Vehicle | GET | /api/vehicles/:id | Get vehicle details | No |
| Vehicle | POST | /api/vehicles | Add new vehicle | Yes (Owner) |
| Vehicle | PUT | /api/vehicles/:id | Update vehicle | Yes (Owner) |
| Vehicle | DELETE | /api/vehicles/:id | Delete vehicle | Yes (Owner) |
| **Booking Management** |
| Booking | POST | /api/bookings | Create booking | Yes |
| Booking | GET | /api/bookings | Get user bookings | Yes |
| Booking | GET | /api/bookings/:id | Get booking details | Yes |
| Booking | PUT | /api/bookings/:id | Update booking | Yes |
| **Payment Processing** |
| Payment | POST | /api/payments/create-order | Create payment order | Yes |
| Payment | POST | /api/payments/verify | Verify payment | Yes |
| Payment | GET | /api/payments/:id | Get payment details | Yes |
| **Admin Management** |
| Admin | GET | /api/admin/users | Get all users | Yes (Admin) |
| Admin | GET | /api/admin/vehicles | Get all vehicles | Yes (Admin) |
| Admin | PUT | /api/admin/verify-vehicle/:id | Verify vehicle | Yes (Admin) |
| Admin | GET | /api/admin/analytics | Get platform analytics | Yes (Admin) |

---