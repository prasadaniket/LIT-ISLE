# 📚 LIT ISLE - Digital Library Platform

<div align="center">
  <img src="client/public/logo/Logoa.jpeg" alt="LIT ISLE Logo" width="200" height="200">
  
  **A Modern Digital Library Where Books and Readers Connect**
  
  [![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-Database-green.svg)](https://mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1.12-blue.svg)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-7.1.2-purple.svg)](https://vitejs.dev/)
</div>

## 🌟 Overview

LIT ISLE is a comprehensive digital library platform that revolutionizes how readers discover, read, and interact with books. Built with modern web technologies, it provides a seamless reading experience with advanced features like digital highlighting, note-taking, community reviews, and personalized recommendations.

## ✨ Key Features

### 📖 **Reading Experience**
- **Digital Book Reader** - Built-in PDF reader with smooth navigation
- **Highlighting & Notes** - Color-coded highlights with personal notes
- **Reading Progress** - Track your reading journey with detailed statistics
- **Bookmarks** - Save important pages and sections
- **Offline Reading** - Download books for offline access

### 👥 **Community Features**
- **Book Reviews** - Rate and review books you've read
- **Community Discussions** - Engage with fellow readers
- **Author Profiles** - Discover and follow your favorite authors
- **Reading Groups** - Join or create book clubs

### 🎯 **Personalization**
- **Smart Recommendations** - AI-powered book suggestions
- **Personal Library** - Organize books in custom shelves
- **Reading Statistics** - Track your reading habits and achievements
- **Genre Preferences** - Personalized content based on your interests

### 📱 **Modern Interface**
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Dark/Light Mode** - Choose your preferred reading theme
- **Accessibility** - Built with accessibility standards in mind
- **Intuitive Navigation** - Easy-to-use interface for all ages

## 🚀 Technology Stack

### Frontend
- **React 19.1.1** - Modern UI library
- **Vite 7.1.2** - Fast build tool and dev server
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **React Router DOM 7.9.1** - Client-side routing
- **Lucide React** - Beautiful icon library
- **Radix UI** - Accessible component primitives

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web application framework
- **MongoDB 8.18.1** - NoSQL database
- **Mongoose 8.18.1** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing

### Additional Tools
- **Cloudinary** - Image and file storage
- **PDF.js** - PDF rendering and manipulation
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **Validator** - Input validation

## 📁 Project Structure

```
LIT-ISLE/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   │   ├── Books/         # Book files and covers
│   │   ├── brand-img/     # Brand images
│   │   ├── logo/          # Logo files
│   │   └── ...
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                # Backend Node.js application
│   ├── controllers/       # Route controllers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Utility functions
│   ├── config/           # Configuration files
│   ├── package.json
│   └── server.js
├── SERVER_SETUP_GUIDE.md
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/LIT-ISLE.git
cd LIT-ISLE
```

### 2. Backend Setup
```bash
cd server
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration

npm start
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```

### 4. Environment Variables
Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/lit-isle

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## 🚀 Quick Start

1. **Start the Backend Server**
   ```bash
   cd server
   npm start
   ```
   Server will run on `http://localhost:4000`

2. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

3. **Open your browser** and navigate to `http://localhost:5173`

## 📚 Available Scripts

### Frontend (client/)
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Backend (server/)
- `npm start` - Start the server with nodemon
- `npm run dev` - Start development server

## 🔧 API Documentation

The API provides comprehensive endpoints for:

- **User Management** - Registration, login, profile management
- **Book Operations** - CRUD operations, search, filtering
- **Reading Features** - Highlights, notes, progress tracking
- **Community** - Reviews, discussions, ratings
- **Shelf Management** - Personal library organization

For detailed API documentation, see [API_DOCUMENTATION.md](server/API_DOCUMENTATION.md)

## 🎨 Features in Detail

### Digital Reading Experience
- **PDF Reader** - Smooth page navigation with zoom controls
- **Highlighting System** - Multiple colors with custom notes
- **Bookmarking** - Save important pages and sections
- **Reading Progress** - Visual progress bars and statistics

### Community Features
- **Book Reviews** - Rate and review books with detailed feedback
- **Discussion Forums** - Engage in book-related conversations
- **Author Following** - Follow your favorite authors
- **Reading Groups** - Join or create book clubs

### Personalization
- **Smart Recommendations** - AI-powered book suggestions
- **Custom Shelves** - Organize books by categories
- **Reading Statistics** - Track reading habits and achievements
- **Genre Preferences** - Personalized content discovery

## 🔒 Security Features

- **JWT Authentication** - Secure user authentication
- **Password Hashing** - bcrypt for password security
- **Input Validation** - Comprehensive input sanitization
- **File Upload Security** - Type and size validation
- **CORS Protection** - Cross-origin request security
- **Rate Limiting** - API request throttling

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - Full-featured experience with sidebar navigation
- **Tablet** - Touch-optimized interface
- **Mobile** - Collapsible navigation and mobile-first design

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the dist/ folder
```

### Backend Deployment (Heroku/Railway)
```bash
cd server
# Configure production environment variables
# Deploy the server directory
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Aniket Prasad** - Full Stack Developer
- **CodeClause** - Project Organization

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB for the flexible database
- All the open-source libraries that made this project possible

## 📞 Support

For support, email support@lit-isle.com or join our Discord community.

## 🔮 Future Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI recommendations
- [ ] Social reading features
- [ ] Author publishing tools
- [ ] Audiobook integration
- [ ] Offline reading capabilities
- [ ] Multi-language support

---

<div align="center">
  <p>Made with ❤️ by the LIT ISLE Team</p>
  <p>📚 Building the future of digital reading 📚</p>
</div>
