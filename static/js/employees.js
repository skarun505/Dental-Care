// Employee Management JavaScript

let currentEditId = null;

function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add New Employee';
    document.getElementById('employeeForm').reset();
    document.getElementById('employeeId').value = '';
    document.getElementById('employee_id').disabled = false;
    document.getElementById('employeeModal').classList.add('active');
}

function editEmployee(id, employeeId, name, role, phone, address) {
    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Employee';
    document.getElementById('employeeId').value = id;
    document.getElementById('employee_id').value = employeeId;
    document.getElementById('employee_id').disabled = true;
    document.getElementById('name').value = name;
    document.getElementById('role').value = role;
    document.getElementById('phone').value = phone;
    document.getElementById('address').value = address;
    document.getElementById('employeeModal').classList.add('active');
}

function closeModal() {
    document.getElementById('employeeModal').classList.remove('active');
    document.getElementById('employeeForm').reset();
    currentEditId = null;
}

async function saveEmployee() {
    const data = {
        employee_id: document.getElementById('employee_id').value,
        name: document.getElementById('name').value,
        role: document.getElementById('role').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value
    };

    try {
        const url = currentEditId
            ? `/employees/update/${currentEditId}`
            : '/employees/add';

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

async function deleteEmployee(id) {
    if (!confirmDelete('this employee')) return;

    try {
        const response = await fetch(`/employees/delete/${id}`, {
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

document.getElementById('employeeModal').addEventListener('click', (e) => {
    if (e.target.id === 'employeeModal') {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
