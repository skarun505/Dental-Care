// Doctor Management JavaScript

let currentEditId = null;

function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add New Doctor';
    document.getElementById('doctorForm').reset();
    document.getElementById('doctorId').value = '';
    document.getElementById('doctor_id').disabled = false;
    document.getElementById('doctorModal').classList.add('active');
}

function editDoctor(id, doctorId, name, specialization, address, timing, mobile) {
    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Doctor';
    document.getElementById('doctorId').value = id;
    document.getElementById('doctor_id').value = doctorId;
    document.getElementById('doctor_id').disabled = true;
    document.getElementById('name').value = name;
    document.getElementById('specialization').value = specialization;
    document.getElementById('address').value = address;
    document.getElementById('timing').value = timing;
    document.getElementById('mobile').value = mobile;
    document.getElementById('doctorModal').classList.add('active');
}

function closeModal() {
    document.getElementById('doctorModal').classList.remove('active');
    document.getElementById('doctorForm').reset();
    currentEditId = null;
}

async function saveDoctor() {
    const data = {
        doctor_id: document.getElementById('doctor_id').value,
        name: document.getElementById('name').value,
        specialization: document.getElementById('specialization').value,
        address: document.getElementById('address').value,
        timing: document.getElementById('timing').value,
        mobile: document.getElementById('mobile').value
    };

    try {
        const url = currentEditId
            ? `/doctors/update/${currentEditId}`
            : '/doctors/add';

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

async function deleteDoctor(id) {
    if (!confirmDelete('this doctor')) return;

    try {
        const response = await fetch(`/doctors/delete/${id}`, {
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

document.getElementById('doctorModal').addEventListener('click', (e) => {
    if (e.target.id === 'doctorModal') {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
