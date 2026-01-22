// Reports Management JavaScript

async function loadPatientReport() {
    try {
        const response = await fetch('/api/reports/patients');
        const result = await response.json();

        if (result.success) {
            displayPatientReport(result.data);
        } else {
            showNotification('Failed to load patient report', 'error');
        }
    } catch (error) {
        showNotification('An error occurred: ' + error.message, 'error');
    }
}

async function loadDoctorReport() {
    try {
        const response = await fetch('/api/reports/doctors');
        const result = await response.json();

        if (result.success) {
            displayDoctorReport(result.data);
        } else {
            showNotification('Failed to load doctor report', 'error');
        }
    } catch (error) {
        showNotification('An error occurred: ' + error.message, 'error');
    }
}

async function loadMedicineReport() {
    try {
        const response = await fetch('/api/reports/medicines');
        const result = await response.json();

        if (result.success) {
            displayMedicineReport(result.data);
        } else {
            showNotification('Failed to load medicine report', 'error');
        }
    } catch (error) {
        showNotification('An error occurred: ' + error.message, 'error');
    }
}

async function loadAllReports() {
    try {
        const [patientsRes, doctorsRes, medicinesRes] = await Promise.all([
            fetch('/api/reports/patients'),
            fetch('/api/reports/doctors'),
            fetch('/api/reports/medicines')
        ]);

        const patients = await patientsRes.json();
        const doctors = await doctorsRes.json();
        const medicines = await medicinesRes.json();

        if (patients.success && doctors.success && medicines.success) {
            displayCompleteReport(patients.data, doctors.data, medicines.data);
        } else {
            showNotification('Failed to load complete report', 'error');
        }
    } catch (error) {
        showNotification('An error occurred: ' + error.message, 'error');
    }
}

