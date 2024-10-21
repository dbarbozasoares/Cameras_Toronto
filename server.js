// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const https = require('https');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// CORS setup
const corsOptions = {
  origin: '*', // Allow all origins for simplicity, adjust as needed
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: false,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Serve the main HTML page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Endpoint to fetch data from an external API and write to JSON
app.get('/api/data/cameras', (req, res) => {
  const apiUrl = 'https://511on.ca/api/v2/get/cameras'; // Replace with your actual API URL

  https.get(apiUrl, (response) => {
    let data = '';

    // Collect the data chunks
    response.on('data', (chunk) => {
      data += chunk;
    });

    // Handle the end of the response
    response.on('end', () => {
      try {
        const jsonData = JSON.parse(data); // Parse the JSON data

        // Write the fetched data to a JSON file
        fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ message: 'Error writing to file' });
          }
          res.json(jsonData);
        });
      } catch (error) {
        console.error('Error parsing JSON:', error);
        res.status(500).json({ message: 'Error parsing JSON' });
      }
    });
  }).on('error', (error) => {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Error fetching data' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
