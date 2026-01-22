// Pharmacy Management JavaScript

let currentEditId = null;

function openAddModal() {
    currentEditId = null;
    document.getElementById('modalTitle').textContent = 'Add New Medicine';
    document.getElementById('medicineForm').reset();
    document.getElementById('medicineId').value = '';
    document.getElementById('medicine_id').disabled = false;
    document.getElementById('medicineModal').classList.add('active');
}

function editMedicine(id, medicineId, name, quantity, price, expiryDate) {
    currentEditId = id;
    document.getElementById('modalTitle').textContent = 'Edit Medicine';
    document.getElementById('medicineId').value = id;
    document.getElementById('medicine_id').value = medicineId;
    document.getElementById('medicine_id').disabled = true;
    document.getElementById('name').value = name;
    document.getElementById('quantity').value = quantity;
    document.getElementById('price').value = price;
    document.getElementById('expiry_date').value = expiryDate;
    document.getElementById('medicineModal').classList.add('active');
}

function closeModal() {
    document.getElementById('medicineModal').classList.remove('active');
    document.getElementById('medicineForm').reset();
    currentEditId = null;
}

async function saveMedicine() {
    const data = {
        medicine_id: document.getElementById('medicine_id').value,
        name: document.getElementById('name').value,
        quantity: parseInt(document.getElementById('quantity').value),
        price: parseFloat(document.getElementById('price').value),
        expiry_date: document.getElementById('expiry_date').value
    };

    try {
        const url = currentEditId
            ? `/pharmacy/update/${currentEditId}`
            : '/pharmacy/add';

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

async function deleteMedicine(id) {
    if (!confirmDelete('this medicine')) return;

    try {
        const response = await fetch(`/pharmacy/delete/${id}`, {
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

document.getElementById('medicineModal').addEventListener('click', (e) => {
    if (e.target.id === 'medicineModal') {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});
