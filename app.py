from flask import Flask, render_template, request, redirect, url_for, session, jsonify, flash
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dental-care-secret-key-2026'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dental_care.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(50), default='admin')

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200))
    gender = db.Column(db.String(10))
    phone = db.Column(db.String(20))
    blood_group = db.Column(db.String(10))
    patient_type = db.Column(db.String(20))  # In-Patient or Out-Patient
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Doctor(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    doctor_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    specialization = db.Column(db.String(100))
    address = db.Column(db.String(200))
    timing = db.Column(db.String(100))
    mobile = db.Column(db.String(20))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Employee(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    employee_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100))
    phone = db.Column(db.String(20))
    address = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Medicine(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    medicine_id = db.Column(db.String(50), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, default=0.0)
    expiry_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/')
def index():
    if 'user_id' in session:
        return redirect(url_for('dashboard'))
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')
        
        user = User.query.filter_by(username=username).first()
        
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            session['username'] = user.username
            flash('Login successful!', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('Invalid username or password', 'error')
    
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.clear()
    flash('Logged out successfully', 'success')
    return redirect(url_for('login'))

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    # Get statistics
    patient_count = Patient.query.count()
    doctor_count = Doctor.query.count()
    employee_count = Employee.query.count()
    medicine_count = Medicine.query.count()
    
    return render_template('dashboard.html', 
                         patient_count=patient_count,
                         doctor_count=doctor_count,
                         employee_count=employee_count,
                         medicine_count=medicine_count)

# Patient Routes
@app.route('/patients')
def patients():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    patients = Patient.query.all()
    return render_template('patients.html', patients=patients)

@app.route('/patients/add', methods=['POST'])
def add_patient():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    data = request.get_json()
    
    try:
        patient = Patient(
            patient_id=data['patient_id'],
            name=data['name'],
            address=data['address'],
            gender=data['gender'],
            phone=data['phone'],
            blood_group=data['blood_group'],
            patient_type=data['patient_type']
        )
        db.session.add(patient)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Patient added successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/patients/update/<int:id>', methods=['PUT'])
def update_patient(id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    patient = Patient.query.get_or_404(id)
    data = request.get_json()
    
    try:
        patient.name = data['name']
        patient.address = data['address']
        patient.gender = data['gender']
        patient.phone = data['phone']
        patient.blood_group = data['blood_group']
        patient.patient_type = data['patient_type']
        
        db.session.commit()
        return jsonify({'success': True, 'message': 'Patient updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/patients/delete/<int:id>', methods=['DELETE'])
def delete_patient(id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    patient = Patient.query.get_or_404(id)
    
    try:
        db.session.delete(patient)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Patient deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

# Doctor Routes
@app.route('/doctors')
def doctors():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    doctors = Doctor.query.all()
    return render_template('doctors.html', doctors=doctors)

@app.route('/doctors/add', methods=['POST'])
def add_doctor():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    data = request.get_json()
    
    try:
        doctor = Doctor(
            doctor_id=data['doctor_id'],
            name=data['name'],
            specialization=data['specialization'],
            address=data['address'],
            timing=data['timing'],
            mobile=data['mobile']
        )
        db.session.add(doctor)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Doctor added successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/doctors/update/<int:id>', methods=['PUT'])
def update_doctor(id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    doctor = Doctor.query.get_or_404(id)
    data = request.get_json()
    
    try:
        doctor.name = data['name']
        doctor.specialization = data['specialization']
        doctor.address = data['address']
        doctor.timing = data['timing']
        doctor.mobile = data['mobile']
        
        db.session.commit()
        return jsonify({'success': True, 'message': 'Doctor updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/doctors/delete/<int:id>', methods=['DELETE'])
def delete_doctor(id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    doctor = Doctor.query.get_or_404(id)
    
    try:
        db.session.delete(doctor)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Doctor deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

# Employee Routes
@app.route('/employees')
def employees():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    employees = Employee.query.all()
    return render_template('employees.html', employees=employees)

@app.route('/employees/add', methods=['POST'])
def add_employee():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    data = request.get_json()
    
    try:
        employee = Employee(
            employee_id=data['employee_id'],
            name=data['name'],
            role=data['role'],
            phone=data['phone'],
            address=data['address']
        )
        db.session.add(employee)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Employee added successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/employees/update/<int:id>', methods=['PUT'])
def update_employee(id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    employee = Employee.query.get_or_404(id)
    data = request.get_json()
    
    try:
        employee.name = data['name']
        employee.role = data['role']
        employee.phone = data['phone']
        employee.address = data['address']
        
        db.session.commit()
        return jsonify({'success': True, 'message': 'Employee updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/employees/delete/<int:id>', methods=['DELETE'])
def delete_employee(id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    employee = Employee.query.get_or_404(id)
    
    try:
        db.session.delete(employee)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Employee deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

# Pharmacy Routes
@app.route('/pharmacy')
def pharmacy():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    medicines = Medicine.query.all()
    return render_template('pharmacy.html', medicines=medicines)

@app.route('/pharmacy/add', methods=['POST'])
def add_medicine():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    data = request.get_json()
    
    try:
        medicine = Medicine(
            medicine_id=data['medicine_id'],
            name=data['name'],
            quantity=data['quantity'],
            price=data['price'],
            expiry_date=datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()
        )
        db.session.add(medicine)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Medicine added successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/pharmacy/update/<int:id>', methods=['PUT'])
def update_medicine(id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    medicine = Medicine.query.get_or_404(id)
    data = request.get_json()
    
    try:
        medicine.name = data['name']
        medicine.quantity = data['quantity']
        medicine.price = data['price']
        medicine.expiry_date = datetime.strptime(data['expiry_date'], '%Y-%m-%d').date()
        
        db.session.commit()
        return jsonify({'success': True, 'message': 'Medicine updated successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

@app.route('/pharmacy/delete/<int:id>', methods=['DELETE'])
def delete_medicine(id):
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    medicine = Medicine.query.get_or_404(id)
    
    try:
        db.session.delete(medicine)
        db.session.commit()
        return jsonify({'success': True, 'message': 'Medicine deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': str(e)}), 400

# Reports Route
@app.route('/reports')
def reports():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    return render_template('reports.html')

@app.route('/api/reports/patients')
def patient_report():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    patients = Patient.query.all()
    patient_data = [{
        'id': p.id,
        'patient_id': p.patient_id,
        'name': p.name,
        'phone': p.phone,
        'patient_type': p.patient_type,
        'blood_group': p.blood_group
    } for p in patients]
    
    return jsonify({'success': True, 'data': patient_data})

@app.route('/api/reports/doctors')
def doctor_report():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    doctors = Doctor.query.all()
    doctor_data = [{
        'id': d.id,
        'doctor_id': d.doctor_id,
        'name': d.name,
        'specialization': d.specialization,
        'timing': d.timing
    } for d in doctors]
    
    return jsonify({'success': True, 'data': doctor_data})

@app.route('/api/reports/medicines')
def medicine_report():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Unauthorized'}), 401
    
    medicines = Medicine.query.all()
    medicine_data = [{
        'id': m.id,
        'medicine_id': m.medicine_id,
        'name': m.name,
        'quantity': m.quantity,
        'price': m.price,
        'expiry_date': m.expiry_date.strftime('%Y-%m-%d') if m.expiry_date else ''
    } for m in medicines]
    
    return jsonify({'success': True, 'data': medicine_data})

# Create database and admin user if they don't exist
with app.app_context():
    db.create_all()
    if not User.query.filter_by(username='admin').first():
        admin = User(
            username='admin',
            password=generate_password_hash('admin123'),
            role='admin'
        )
        db.session.add(admin)
        db.session.commit()

if __name__ == '__main__':
    app.run(debug=True, port=5050, host='127.0.0.1')