function displayPatientReport(patients) {
    const container = document.getElementById('reportContainer');
    const inPatients = patients.filter(p => p.patient_type === 'In-Patient');
    const outPatients = patients.filter(p => p.patient_type === 'Out-Patient');

    container.innerHTML = `
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Patient Report</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <span class="badge badge-primary">${patients.length} Total</span>
                    <span class="badge badge-success">${inPatients.length} In-Patient</span>
                    <span class="badge badge-info">${outPatients.length} Out-Patient</span>
                </div>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Patient ID</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Blood Group</th>
                                <th>Type</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${patients.map(p => `
                                <tr>
                                    <td><strong>${p.patient_id}</strong></td>
                                    <td>${p.name}</td>
                                    <td>${p.phone}</td>
                                    <td>${p.blood_group}</td>
                                    <td><span class="badge ${p.patient_type === 'In-Patient' ? 'badge-primary' : 'badge-success'}">${p.patient_type}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function displayDoctorReport(doctors) {
    const container = document.getElementById('reportContainer');

    container.innerHTML = `
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Doctor Report</h2>
                <span class="badge badge-primary">${doctors.length} Total</span>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Doctor ID</th>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Timing</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${doctors.map(d => `
                                <tr>
                                    <td><strong>${d.doctor_id}</strong></td>
                                    <td>${d.name}</td>
                                    <td><span class="badge badge-success">${d.specialization}</span></td>
                                    <td>${d.timing}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function displayMedicineReport(medicines) {
    const container = document.getElementById('reportContainer');
    const lowStock = medicines.filter(m => m.quantity < 10);
    const mediumStock = medicines.filter(m => m.quantity >= 10 && m.quantity < 50);
    const inStock = medicines.filter(m => m.quantity >= 50);

    container.innerHTML = `
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Medicine Stock Report</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <span class="badge badge-primary">${medicines.length} Total</span>
                    <span class="badge badge-danger">${lowStock.length} Low Stock</span>
                    <span class="badge badge-warning">${mediumStock.length} Medium</span>
                    <span class="badge badge-success">${inStock.length} In Stock</span>
                </div>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>Medicine ID</th>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${medicines.map(m => `
                                <tr>
                                    <td><strong>${m.medicine_id}</strong></td>
                                    <td>${m.name}</td>
                                    <td><span class="badge ${m.quantity < 10 ? 'badge-danger' : (m.quantity < 50 ? 'badge-warning' : 'badge-success')}">${m.quantity}</span></td>
                                    <td>₹${m.price}</td>
                                    <td>${m.expiry_date}</td>
                                    <td><span class="badge ${m.quantity < 10 ? 'badge-danger' : (m.quantity < 50 ? 'badge-warning' : 'badge-success')}">${m.quantity < 10 ? 'Low Stock' : (m.quantity < 50 ? 'Medium' : 'In Stock')}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function displayCompleteReport(patients, doctors, medicines) {
    const container = document.getElementById('reportContainer');

    container.innerHTML = `
        <div style="display: grid; gap: 2rem;">
            <!-- Summary Statistics -->
            <div class="content-card">
                <div class="card-header">
                    <h2 class="card-title">Complete System Report</h2>
                </div>
                <div class="card-body">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-icon">👥</div>
                            <div class="stat-label">Total Patients</div>
                            <div class="stat-value">${patients.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">👨‍⚕️</div>
                            <div class="stat-label">Total Doctors</div>
                            <div class="stat-value">${doctors.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">💊</div>
                            <div class="stat-label">Total Medicines</div>
                            <div class="stat-value">${medicines.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon">📊</div>
                            <div class="stat-label">Total Records</div>
                            <div class="stat-value">${patients.length + doctors.length + medicines.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Patient Summary -->
            <div class="content-card">
                <div class="card-header">
                    <h2 class="card-title">Patient Summary</h2>
                </div>
                <div class="card-body">
                    <table class="data-table">
                        <thead>
                            <tr><th>Patient ID</th><th>Name</th><th>Phone</th><th>Type</th></tr>
                        </thead>
                        <tbody>
                            ${patients.slice(0, 5).map(p => `
                                <tr>
                                    <td><strong>${p.patient_id}</strong></td>
                                    <td>${p.name}</td>
                                    <td>${p.phone}</td>
                                    <td><span class="badge ${p.patient_type === 'In-Patient' ? 'badge-primary' : 'badge-success'}">${p.patient_type}</span></td>
                                </tr>
                            `).join('')}
                            ${patients.length > 5 ? `<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">+ ${patients.length - 5} more patients</td></tr>` : ''}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Doctor Summary -->
            <div class="content-card">
                <div class="card-header">
                    <h2 class="card-title">Doctor Summary</h2>
                </div>
                <div class="card-body">
                    <table class="data-table">
                        <thead>
                            <tr><th>Doctor ID</th><th>Name</th><th>Specialization</th></tr>
                        </thead>
                        <tbody>
                            ${doctors.map(d => `
                                <tr>
                                    <td><strong>${d.doctor_id}</strong></td>
                                    <td>${d.name}</td>
                                    <td><span class="badge badge-success">${d.specialization}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Low Stock Medicines -->
            <div class="content-card">
                <div class="card-header">
                    <h2 class="card-title">Low Stock Alert</h2>
                </div>
                <div class="card-body">
                    <table class="data-table">
                        <thead>
                            <tr><th>Medicine ID</th><th>Name</th><th>Quantity</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${medicines.filter(m => m.quantity < 50).map(m => `
                                <tr>
                                    <td><strong>${m.medicine_id}</strong></td>
                                    <td>${m.name}</td>
                                    <td><span class="badge ${m.quantity < 10 ? 'badge-danger' : 'badge-warning'}">${m.quantity}</span></td>
                                    <td><span class="badge ${m.quantity < 10 ? 'badge-danger' : 'badge-warning'}">${m.quantity < 10 ? 'Critical' : 'Low'}</span></td>
                                </tr>
                            `).join('')}
                            ${medicines.filter(m => m.quantity < 50).length === 0 ? '<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);">✓ All medicines are sufficiently stocked</td></tr>' : ''}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function printReport() {
    window.print();
}

// Load complete report by default
document.addEventListener('DOMContentLoaded', () => {
    loadAllReports();
});
