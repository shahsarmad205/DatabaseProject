const API_URL = 'http://localhost:8080/api';

// ===== Utility Functions =====
function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'flex';
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function getStatusBadge(status) {
    const statusLower = (status || '').toLowerCase();
    if (statusLower.includes('pending')) return '<span class="badge badge-pending">Pending</span>';
    if (statusLower.includes('progress')) return '<span class="badge badge-progress">In Progress</span>';
    if (statusLower.includes('completed')) return '<span class="badge badge-completed">Completed</span>';
    if (statusLower.includes('cancelled')) return '<span class="badge badge-cancelled">Cancelled</span>';
    return `<span class="badge">${status || 'N/A'}</span>`;
}

function getPriorityBadge(priority) {
    const priorityLower = (priority || '').toLowerCase();
    if (priorityLower === 'urgent') return '<span class="badge badge-urgent">Urgent</span>';
    if (priorityLower === 'high') return '<span class="badge badge-high">High</span>';
    if (priorityLower === 'medium') return '<span class="badge badge-medium">Medium</span>';
    if (priorityLower === 'low') return '<span class="badge badge-low">Low</span>';
    return `<span class="badge">${priority || 'N/A'}</span>`;
}

function handleError(error, defaultMessage = 'An error occurred') {
    console.error('Error:', error);
    // Don't hide loading here - it's handled in finally block
    let message = defaultMessage;
    if (error.message) {
        message = error.message;
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
        message = 'Cannot connect to backend server. Make sure it\'s running on http://localhost:8080';
    }
    showNotification(message, 'error');
}

async function apiCall(url, options = {}) {
    try {
        showLoading();
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });

        if (!response.ok) {
            let errorMessage = `Server error (${response.status})`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorData.error || errorMessage;
            } catch (e) {
                // If we can't parse the error response, use status text
                errorMessage = response.statusText || errorMessage;
            }

            if (response.status === 500) {
                errorMessage = 'Server error: Check backend logs. Database might not be set up correctly.';
            }

            throw new Error(errorMessage);
        }

        const data = await response.json().catch(() => null);

        // Ensure we return null for non-array responses that might be errors
        if (data && typeof data === 'object' && !Array.isArray(data) && data.error) {
            throw new Error(data.error || data.message || 'Server returned an error object');
        }

        return data;
    } catch (error) {
        handleError(error, 'Failed to connect to server. Make sure the backend is running.');
        throw error;
    } finally {
        // Always hide loading, even if there's an error
        hideLoading();
    }
}

