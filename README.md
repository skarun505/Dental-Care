# 🦷 Dental Care Management System

A modern, full-featured web-based dental clinic management system built with Flask and vanilla JavaScript.

## ✨ Features

- **🔐 Secure Login System** - Session-based authentication
- **📊 Dashboard** - Real-time statistics and quick actions
- **👥 Patient Management** - Track in-patients and out-patients with full CRUD operations
- **👨‍⚕️ Doctor Management** - Manage dentist profiles and specializations
- **👔 Employee Management** - Track clinic staff and their roles
- **💊 Pharmacy Module** - Medicine inventory with stock level alerts
- **📈 Reports & Analytics** - Generate detailed reports with print functionality

## 🎨 Design Features

- Modern glassmorphism UI
- Gradient backgrounds and smooth animations
- Responsive design (mobile, tablet, desktop)
- Professional color scheme
- Interactive micro-animations
- Badge indicators for status
- Modal-based forms

## 🛠️ Technology Stack

- **Backend**: Python Flask
- **Database**: SQLite (SQLAlchemy ORM)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with design system
- **Icons**: Emoji-based (no external dependencies)

## 📋 Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- Modern web browser

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Application

```bash
python app.py
```

The application will:
- Initialize the database
- Create an admin user
- Start the development server on http://localhost:5000

### 3. Access the System

Open your browser and navigate to: **http://localhost:5000**

**Default Login Credentials:**
- Username: `admin`
- Password: `admin123`

## 📁 Project Structure

```
Dental Care/
│
├── app.py                      # Main Flask application
├── requirements.txt            # Python dependencies
├── README.md                   # This file
│
├── static/                     # Static files
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       ├── main.js            # Common JavaScript utilities
│       ├── patients.js        # Patient module scripts
│       ├── doctors.js         # Doctor module scripts
│       ├── employees.js       # Employee module scripts
│       ├── pharmacy.js        # Pharmacy module scripts
│       └── reports.js         # Reports module scripts
│
└── templates/                  # HTML templates
    ├── login.html             # Login page
    ├── dashboard.html         # Main dashboard
    ├── patients.html          # Patient management
    ├── doctors.html           # Doctor management
    ├── employees.html         # Employee management
    ├── pharmacy.html          # Pharmacy management
    └── reports.html           # Reports & analytics
```

## 🗄️ Database Schema

### Patient Table
- patient_id (Primary Key)
- name
- address
- gender
- phone
- blood_group
- patient_type (In-Patient/Out-Patient)

### Doctor Table
- doctor_id (Primary Key)
- name
- specialization
- address
- timing
- mobile

### Employee Table
- employee_id (Primary Key)
- name
- role
- phone
- address

### Medicine Table
- medicine_id (Primary Key)
- name
- quantity
- price
- expiry_date

## 🎯 Module Guide

### Dashboard
- View system statistics
- Quick navigation to all modules
- System status overview

### Patient Module
- Add new patients (in-patient/out-patient)
- Edit patient information
- Delete patient records
- View all patients in a table
- Filter by patient type

### Doctor Module
- Add doctors with specializations
- Manage doctor schedules
- Update contact information
- Track multiple specializations

### Employee Module
- Add clinic staff
- Assign roles (Receptionist, Assistant, etc.)
- Manage contact details

### Pharmacy Module
- Add medicines to inventory
- Track stock levels
- Low stock alerts (< 10 units)
- Set expiry dates
- Update prices

### Reports Module
- Patient reports
- Doctor reports
- Medicine stock reports
- Complete system report
- Print-friendly format

## 🔒 Security Features

- Password hashing using Werkzeug
- Session-based authentication
- Login required for all routes
- CSRF protection
- Input validation

## 🎨 Color Scheme

- Primary: Blue gradient (#0066FF)
- Secondary: Green (#00D9A3)
- Accent: Pink (#FF6B9D)
- Background: Purple gradient
- Success: Green (#10B981)
- Warning: Amber (#F59E0B)
- Error: Red (#EF4444)

## 📱 Responsive Breakpoints

- Desktop: > 768px
- Tablet: 768px - 1024px
- Mobile: < 768px

## 🚀 Future Enhancements

- [ ] Appointment scheduling system
- [ ] Billing and invoice generation
- [ ] Treatment history tracking
- [ ] Prescription management
- [ ] SMS/Email notifications
- [ ] Role-based access control
- [ ] Data export (PDF, Excel)
- [ ] Dark mode toggle
- [ ] Multi-language support

## 🧪 Testing

The system includes:
- Form validation
- Error handling
- User-friendly notifications
- Confirmation dialogs for deletions

## 📝 API Endpoints

### Authentication
- `GET /` - Redirect to login/dashboard
- `GET /login` - Login page
- `POST /login` - Login authentication
- `GET /logout` - Logout

### Dashboard
- `GET /dashboard` - Main dashboard

### Patients
- `GET /patients` - List all patients
- `POST /patients/add` - Add new patient
- `PUT /patients/update/<id>` - Update patient
- `DELETE /patients/delete/<id>` - Delete patient

### Doctors
- `GET /doctors` - List all doctors
- `POST /doctors/add` - Add new doctor
- `PUT /doctors/update/<id>` - Update doctor
- `DELETE /doctors/delete/<id>` - Delete doctor

### Employees
- `GET /employees` - List all employees
- `POST /employees/add` - Add new employee
- `PUT /employees/update/<id>` - Update employee
- `DELETE /employees/delete/<id>` - Delete employee

### Pharmacy
- `GET /pharmacy` - List all medicines
- `POST /pharmacy/add` - Add new medicine
- `PUT /pharmacy/update/<id>` - Update medicine
- `DELETE /pharmacy/delete/<id>` - Delete medicine

### Reports
- `GET /reports` - Reports page
- `GET /api/reports/patients` - Patient report data
- `GET /api/reports/doctors` - Doctor report data
- `GET /api/reports/medicines` - Medicine report data

## 💡 Tips

1. **Adding Data**: Always start by adding doctors and employees first
2. **Patient Types**: Use "In-Patient" for admitted patients, "Out-Patient" for regular visits
3. **Stock Alerts**: Red badge = Critical (< 10), Yellow = Low (< 50), Green = Good stock
4. **Reports**: Use "Print Report" button for physical copies
5. **Search**: Use browser's find function (Ctrl+F) to search in tables

## 🐛 Troubleshooting

**Database not found:**
- Delete the `dental_care.db` file and restart the app
- It will be recreated automatically

**Port already in use:**
- Change the port in `app.py`: `app.run(debug=True, port=5001)`

**Login not working:**
- Ensure you're using the correct credentials: `admin` / `admin123`
- Check if the database was initialized properly

## 👨‍💻 Development

To run in development mode:
```bash
python app.py
```

The app runs with debug mode enabled, showing detailed error messages and auto-reloading on file changes.

## 📄 License

This project is created for educational purposes as a college project.

## 👤 Author

Created as a college project for Dental Care Management System

## 🙏 Acknowledgments

- Flask documentation
- Modern web design principles
- Healthcare management best practices

---

**Note**: This is a college project demonstration. For production use, additional security measures and features should be implemented.
