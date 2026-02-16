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
        const [patientsRes, doctorsRes, medicinesRes, appointmentsRes, billingRes] = await Promise.all([
            fetch('/api/reports/patients'),
            fetch('/api/reports/doctors'),
            fetch('/api/reports/medicines'),
            fetch('/api/reports/appointments'),
            fetch('/api/reports/billing')
        ]);

        const patients = await patientsRes.json();
        const doctors = await doctorsRes.json();
        const medicines = await medicinesRes.json();
        const appointments = await appointmentsRes.json();
        const billing = await billingRes.json();

        if (patients.success && doctors.success && medicines.success && appointments.success && billing.success) {
            displayCompleteReport(patients.data, doctors.data, medicines.data, appointments.data, billing.data);
        } else {
            showNotification('Failed to load complete report', 'error');
        }
    } catch (error) {
        showNotification('An error occurred: ' + error.message, 'error');
    }
}

async function loadAppointmentReport() {
    try {
        const response = await fetch('/api/reports/appointments');
        const result = await response.json();

        if (result.success) {
            displayAppointmentReport(result.data);
        } else {
            showNotification('Failed to load appointment report', 'error');
        }
    } catch (error) {
        showNotification('An error occurred: ' + error.message, 'error');
    }
}

async function loadBillingReport() {
    try {
        const response = await fetch('/api/reports/billing');
        const result = await response.json();

        if (result.success) {
            displayBillingReport(result.data);
        } else {
            showNotification('Failed to load billing report', 'error');
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

function displayAppointmentReport(appointments) {
    const container = document.getElementById('reportContainer');

    container.innerHTML = `
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Appointment Report</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <span class="badge badge-primary">${appointments.length} Total</span>
                    <span class="badge badge-success">${appointments.filter(a => a.status === 'Completed').length} Completed</span>
                </div>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Patient</th>
                                <th>Doctor</th>
                                <th>Status</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${appointments.map(a => `
                                <tr>
                                    <td><strong>${a.id}</strong></td>
                                    <td>${a.date}</td>
                                    <td>${a.patient_name}</td>
                                    <td>${a.doctor_name}</td>
                                    <td><span class="badge badge-${a.status === 'Completed' ? 'success' : 'warning'}">${a.status}</span></td>
                                    <td>${a.notes}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function displayBillingReport(bills) {
    const container = document.getElementById('reportContainer');
    const totalAmount = bills.reduce((sum, b) => sum + b.amount, 0);

    container.innerHTML = `
        <div class="content-card">
            <div class="card-header">
                <h2 class="card-title">Billing Report</h2>
                <div style="display: flex; gap: 0.5rem;">
                    <span class="badge badge-primary">${bills.length} Invoices</span>
                    <span class="badge badge-success">Total: $${totalAmount.toFixed(2)}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Patient</th>
                                <th>Amount</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${bills.map(b => `
                                <tr>
                                    <td><strong>${b.id}</strong></td>
                                    <td>${b.date}</td>
                                    <td>${b.patient_name}</td>
                                    <td>$${b.amount.toFixed(2)}</td>
                                    <td><span class="badge badge-${b.status === 'Paid' ? 'success' : 'warning'}">${b.status}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function displayCompleteReport(patients, doctors, medicines, appointments, billing) {
    const container = document.getElementById('reportContainer');
    const totalRevenue = billing.reduce((sum, b) => sum + b.amount, 0);

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
                            <div class="stat-icon"><i class="fas fa-users" style="font-size: 2rem; color: var(--primary-color);"></i></div>
                            <div class="stat-label">Total Patients</div>
                            <div class="stat-value">${patients.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-user-md" style="font-size: 2rem; color: var(--primary-color);"></i></div>
                            <div class="stat-label">Total Doctors</div>
                            <div class="stat-value">${doctors.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-calendar-check" style="font-size: 2rem; color: var(--primary-color);"></i></div>
                            <div class="stat-label">Appointments</div>
                            <div class="stat-value">${appointments.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-icon"><i class="fas fa-file-invoice-dollar" style="font-size: 2rem; color: var(--primary-color);"></i></div>
                            <div class="stat-label">Total Revenue</div>
                            <div class="stat-value">$${totalRevenue.toFixed(2)}</div>
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
                            ${medicines.filter(m => m.quantity < 50).length === 0 ? '<tr><td colspan="4" style="text-align: center; color: var(--text-secondary);"><i class="fas fa-check"></i> All medicines are sufficiently stocked</td></tr>' : ''}
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
