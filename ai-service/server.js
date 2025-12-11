const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

// Mount Routes
app.use('/admin', adminRoutes);
app.use('/student', studentRoutes);
app.use('/visitor', visitorRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({
    message: 'AI Microservice is running',
    services: {
      admin: '/admin/query (Protected)',
      student: '/student/query (Protected)',
      visitor: '/visitor/query (Public)'
    }
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 AI Microservice running on http://localhost:${PORT}`);
});
