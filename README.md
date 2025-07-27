# Street Supplier 🍲

**Empowering Local Vendors & Wholesalers Through Digital Innovation**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-streetsupplier.shop-brightgreen)](https://streetsupplier.shop/)
[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://github.com/topics/mern)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> A comprehensive B2B platform bridging the gap between street vendors and market wholesalers, bringing trust, efficiency, and modern e-commerce features to the local food supply chain.

## 🚀 Live Demo
**Visit:** [https://streetsupplier.shop/](https://streetsupplier.shop/)

---

## 📋 Table of Contents
- [Problem Statement](#-problem-statement)
- [Our Solution](#-our-solution)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Team](#-team)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

Street vendors face daily challenges in sourcing affordable, quality supplies:
- **Unreliable Supply Chain**: Dependence on inconsistent middlemen
- **Distance Barriers**: Traveling to distant markets wastes time and money
- **Trust Issues**: Lack of verified suppliers and secure payment methods
- **Inefficient Processes**: Manual ordering and inventory management
- **Limited Access**: No digital platform connecting vendors with wholesalers

## 💡 Our Solution

Street Supplier is a fully responsive MERN Stack web platform that digitizes the supply chain for local food vendors, providing:

### 🔐 **Secure & Verified Ecosystem**
- Google OAuth integration for seamless authentication
- Admin-verified vendor onboarding (FSSAI, GST, Business License)
- Trusted supplier network

### 🛒 **Comprehensive E-commerce Features**
- Bulk product browsing and ordering
- Flexible delivery options (delivery/self-pickup)
- Real-time inventory management
- Secure payment processing via Razorpay

### 📊 **Multi-Dashboard System**
- **Vendor Dashboard**: Browse, order, track purchases
- **Supplier Dashboard**: Manage inventory, fulfill orders, track payments
- **Admin Dashboard**: User verification, platform monitoring, support

---

## ✨ Key Features

### For Vendors 👨‍🍳
- ✅ **Verified Account Setup** with business documentation
- ✅ **Browse Bulk Products** from verified suppliers
- ✅ **Place Orders** with quantity customization
- ✅ **Choose Delivery Options** (delivery/self-pickup)
- ✅ **Secure Payments** via Razorpay integration
- ✅ **Order Tracking** and history management

### For Suppliers 🧑‍🏭
- ✅ **Inventory Management** with real-time updates
- ✅ **Bulk Order Processing** and fulfillment
- ✅ **Payment Tracking** and secure transactions
- ✅ **Customer Management** and communication
- ✅ **Analytics Dashboard** for business insights

### For Admins 🛡️
- ✅ **Vendor Verification System** (FSSAI, GST, Business License)
- ✅ **Platform Monitoring** and user management
- ✅ **Transaction Oversight** and support
- ✅ **System Analytics** and reporting
- ✅ **Quality Control** and compliance management

---

## 🛠 Tech Stack

### Frontend
- **React.js** - Dynamic user interface
- **CSS3 & Bootstrap** - Responsive design
- **JavaScript (ES6+)** - Modern web development

### Backend
- **Node.js** - Server-side runtime
- **Express.js** - Web application framework
- **RESTful APIs** - Clean architecture

### Database & Caching
- **MongoDB** - Primary database for scalable data storage
- **Redis** - Caching layer for optimized performance

### Authentication & Payments
- **Google OAuth 2.0** - Secure user authentication
- **Razorpay** - Payment gateway integration

### Deployment & DevOps
- **Cloud Hosting** - Production deployment
- **SSL Certificate** - Secure HTTPS connection

---

## 🏗 System Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React.js      │    │   Express.js     │    │   MongoDB       │
│   Frontend      │◄──►│   Backend API    │◄──►│   Database      │
│                 │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Google OAuth    │    │   Razorpay       │    │   Redis Cache   │
│ Authentication  │    │   Payments       │    │   Performance   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Redis server
- Google OAuth credentials
- Razorpay API keys

### Installation

1. **Install dependencies**
   ```bash
   # Install backend dependencies
   npm install
   
   # Install frontend dependencies
   cd client
   npm install
   cd ..
   ```

2. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/street-supplier
   REDIS_URL=redis://localhost:6379
   
   # Authentication
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Payments
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   
   # Security
   JWT_SECRET=your_jwt_secret
   SESSION_SECRET=your_session_secret
   ```

3. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

---

## 🔌 API Documentation

### Authentication Endpoints
```
POST /api/auth/google     - Google OAuth login
POST /api/auth/logout     - User logout
GET  /api/auth/profile    - Get user profile
```

### Vendor Endpoints
```
GET    /api/vendors       - Get all vendors
POST   /api/vendors       - Create vendor profile
PUT    /api/vendors/:id   - Update vendor
DELETE /api/vendors/:id   - Delete vendor
```

### Product Endpoints
```
GET    /api/products      - Get all products
POST   /api/products      - Create product
PUT    /api/products/:id  - Update product
DELETE /api/products/:id  - Delete product
```

### Order Endpoints
```
GET    /api/orders        - Get orders
POST   /api/orders        - Create order
PUT    /api/orders/:id    - Update order status
```

---

## 🏆 Hackathon Achievement

**Tutedude Hackathon Project** 🌍

This platform was developed during the Tutedude Hackathon, where our team successfully built a complete MERN Stack solution addressing real-world problems faced by street vendors and wholesalers.

### Impact & Vision
- **Empowering Small Businesses**: Bringing street vendors into the formal supply chain
- **Digital Transformation**: Modernizing traditional vendor-supplier relationships
- **Economic Growth**: Creating new B2B sales channels for suppliers
- **Community Development**: Supporting local food ecosystems

---

## 👥 Team

Meet the brilliant minds behind Street Supplier:

| Name |
|------|
| **Atharva Kote** |
| **Mahesh Shinde** |
| **Atharva Narkhede** |
| **Smitraj Bankar** |
| **Parth Kulkarni** |

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
3. Push to the branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Support & Feedback

- **Website**: [https://streetsupplier.shop/](https://streetsupplier.shop/)

### Partnership & Investment Opportunities
We're open to partnerships, collaborations, and investor conversations. Reach out to us through our platform.

---

<div align="center">

**Built with ❤️ for the street vendor community**

⭐ Star us on GitHub if this project helped you!

[Live Demo](https://streetsupplier.shop/)

</div>
