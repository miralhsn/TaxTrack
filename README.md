# TaxTrack - Comprehensive Billing & Tax Management System

<div align="center">
  <img src="https://img.shields.io/badge/React-19.1.0-blue?style=for-the-badge&logo=react" alt="React Version">
  <img src="https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/MongoDB-8.16.3-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/TailwindCSS-3.4.1-blue?style=for-the-badge&logo=tailwind-css" alt="TailwindCSS">
</div>

## 🚀 Overview

TaxTrack is a modern, full-stack billing and tax management application designed to streamline business operations. Built with React, Node.js, and MongoDB, it provides comprehensive features for client management, service tracking, invoice generation, and tax calculations.

## ✨ Features

### 🔐 Authentication & Security
- **Google OAuth Integration** - Sign in/up with Google accounts
- **JWT Authentication** - Secure token-based authentication
- **Password Reset Flow** - Email-based password recovery
- **Role-based Access Control** - Admin and user roles

### 👥 Client Management
- **Client CRUD Operations** - Create, read, update, delete clients
- **Client Details Dashboard** - Comprehensive client information
- **Service History** - Track all services provided to clients
- **Invoice Management** - Generate and manage invoices

### 💼 Service Management
- **Service Tracking** - Record and manage services provided
- **Tax Calculations** - Automatic tax computation
- **Status Management** - Track service status (pending, completed, paid)
- **Service History** - Complete service timeline

### 📊 Dashboard & Analytics
- **Real-time Statistics** - Revenue, pending payments, total clients
- **Interactive Charts** - Visual data representation with Recharts
- **Recent Activity Feed** - Latest transactions and updates
- **Tax Trends** - Historical tax data analysis

### 🎨 User Experience
- **Dark Mode Toggle** - Switch between light and dark themes
- **Responsive Design** - Mobile-first approach
- **Smooth Animations** - Framer Motion powered transitions
- **Loading States** - Professional loading indicators
- **Toast Notifications** - User feedback system

### 📄 Document Generation
- **PDF Invoice Generation** - Professional invoice creation
- **Print Preview** - Preview before printing
- **Email Integration** - Send invoices via email
- **Export Options** - Multiple export formats

### 🔔 Notifications & Alerts
- **Real-time Notifications** - Stay updated with latest activities
- **Email Notifications** - Automated email alerts
- **Admin Banner** - Important announcements
- **Status Updates** - Real-time status changes

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - Modern React with hooks
- **TailwindCSS 3.4.1** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **React Icons** - Icon library
- **Recharts** - Chart library
- **React Toastify** - Notification system
- **jsPDF** - PDF generation
- **React OAuth Google** - Google authentication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality
- **Google Auth Library** - Google OAuth verification
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaxTrack/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taxtrack
   JWT_SECRET=your-super-secret-jwt-key
   GOOGLE_CLIENT_ID=your-google-client-id
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development
   npm run dev
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the frontend directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

## 🔧 Configuration

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized origins and redirect URIs
6. Copy Client ID to environment variables

### Email Configuration
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password in EMAIL_PASS environment variable

## 📱 Usage

### Authentication
- **Sign Up**: Create account with email/password or Google OAuth
- **Sign In**: Login with credentials or Google account
- **Password Reset**: Use "Forgot Password" link for email-based reset

### Client Management
- **Add Client**: Click "Add Client" button to create new client
- **Edit Client**: Use edit icon to modify client information
- **Delete Client**: Use delete icon with confirmation modal
- **View Details**: Click view icon for comprehensive client information

### Service Management
- **Add Service**: Create new services for clients
- **Track Status**: Update service status (pending, completed, paid)
- **Generate Invoice**: Create professional invoices
- **Send Email**: Email invoices directly to clients

### Dashboard
- **View Statistics**: Real-time revenue and client data
- **Analyze Trends**: Interactive charts and graphs
- **Recent Activity**: Latest transactions and updates
- **Tax Insights**: Historical tax data analysis

## 🚀 Deployment

### Backend Deployment (Heroku)
```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create your-taxtrack-backend

# Add MongoDB addon
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set GOOGLE_CLIENT_ID=your-google-client-id
heroku config:set EMAIL_USER=your-email
heroku config:set EMAIL_PASS=your-app-password

# Deploy
git push heroku main
```

### Frontend Deployment (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## 📁 Project Structure

```
TaxTrack/
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── clientController.js
│   │   ├── serviceController.js
│   │   └── statsController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Client.js
│   │   ├── Service.js
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── client.js
│   │   ├── service.js
│   │   └── stats.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   ├── Clients/
│   │   │   └── Layout.jsx
│   │   ├── contexts/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@taxtrack.com or create an issue in the repository.

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS
- MongoDB for the database solution
- All contributors and users

---

<div align="center">
  <p>Made with ❤️ by TaxTrack Team</p>
  <p>Version 1.0.0</p>
</div> 