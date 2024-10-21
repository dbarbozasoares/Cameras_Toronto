// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS for specific origins
const corsOptions = {
  origin: 'https://cameras-toronto.vercel.app/', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
};

// Use the CORS middleware with the defined options
app.use(cors(corsOptions));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html')); 
});

// Example API endpoint (optional)
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the server!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