// ===== Navigation =====
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => {
        s.classList.remove('active');
        s.style.display = 'none';
    });

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    const targetSection = document.getElementById(section);
    if (targetSection) {
        targetSection.classList.add('active');
        targetSection.style.display = 'block';
    }

    const activeBtn = document.querySelector(`[data-section="${section}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    // Auto-load data when switching sections
    switch (section) {
        case 'buildings':
            loadBuildings();
            break;
        case 'units':
            loadUnits();
            break;
        case 'tenants':
            loadTenants();
            break;
        case 'leases':
            loadLeases();
            break;
        case 'maintenance':
            loadMaintenance();
            break;
    }
}

// ===== Buildings =====
async function loadBuildings() {
    const container = document.getElementById('buildingsList');
    if (!container) {
        console.error('buildingsList container not found');
        return;
    }

    try {
        const data = await apiCall(`${API_URL}/buildings`);

        // Check if data is an array - be very explicit
        if (data === null || data === undefined) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">⚠️</span>
                    <p>No data received from server. Please check that the backend is running.</p>
                </div>
            `;
            return;
        }

        if (!Array.isArray(data)) {
            console.error('loadBuildings: Expected array but got:', typeof data, data);
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">⚠️</span>
                    <p>Server returned unexpected data format. Check backend logs for errors.</p>
                    <p style="font-size: 0.875rem; margin-top: 0.5rem; color: var(--text-secondary);">
                        Received: ${typeof data}
                    </p>
                </div>
            `;
            return;
        }

        if (data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🏢</span>
                    <p>No buildings found. Add your first building to get started.</p>
                </div>
            `;
            return;
        }

        // Double-check that data is an array before proceeding
        if (!Array.isArray(data)) {
            console.error('Expected array but got:', typeof data, data);
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">⚠️</span>
                    <p>Unexpected data format received from server. Please check backend logs.</p>
                </div>
            `;
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(b => {
            html += `
                <tr>
                    <td>${b.id}</td>
                    <td><strong>${b.name || 'N/A'}</strong></td>
                    <td>${b.address || 'N/A'}</td>
                    <td>
                        <button class="btn btn-success" onclick="loadTenantsByBuilding(${b.id})">
                            👥 View Tenants
                        </button>
                        <button class="btn btn-danger" onclick="confirmDeleteBuilding(${b.id}, '${(b.name || '').replace(/'/g, "\\'")}')">
                            🗑️ Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        // Error already handled in apiCall, but show empty state
        const container = document.getElementById('buildingsList');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">⚠️</span>
                    <p>Unable to load buildings. Please check that the backend is running and the database is set up correctly.</p>
                </div>
            `;
        }
    }
}

function showBuildingForm() {
    document.getElementById('buildingForm').style.display = 'flex';
    document.getElementById('bName').value = '';
    document.getElementById('bAddress').value = '';
}

function closeBuildingForm() {
    document.getElementById('buildingForm').style.display = 'none';
}

async function saveBuilding() {
    const name = document.getElementById('bName').value.trim();
    const address = document.getElementById('bAddress').value.trim();

    if (!name || !address) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    try {
        await apiCall(`${API_URL}/buildings`, {
            method: 'POST',
            body: JSON.stringify({ name, address })
        });

        showNotification('Building added successfully!', 'success');
        closeBuildingForm();
        await loadBuildings();
    } catch (error) {
        // Error already handled
    }
}

function confirmDeleteBuilding(id, name) {
    if (confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
        deleteBuilding(id);
    }
}

async function deleteBuilding(id) {
    try {
        await apiCall(`${API_URL}/buildings/${id}`, { method: 'DELETE' });
        showNotification('Building deleted successfully', 'success');
        await loadBuildings();
    } catch (error) {
        // Error already handled
    }
}

async function loadTenantsByBuilding(buildingId) {
    try {
        const data = await apiCall(`${API_URL}/buildings/${buildingId}/tenants`);
        const container = document.getElementById('buildingsList');

        let html = container.innerHTML;
        html += `
            <div style="margin-top: 2rem; padding: 1.5rem; background: var(--background); border-radius: var(--radius-lg);">
                <h3 style="margin-bottom: 1rem;">Tenants in Building</h3>
        `;

        if (!data || !Array.isArray(data) || data.length === 0) {
            html += '<p style="color: var(--text-secondary);">No tenants found in this building.</p>';
        } else {
            html += `
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                        </tr>
                    </thead>
                    <tbody>
            `;
            data.forEach(t => {
                html += `
                    <tr>
                        <td>${t.id}</td>
                        <td><strong>${t.name || 'N/A'}</strong></td>
                        <td>${t.email || 'N/A'}</td>
                        <td>${t.phone || 'N/A'}</td>
                    </tr>
                `;
            });
            html += '</tbody></table>';
        }

        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        // Error already handled
    }
}

// ===== Units =====
async function loadUnits() {
    try {
        const data = await apiCall(`${API_URL}/apartment-units`);
        const container = document.getElementById('unitsList');

        if (!data || !Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🏠</span>
                    <p>No units found. Add your first unit to get started.</p>
                </div>
            `;
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Unit #</th>
                        <th>Bedrooms</th>
                        <th>Rent</th>
                        <th>Building ID</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(u => {
            html += `
                <tr>
                    <td>${u.id}</td>
                    <td><strong>${u.unitNumber || 'N/A'}</strong></td>
                    <td>${u.bedrooms || 0}</td>
                    <td>${formatCurrency(u.rent || 0)}</td>
                    <td>${u.building?.id || 'N/A'}</td>
                    <td>
                        <button class="btn btn-danger" onclick="confirmDeleteUnit(${u.id}, '${(u.unitNumber || '').replace(/'/g, "\\'")}')">
                            🗑️ Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        // Error already handled
    }
}

function showUnitForm() {
    document.getElementById('unitForm').style.display = 'flex';
    document.getElementById('uNumber').value = '';
    document.getElementById('uBedrooms').value = '';
    document.getElementById('uRent').value = '';
    document.getElementById('uBuildingId').value = '';
}

function closeUnitForm() {
    document.getElementById('unitForm').style.display = 'none';
}

async function saveUnit() {
    const unitNumber = document.getElementById('uNumber').value.trim();
    const bedrooms = parseInt(document.getElementById('uBedrooms').value);
    const rent = parseFloat(document.getElementById('uRent').value);
    const buildingId = parseInt(document.getElementById('uBuildingId').value);

    if (!unitNumber || isNaN(bedrooms) || isNaN(rent) || isNaN(buildingId)) {
        showNotification('Please fill in all required fields with valid values', 'error');
        return;
    }

    try {
        await apiCall(`${API_URL}/apartment-units`, {
            method: 'POST',
            body: JSON.stringify({
                unitNumber,
                bedrooms,
                rent,
                building: { id: buildingId }
            })
        });

        showNotification('Unit added successfully!', 'success');
        closeUnitForm();
        await loadUnits();
    } catch (error) {
        // Error already handled
    }
}

function confirmDeleteUnit(id, unitNumber) {
    if (confirm(`Are you sure you want to delete unit "${unitNumber}"? This action cannot be undone.`)) {
        deleteUnit(id);
    }
}

async function deleteUnit(id) {
    try {
        await apiCall(`${API_URL}/apartment-units/${id}`, { method: 'DELETE' });
        showNotification('Unit deleted successfully', 'success');
        await loadUnits();
    } catch (error) {
        // Error already handled
    }
}

// ===== Tenants =====
async function loadTenants() {
    try {
        const data = await apiCall(`${API_URL}/tenants`);
        const container = document.getElementById('tenantsList');

        if (!data || !Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">👥</span>
                    <p>No tenants found. Add your first tenant to get started.</p>
                </div>
            `;
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(t => {
            html += `
                <tr>
                    <td>${t.id}</td>
                    <td><strong>${t.name || 'N/A'}</strong></td>
                    <td>${t.email || 'N/A'}</td>
                    <td>${t.phone || 'N/A'}</td>
                    <td>
                        <button class="btn btn-danger" onclick="confirmDeleteTenant(${t.id}, '${(t.name || '').replace(/'/g, "\\'")}')">
                            🗑️ Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        // Error already handled
        const container = document.getElementById('tenantsList');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">⚠️</span>
                    <p>Unable to load tenants. Please check that the backend is running and the database is set up correctly.</p>
                </div>
            `;
        }
    }
}

function showTenantForm() {
    document.getElementById('tenantForm').style.display = 'flex';
    document.getElementById('tName').value = '';
    document.getElementById('tEmail').value = '';
    document.getElementById('tPhone').value = '';
}

function closeTenantForm() {
    document.getElementById('tenantForm').style.display = 'none';
}

async function saveTenant() {
    const name = document.getElementById('tName').value.trim();
    const email = document.getElementById('tEmail').value.trim();
    const phone = document.getElementById('tPhone').value.trim();

    if (!name || !email || !phone) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    if (!email.includes('@')) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }

    try {
        await apiCall(`${API_URL}/tenants`, {
            method: 'POST',
            body: JSON.stringify({ name, email, phone })
        });

        showNotification('Tenant added successfully!', 'success');
        closeTenantForm();
        await loadTenants();
    } catch (error) {
        // Error already handled
    }
}

