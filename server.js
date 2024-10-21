// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
// Use the CORS middleware
app.use(cors());

// Configure CORS for specific origins
const corsOptions = {
  origin: 'https://cameras-toronto.vercel.app/', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow credentials
};
app.use(cors(corsOptions));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); 
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
