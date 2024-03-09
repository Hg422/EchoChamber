

document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/user?uid=1') // Adjust this URL as needed to match your API.
        .then(response => response.json())
        .then(user => {
            const profileInfoDiv = document.querySelector('.profile-info');
            profileInfoDiv.innerHTML = `
                <p>Name: ${user.name}</p>
                <p>Year of Grade: ${user.yearOfGrade}</p>
                <p>Major: ${user.major}</p>
                <p>Interests: ${user.interests.join(', ')}</p>
            `;
        })
        .catch(error => console.error('Error fetching user data:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    const profileButton = document.querySelector('.profile-button');

    profileButton.addEventListener('click', () => {
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