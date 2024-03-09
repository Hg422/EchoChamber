const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('src')); // Serve static files from 'src'

const DATA_FILE = './data/json/users.json';

// Endpoint to get user data
app.get('/api/user', (req, res) => {
    fs.readFile(DATA_FILE, (err, data) => {
        if (err) {
            console.error(err)
            res.status(500).send('Error reading user data.');
            return;
        }
        res.json(JSON.parse(data));
    });
});

// Endpoint to update user data
app.post('/api/user', (req, res) => {
    const userData = JSON.stringify(req.body, null, 2); // Pretty print JSON
    fs.writeFile(DATA_FILE, userData, (err) => {
        if (err) {
            res.status(500).send('Error saving user data.');
            return;
        }
        res.send('User data updated successfully.');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});