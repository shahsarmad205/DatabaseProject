const API_URL = 'http://localhost:8080/api';

function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(section).style.display = 'block';
}

// Buildings
function loadBuildings() {
    fetch(`${API_URL}/buildings`)
        .then(r => r.json())
        .then(data => {
            let html = '<table><tr><th>ID</th><th>Name</th><th>Address</th><th>Actions</th></tr>';
            data.forEach(b => {
                html += `<tr><td>${b.id}</td><td>${b.name}</td><td>${b.address}</td>
                    <td><button onclick="deleteBuilding(${b.id})">Delete</button>
                    <button onclick="loadTenantsByBuilding(${b.id})">View Tenants</button></td></tr>`;
            });
            html += '</table>';
            document.getElementById('buildingsList').innerHTML = html;
        });
}

function showBuildingForm() {
    document.getElementById('buildingForm').style.display = 'block';
}

function saveBuilding() {
    const building = {
        name: document.getElementById('bName').value,
        address: document.getElementById('bAddress').value
    };
    fetch(`${API_URL}/buildings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(building)
    }).then(() => {
        loadBuildings();
        document.getElementById('buildingForm').style.display = 'none';
    });
}

function deleteBuilding(id) {
    fetch(`${API_URL}/buildings/${id}`, {method: 'DELETE'}).then(() => loadBuildings());
}

function loadTenantsByBuilding(buildingId) {
    fetch(`${API_URL}/buildings/${buildingId}/tenants`)
        .then(r => r.json())
        .then(data => {
            let html = '<h3>Tenants in Building</h3><table><tr><th>ID</th><th>Name</th><th>Email</th></tr>';
            data.forEach(t => {
                html += `<tr><td>${t.id}</td><td>${t.name}</td><td>${t.email}</td></tr>`;
            });
            html += '</table>';
            document.getElementById('buildingsList').innerHTML += html;
        });
}

// Units
function loadUnits() {
    fetch(`${API_URL}/apartment-units`)
        .then(r => r.json())
        .then(data => {
            let html = '<table><tr><th>ID</th><th>Unit #</th><th>Bedrooms</th><th>Rent</th></tr>';
            data.forEach(u => {
                html += `<tr><td>${u.id}</td><td>${u.unitNumber}</td><td>${u.bedrooms}</td><td>${u.rent}</td>
                    <td><button onclick="deleteUnit(${u.id})">Delete</button></td></tr>`;
            });
            html += '</table>';
            document.getElementById('unitsList').innerHTML = html;
        });
}

function showUnitForm() {
    document.getElementById('unitForm').style.display = 'block';
}

function saveUnit() {
    const unit = {
        unitNumber: document.getElementById('uNumber').value,
        bedrooms: parseInt(document.getElementById('uBedrooms').value),
        rent: parseFloat(document.getElementById('uRent').value),
        building: {id: parseInt(document.getElementById('uBuildingId').value)}
    };
    fetch(`${API_URL}/apartment-units`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(unit)
    }).then(() => {
        loadUnits();
        document.getElementById('unitForm').style.display = 'none';
    });
}

function deleteUnit(id) {
    fetch(`${API_URL}/apartment-units/${id}`, {method: 'DELETE'}).then(() => loadUnits());
}

// Tenants
function loadTenants() {
    fetch(`${API_URL}/tenants`)
        .then(r => r.json())
        .then(data => {
            let html = '<table><tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th></tr>';
            data.forEach(t => {
                html += `<tr><td>${t.id}</td><td>${t.name}</td><td>${t.email}</td><td>${t.phone}</td>
                    <td><button onclick="deleteTenant(${t.id})">Delete</button></td></tr>`;
            });
            html += '</table>';
            document.getElementById('tenantsList').innerHTML = html;
        });
}

function showTenantForm() {
    document.getElementById('tenantForm').style.display = 'block';
}

function saveTenant() {
    const tenant = {
        name: document.getElementById('tName').value,
        email: document.getElementById('tEmail').value,
        phone: document.getElementById('tPhone').value
    };
    fetch(`${API_URL}/tenants`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(tenant)
    }).then(() => {
        loadTenants();
        document.getElementById('tenantForm').style.display = 'none';
    });
}

function deleteTenant(id) {
    fetch(`${API_URL}/tenants/${id}`, {method: 'DELETE'}).then(() => loadTenants());
}

// Leases
function loadLeases() {
    fetch(`${API_URL}/leases`)
        .then(r => r.json())
        .then(data => {
            let html = '<table><tr><th>ID</th><th>Start</th><th>End</th><th>Rent</th><th>Active</th></tr>';
            data.forEach(l => {
                html += `<tr><td>${l.id}</td><td>${l.startDate}</td><td>${l.endDate}</td>
                    <td>${l.monthlyRent}</td><td>${l.isActive}</td>
                    <td><button onclick="deleteLease(${l.id})">Delete</button></td></tr>`;
            });
            html += '</table>';
            document.getElementById('leasesList').innerHTML = html;
        });
}

function loadActiveLeases() {
    fetch(`${API_URL}/leases/active`)
        .then(r => r.json())
        .then(data => {
            let html = '<h3>Active Leases</h3><table><tr><th>ID</th><th>Start</th><th>End</th><th>Rent</th></tr>';
            data.forEach(l => {
                html += `<tr><td>${l.id}</td><td>${l.startDate}</td><td>${l.endDate}</td><td>${l.monthlyRent}</td></tr>`;
            });
            html += '</table>';
            document.getElementById('leasesList').innerHTML = html;
        });
}

function showLeaseForm() {
    document.getElementById('leaseForm').style.display = 'block';
}

function saveLease() {
    const lease = {
        startDate: document.getElementById('lStartDate').value,
        endDate: document.getElementById('lEndDate').value,
        monthlyRent: parseFloat(document.getElementById('lRent').value),
        isActive: document.getElementById('lActive').checked,
        tenant: {id: parseInt(document.getElementById('lTenantId').value)},
        apartmentUnit: {id: parseInt(document.getElementById('lUnitId').value)}
    };
    fetch(`${API_URL}/leases`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(lease)
    }).then(() => {
        loadLeases();
        document.getElementById('leaseForm').style.display = 'none';
    });
}

function deleteLease(id) {
    fetch(`${API_URL}/leases/${id}`, {method: 'DELETE'}).then(() => loadLeases());
}

// Maintenance
function loadMaintenance() {
    fetch(`${API_URL}/maintenance`)
        .then(r => r.json())
        .then(data => {
            let html = '<table><tr><th>ID</th><th>Description</th><th>Status</th><th>Priority</th></tr>';
            data.forEach(m => {
                html += `<tr><td>${m.id}</td><td>${m.description}</td><td>${m.status}</td><td>${m.priority}</td>
                    <td><button onclick="deleteMaintenance(${m.id})">Delete</button></td></tr>`;
            });
            html += '</table>';
            document.getElementById('maintenanceList').innerHTML = html;
        });
}

function filterByStatus() {
    const status = document.getElementById('statusFilter').value;
    fetch(`${API_URL}/maintenance/status/${status}`)
        .then(r => r.json())
        .then(data => {
            let html = `<h3>Filtered by Status: ${status}</h3><table><tr><th>ID</th><th>Description</th><th>Status</th><th>Priority</th></tr>`;
            data.forEach(m => {
                html += `<tr><td>${m.id}</td><td>${m.description}</td><td>${m.status}</td><td>${m.priority}</td></tr>`;
            });
            html += '</table>';
            document.getElementById('maintenanceList').innerHTML = html;
        });
}

function filterByPriority() {
    const priority = document.getElementById('priorityFilter').value;
    fetch(`${API_URL}/maintenance/priority/${priority}`)
        .then(r => r.json())
        .then(data => {
            let html = `<h3>Filtered by Priority: ${priority}</h3><table><tr><th>ID</th><th>Description</th><th>Status</th><th>Priority</th></tr>`;
            data.forEach(m => {
                html += `<tr><td>${m.id}</td><td>${m.description}</td><td>${m.status}</td><td>${m.priority}</td></tr>`;
            });
            html += '</table>';
            document.getElementById('maintenanceList').innerHTML = html;
        });
}

function showMaintenanceForm() {
    document.getElementById('maintenanceForm').style.display = 'block';
}

function saveMaintenance() {
    const request = {
        description: document.getElementById('mDesc').value,
        status: document.getElementById('mStatus').value,
        priority: document.getElementById('mPriority').value,
        createdDate: new Date().toISOString().split('T')[0],
        apartmentUnit: {id: parseInt(document.getElementById('mUnitId').value)},
        tenant: {id: parseInt(document.getElementById('mTenantId').value)}
    };
    fetch(`${API_URL}/maintenance`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(request)
    }).then(() => {
        loadMaintenance();
        document.getElementById('maintenanceForm').style.display = 'none';
    });
}

function deleteMaintenance(id) {
    fetch(`${API_URL}/maintenance/${id}`, {method: 'DELETE'}).then(() => loadMaintenance());
}




