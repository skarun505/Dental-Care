// Patient Management JavaScript

let currentEditId = null;

// Open Add Modal
function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add New Patient';
    document.getElementById('patientForm').reset();
    document.getElementById('patientId').value = '';
    document.getElementById('patient_id').disabled = false;
    document.getElementById('patientModal').classList.add('active');
}

// Edit Patient
function editPatient(id, patientId, name, address, gender, phone, bloodGroup, patientType) {
    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Patient';
    document.getElementById('patientId').value = id;
    document.getElementById('patient_id').value = patientId;
    document.getElementById('patient_id').disabled = true;
    document.getElementById('name').value = name;
    document.getElementById('address').value = address;
    document.getElementById('gender').value = gender;
    document.getElementById('phone').value = phone;
    document.getElementById('blood_group').value = bloodGroup;
    document.getElementById('patient_type').value = patientType;
    document.getElementById('patientModal').classList.add('active');
}

// Close Modal
function closeModal() {
    document.getElementById('patientModal').classList.remove('active');
    document.getElementById('patientForm').reset();
    currentEditId = null;
}

// Save Patient
async function savePatient() {
    const data = {
        patient_id: document.getElementById('patient_id').value,
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value,
        blood_group: document.getElementById('blood_group').value,
        patient_type: document.getElementById('patient_type').value
    };

    try {
        const url = currentEditId
            ? `/patients/update/${currentEditId}`
            : '/patients/add';

        const method = currentEditId ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (result.success) {
            showNotification(result.message, 'success');
            closeModal();
            setTimeout(() => location.reload(), 1000);
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        showNotification('An error occurred: ' + error.message, 'error');
    }
}

// Delete Patient
async function deletePatient(id) {
    if (!confirmDelete('this patient')) return;

    try {
        const response = await fetch(`/patients/delete/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showNotification(result.message, 'success');
            setTimeout(() => location.reload(), 1000);
        } else {
            showNotification(result.message, 'error');
        }
    } catch (error) {
        showNotification('An error occurred: ' + error.message, 'error');
    }
}

// Close modal on outside click
document.getElementById('patientModal').addEventListener('click', (e) => {
    if (e.target.id === 'patientModal') {
        closeModal();
    }
});

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
