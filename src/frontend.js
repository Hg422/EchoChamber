
function loginBtnHandler() {
	const staffRegex = /@staff\.ubc\.ca$/;
	const studentRegex = /@student\.ubc\.ca$/;
	const usernameInput = document.getElementById('username').value;

	if (staffRegex.test(usernameInput)) {
		sessionStorage.setItem("studentCheck", "false");
		window.location.href = "search.html";
	} else if(studentRegex.test(usernameInput)) {
		sessionStorage.setItem("studentCheck", "true");
		window.location.href = "search.html";
	} else {
		alert('Invalid username format');
		window.location.href = "index.html";
	}
}


document.addEventListener('DOMContentLoaded', function() {
	const uploadButton = document.getElementById('uploadButton');
	uploadButton.addEventListener('click', function() {
		const fileInput = document.getElementById('fileInput');
		const file = fileInput.files[0];
		const datasetName = document.getElementById('datasetName').value;
		const dataTypeSections = document.getElementById('dataTypeSections').checked;
		const dataTypeRooms = document.getElementById('dataTypeRooms').checked;

		if(sessionStorage.getItem("studentCheck") === "true") {
			alert("Permission Denied: Require higher credential")
			return;
		}

		if (!file) {
			alert('Please select a file to upload');
			return;
		}

		if (!datasetName) {
			alert('Please enter a name for your dataset');
			return;
		}

		let datasetKind = dataTypeSections ? "sections" : dataTypeRooms ? "rooms" : null;

		if (!datasetKind) {
			alert('Please select a data type');
			return;
		}

		const url = `/dataset/${datasetName}/${datasetKind}`;

		const formData = new FormData();
		formData.append('dataset', file);

		fetch(url, {
			method: 'PUT',
			body: file, // Directly sending the file as binary data
			headers: {
				'Content-Type': 'application/x-zip-compressed' // Indicating that the content is a raw binary stream
			}
		})
			.then(response => {
				if (!response.ok) {
					return response.json().then(data => {
						throw new Error(data.error || 'Upload failed');
					});
				}
				return response.json();
			})
			.then(data => {
				alert('Successfully uploaded!');
			})
			.catch(error => {
				console.error('Error:', error);
				// alert(`Error: ${error.message}`);
				alert("upload failed, please check your zip file format");
			});
	});
});

document.addEventListener('DOMContentLoaded', function() {
	fetchDatasets();
	const searchButton = document.getElementById('searchButton');
	searchButton.addEventListener('click', function() {
		const selectedDataset = document.getElementById('datasetSelect').value;
		const dept = document.getElementById('deptInput').value.toLowerCase();
		const courseId = document.getElementById('courseIdInput').value;
		const checkboxes = document.querySelectorAll('input[name="columns"]:checked');
		let columns = Array.from(checkboxes).map(cb => `${selectedDataset}_${cb.value}`);

		const query =
			{
				WHERE: {
					AND: [
						{IS: { [`${selectedDataset}_dept`]: dept } },
						{IS: { [`${selectedDataset}_id`]: courseId } }
					]
				},
				OPTIONS: {
					COLUMNS: columns
				}
			};
		fetch('/query', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(query)
		})
			.then(response => {
				if (!response.ok) {
					throw new Error('Query failed');
				}
				return response.json();
			})
			.then(data => {
				console.log(data.result);
				if(data.result.length === 0) {
					alert("You have enter an invalid/ unavailable course id");
				}
				displayResults(data.result);
			})
			.catch(error => {
				// alert('Error: ' + error.message);
				alert("You have enter an invalid/ unavailable course id");
			});
	});
});

function displayResults(results) {
	const tableHeader = document.getElementById('resultsTableHeader');
	const tableBody = document.getElementById('resultsTableBody');
	const resultsTable = document.getElementById('resultsTable');

	// Clear existing table data
	tableHeader.innerHTML = '';
	tableBody.innerHTML = '';

	if (results.length > 0) {
		// Create header row
		Object.keys(results[0]).forEach(key => {
			let headerCell = document.createElement('th');
			headerCell.textContent = key;
			tableHeader.appendChild(headerCell);
		});

		// Populate table rows
		results.forEach(row => {
			let tr = document.createElement('tr');
			Object.values(row).forEach(value => {
				let td = document.createElement('td');
				td.textContent = JSON.stringify(value);
				tr.appendChild(td);
			});
			tableBody.appendChild(tr);
		});

		resultsTable.style.display = 'table';
	} else {
		resultsTable.style.display = 'none';
	}
}

function fetchDatasets() {
	fetch('/datasets')
		.then(response => response.json())
		.then(data => {
			populateDatasetDropdown(data.result);
		})
		.catch(error => {
			console.error('Error fetching datasets:', error);
			// alert('Error fetching dataset list: ' + error.message);
		});
}

function populateDatasetDropdown(datasets) {
	const select = document.getElementById('datasetSelect');
	datasets.forEach(dataset => {
		let option = document.createElement('option');
		option.value = dataset.id;
		option.textContent = dataset.id;
		select.appendChild(option);
	});
}

function deleteDataset() {
	if(sessionStorage.getItem("studentCheck") === "true") {
		alert("Permission Denied: Require higher credential");
		return;
	}
	const dropdown = document.getElementById("datasetSelect");
	const selectedIndex = dropdown.selectedIndex
	const id = dropdown.value;
	if (selectedIndex !== -1) {
		dropdown.remove(selectedIndex);
	} else {
		alert("No option selected");
	}
	const url = `/dataset/${id}`;
	console.log(url);
	fetch(url, {
		method:"DELETE"
	})
		.then(response => {
			if (!response.ok) {
				throw new Error('Network response was not ok');
			}
			return response.json();
		})
		.then(data => {
			alert("Successfully deleted: " + data.result);
		})
		.catch(error => {
			console.error('Error deleting datasets: ', error);
			alert('Error deleting datasets: ' + error.message);
		});
}

function redirectToLogin() {
	// Redirect to the login page (replace with the actual path or URL)
	window.location.href = 'index.html';
}

function redirectCreateEvent() {
	// Redirect to the login page (replace with the actual path or URL)
	window.location.href = 'index.html';
}

function redirectToSearch() {
	// Redirect to the login page (replace with the actual path or URL)
	window.location.href = 'search.html';
}