function confirmDeleteTenant(id, name) {
    if (confirm(`Are you sure you want to delete tenant "${name}"? This action cannot be undone.`)) {
        deleteTenant(id);
    }
}

async function deleteTenant(id) {
    try {
        await apiCall(`${API_URL}/tenants/${id}`, { method: 'DELETE' });
        showNotification('Tenant deleted successfully', 'success');
        await loadTenants();
    } catch (error) {
        // Error already handled
    }
}

// ===== Leases =====
async function loadLeases() {
    try {
        const data = await apiCall(`${API_URL}/leases`);
        const container = document.getElementById('leasesList');

        if (!data || !Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📄</span>
                    <p>No leases found. Add your first lease to get started.</p>
                </div>
            `;
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Monthly Rent</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(l => {
            const statusBadge = l.isActive
                ? '<span class="badge badge-active">Active</span>'
                : '<span class="badge badge-inactive">Inactive</span>';

            html += `
                <tr>
                    <td>${l.id}</td>
                    <td>${formatDate(l.startDate)}</td>
                    <td>${formatDate(l.endDate)}</td>
                    <td>${formatCurrency(l.monthlyRent || 0)}</td>
                    <td>${statusBadge}</td>
                    <td>
                        <button class="btn btn-danger" onclick="confirmDeleteLease(${l.id})">
                            🗑️ Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        // Error already handled
        const container = document.getElementById('leasesList');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">⚠️</span>
                    <p>Unable to load leases. Please check that the backend is running and the database is set up correctly.</p>
                </div>
            `;
        }
    }
}

async function loadActiveLeases() {
    try {
        const data = await apiCall(`${API_URL}/leases/active`);
        const container = document.getElementById('leasesList');

        if (!data || !Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">✅</span>
                    <p>No active leases found.</p>
                </div>
            `;
            return;
        }

        let html = `
            <div style="margin-bottom: 1rem; padding: 1rem; background: var(--background); border-radius: var(--radius);">
                <strong>Active Leases (${data.length})</strong>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Monthly Rent</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(l => {
            html += `
                <tr>
                    <td>${l.id}</td>
                    <td>${formatDate(l.startDate)}</td>
                    <td>${formatDate(l.endDate)}</td>
                    <td>${formatCurrency(l.monthlyRent || 0)}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        // Error already handled
    }
}

