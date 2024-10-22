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

// Proxy endpoint to fetch data from the external API
app.get('/api/data/cameras', (req, res) => {
    console.log("Inside api cameras route");
    const apiUrl = 'https://511on.ca/api/v2/get/cameras';
    fetch(apiUrl).then((response) => {
        if(!response.ok){
            throw new Error("ERROR FEIOOO");
        }
        return response.json();
    }).then((json) => {
        res.json(json);
    }).catch((error) => {
        console.log(error);
    })
    
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
