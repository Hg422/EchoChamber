// const express = require('express');
// const fs = require('fs');
// const bodyParser = require('body-parser');
// const app = express();
// const PORT = 3000;
//
// app.use(bodyParser.json());
// app.use(express.static('src')); // Serve static files from 'src'
//
// const DATA_FILE = '../data/json/users.json';
//
// // Endpoint to get user data
// app.get('/api/user', (req, res) => {
//     fs.readFile(DATA_FILE, (err, data) => {
//         if (err) {
//             res.status(500).send('Error reading user data.');
//             return;
//         }
//         res.json(JSON.parse(data));
//     });
// });
//
// // Endpoint to update user data
// app.post('/api/user', (req, res) => {
//     const userData = JSON.stringify(req.body, null, 2); // Pretty print JSON
//     fs.writeFile(DATA_FILE, userData, (err) => {
//         if (err) {
//             res.status(500).send('Error saving user data.');
//             return;
//         }
//         res.send('User data updated successfully.');
//     });
// });
//
// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });

document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.querySelector('.profile-button');

    profileButton.addEventListener('click', () => {
        // Redirect to the profile editing page
        window.location.href = 'profile.html';
    });
});

document.getElementById('profileForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const userData = {
        uid: 1, // This should ideally be retrieved dynamically
        name: document.getElementById('name').value,
        yearOfGrade: document.getElementById('yearOfGrade').value,
        major: document.getElementById('major').value,
        email: document.getElementById('email').value,
        interests: document.getElementById('interests').value.split(',').map(interest => interest.trim())
    };

    // Fetch API to send the updated user data to the server
    fetch('/api/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    })
        .then(response => response.text())
        .then(data => {
            alert('Profile updated successfully!');
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

document.getElementById('backButton').addEventListener('click', function() {
    window.location.href = 'index.html';
});