function showLeaseForm() {
    document.getElementById('leaseForm').style.display = 'flex';
    document.getElementById('lStartDate').value = '';
    document.getElementById('lEndDate').value = '';
    document.getElementById('lRent').value = '';
    document.getElementById('lTenantId').value = '';
    document.getElementById('lUnitId').value = '';
    document.getElementById('lActive').checked = true;
}

function closeLeaseForm() {
    document.getElementById('leaseForm').style.display = 'none';
}

async function saveLease() {
    const startDate = document.getElementById('lStartDate').value;
    const endDate = document.getElementById('lEndDate').value;
    const monthlyRent = parseFloat(document.getElementById('lRent').value);
    const isActive = document.getElementById('lActive').checked;
    const tenantId = parseInt(document.getElementById('lTenantId').value);
    const unitId = parseInt(document.getElementById('lUnitId').value);

    if (!startDate || !endDate || isNaN(monthlyRent) || isNaN(tenantId) || isNaN(unitId)) {
        showNotification('Please fill in all required fields with valid values', 'error');
        return;
    }

    if (new Date(endDate) < new Date(startDate)) {
        showNotification('End date must be after start date', 'error');
        return;
    }

    try {
        await apiCall(`${API_URL}/leases`, {
            method: 'POST',
            body: JSON.stringify({
                startDate,
                endDate,
                monthlyRent,
                isActive,
                tenant: { id: tenantId },
                apartmentUnit: { id: unitId }
            })
        });

        showNotification('Lease added successfully!', 'success');
        closeLeaseForm();
        await loadLeases();
    } catch (error) {
        // Error already handled
    }
}

function confirmDeleteLease(id) {
    if (confirm('Are you sure you want to delete this lease? This action cannot be undone.')) {
        deleteLease(id);
    }
}

async function deleteLease(id) {
    try {
        await apiCall(`${API_URL}/leases/${id}`, { method: 'DELETE' });
        showNotification('Lease deleted successfully', 'success');
        await loadLeases();
    } catch (error) {
        // Error already handled
    }
}

// ===== Maintenance =====
async function loadMaintenance() {
    try {
        const data = await apiCall(`${API_URL}/maintenance`);
        const container = document.getElementById('maintenanceList');

        if (!data || !Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🔧</span>
                    <p>No maintenance requests found. Add your first request to get started.</p>
                </div>
            `;
            return;
        }

        let html = `
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(m => {
            html += `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.description || 'N/A'}</td>
                    <td>${getStatusBadge(m.status)}</td>
                    <td>${getPriorityBadge(m.priority)}</td>
                    <td>${formatDate(m.createdDate)}</td>
                    <td>
                        <button class="btn btn-danger" onclick="confirmDeleteMaintenance(${m.id})">
                            🗑️ Delete
                        </button>
                    </td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        // Error already handled
        const container = document.getElementById('maintenanceList');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">⚠️</span>
                    <p>Unable to load maintenance requests. Please check that the backend is running and the database is set up correctly.</p>
                </div>
            `;
        }
    }
}

async function filterByStatus() {
    const status = document.getElementById('statusFilter').value.trim();
    if (!status) {
        showNotification('Please enter a status to filter by', 'error');
        return;
    }

    try {
        const data = await apiCall(`${API_URL}/maintenance/status/${status}`);
        const container = document.getElementById('maintenanceList');

        if (!data || !Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🔍</span>
                    <p>No maintenance requests found with status "${status}".</p>
                </div>
            `;
            return;
        }

        let html = `
            <div style="margin-bottom: 1rem; padding: 1rem; background: var(--background); border-radius: var(--radius);">
                <strong>Filtered by Status: ${status} (${data.length} results)</strong>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created Date</th>
                    </tr>
                </thead>
                    <tbody>
        `;

        data.forEach(m => {
            html += `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.description || 'N/A'}</td>
                    <td>${getStatusBadge(m.status)}</td>
                    <td>${getPriorityBadge(m.priority)}</td>
                    <td>${formatDate(m.createdDate)}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        // Error already handled
    }
}

async function filterByPriority() {
    const priority = document.getElementById('priorityFilter').value.trim();
    if (!priority) {
        showNotification('Please enter a priority to filter by', 'error');
        return;
    }

    try {
        const data = await apiCall(`${API_URL}/maintenance/priority/${priority}`);
        const container = document.getElementById('maintenanceList');

        if (!data || !Array.isArray(data) || data.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">🔍</span>
                    <p>No maintenance requests found with priority "${priority}".</p>
                </div>
            `;
            return;
        }

        let html = `
            <div style="margin-bottom: 1rem; padding: 1rem; background: var(--background); border-radius: var(--radius);">
                <strong>Filtered by Priority: ${priority} (${data.length} results)</strong>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Status</th>
                        <th>Priority</th>
                        <th>Created Date</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach(m => {
            html += `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.description || 'N/A'}</td>
                    <td>${getStatusBadge(m.status)}</td>
                    <td>${getPriorityBadge(m.priority)}</td>
                    <td>${formatDate(m.createdDate)}</td>
                </tr>
            `;
        });

        html += '</tbody></table>';
        container.innerHTML = html;
    } catch (error) {
        // Error already handled
    }
}

function showMaintenanceForm() {
    document.getElementById('maintenanceForm').style.display = 'flex';
    document.getElementById('mDesc').value = '';
    document.getElementById('mStatus').value = '';
    document.getElementById('mPriority').value = '';
    document.getElementById('mUnitId').value = '';
    document.getElementById('mTenantId').value = '';
}

function closeMaintenanceForm() {
    document.getElementById('maintenanceForm').style.display = 'none';
}

async function saveMaintenance() {
    const description = document.getElementById('mDesc').value.trim();
    const status = document.getElementById('mStatus').value;
    const priority = document.getElementById('mPriority').value;
    const unitId = parseInt(document.getElementById('mUnitId').value);
    const tenantId = parseInt(document.getElementById('mTenantId').value);

    if (!description || !status || !priority || isNaN(unitId) || isNaN(tenantId)) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    try {
        await apiCall(`${API_URL}/maintenance`, {
            method: 'POST',
            body: JSON.stringify({
                description,
                status,
                priority,
                createdDate: new Date().toISOString().split('T')[0],
                apartmentUnit: { id: unitId },
                tenant: { id: tenantId }
            })
        });

        showNotification('Maintenance request added successfully!', 'success');
        closeMaintenanceForm();
        await loadMaintenance();
    } catch (error) {
        // Error already handled
    }
}

function confirmDeleteMaintenance(id) {
    if (confirm('Are you sure you want to delete this maintenance request? This action cannot be undone.')) {
        deleteMaintenance(id);
    }
}

async function deleteMaintenance(id) {
    try {
        await apiCall(`${API_URL}/maintenance/${id}`, { method: 'DELETE' });
        showNotification('Maintenance request deleted successfully', 'success');
        await loadMaintenance();
    } catch (error) {
        // Error already handled
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Show buildings section by default (this will auto-load data)
    showSection('buildings');

    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Test backend connection on load
    fetch(`${API_URL}/buildings`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Backend is not responding correctly');
            }
        })
        .catch(error => {
            console.warn('Backend connection test failed:', error);
            // Don't show notification on initial load, just log it
        });
});
