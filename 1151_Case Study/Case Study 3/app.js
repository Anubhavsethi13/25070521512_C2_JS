/* ----------------------------------------------------
   GRADEHUB - STUDENT GRADING SYSTEM
   ---------------------------------------------------- */

// Mock credentials
const ADMIN_CREDENTIALS = {
    email: 'admin@gradehub.com',
    password: 'admin123'
};

// Initial Mock Data (Pre-populated for visual richness)
const MOCK_STUDENTS = [
    { name: 'Alice Smith', roll: 'STU-101', math: 88, science: 92, english: 90 },
    { name: 'Bob Johnson', roll: 'STU-102', math: 42, science: 50, english: 45 },
    { name: 'Charlotte Brontë', roll: 'STU-103', math: 95, science: 97, english: 94 },
    { name: 'David Miller', roll: 'STU-104', math: 38, science: 70, english: 65 }, // Fails due to Math < 40
    { name: 'Emma Watson', roll: 'STU-105', math: 75, science: 80, english: 78 }
];

// App State
let students = [];
let editIndex = null;

// DOM Elements
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');

// Auth DOM
const loginForm = document.getElementById('login-form');
const loginEmail = document.getElementById('login-email');
const loginPassword = document.getElementById('login-password');
const togglePasswordBtn = document.getElementById('toggle-password');
const logoutBtn = document.getElementById('logout-btn');
const userDisplayEmail = document.getElementById('user-display-email');
const userAvatarInitials = document.getElementById('user-avatar-initials');

// Dashboard Controls DOM
const searchInput = document.getElementById('search-input');
const filterGrade = document.getElementById('filter-grade');
const filterStatus = document.getElementById('filter-status');
const addStudentBtn = document.getElementById('add-student-btn');
const emptyStateAddBtn = document.getElementById('empty-state-add-btn');

// Table DOM
const studentsTable = document.getElementById('students-table');
const studentsTableBody = document.getElementById('students-table-body');
const emptyState = document.getElementById('empty-state');

// Stats DOM
const statTotalStudents = document.getElementById('stat-total-students');
const statClassAverage = document.getElementById('stat-class-average');
const statPassRate = document.getElementById('stat-pass-rate');
const statTopPerformer = document.getElementById('stat-top-performer');

// Modal DOM
const studentModal = document.getElementById('student-modal');
const modalTitle = document.getElementById('modal-title');
const studentForm = document.getElementById('student-form');
const studentNameInput = document.getElementById('student-name');
const studentRollInput = document.getElementById('student-roll');
const studentMathInput = document.getElementById('student-math');
const studentScienceInput = document.getElementById('student-science');
const studentEnglishInput = document.getElementById('student-english');
const cancelModalBtn = document.getElementById('cancel-modal-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

// Toast DOM
const toastContainer = document.getElementById('toast-container');

/* ----------------------------------------------------
   AUTHENTICATION LOGIC
   ---------------------------------------------------- */

// Show password toggle
togglePasswordBtn.addEventListener('click', () => {
    const type = loginPassword.getAttribute('type') === 'password' ? 'text' : 'password';
    loginPassword.setAttribute('type', type);
    const eyeIcon = togglePasswordBtn.querySelector('i');
    eyeIcon.classList.toggle('fa-eye');
    eyeIcon.classList.toggle('fa-eye-slash');
});

// Real-time Login Email Validation
loginEmail.addEventListener('input', () => {
    validateLoginEmail();
});

// Real-time Login Password Validation
loginPassword.addEventListener('input', () => {
    validateLoginPassword();
});

function validateLoginEmail() {
    const email = loginEmail.value.trim();
    const group = loginEmail.closest('.input-group');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email === "") {
        setError(group, "Email is required");
        return false;
    } else if (!emailRegex.test(email)) {
        setError(group, "Please enter a valid email address");
        return false;
    } else {
        setSuccess(group);
        return true;
    }
}

function validateLoginPassword() {
    const password = loginPassword.value.trim();
    const group = loginPassword.closest('.input-group');
    
    if (password === "") {
        setError(group, "Password is required");
        return false;
    } else if (password.length < 6) {
        setError(group, "Password must be at least 6 characters long");
        return false;
    } else {
        setSuccess(group);
        return true;
    }
}

// Form Validation helpers
function setError(elementGroup, message) {
    elementGroup.classList.remove('valid');
    elementGroup.classList.add('invalid');
    const errorSpan = elementGroup.querySelector('.error-message');
    if (errorSpan) {
        errorSpan.textContent = message;
    }
}

function setSuccess(elementGroup) {
    elementGroup.classList.remove('invalid');
    elementGroup.classList.add('valid');
}

function clearValidationState(formElement) {
    const groups = formElement.querySelectorAll('.input-group');
    groups.forEach(group => {
        group.classList.remove('valid', 'invalid');
    });
}

// Handle Login Submission
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const isEmailValid = validateLoginEmail();
    const isPasswordValid = validateLoginPassword();
    
    if (!isEmailValid || !isPasswordValid) {
        showToast('Please fix the errors in the login form', 'error');
        return;
    }
    
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();
    
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        // Authenticate successfully
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('adminEmail', email);
        
        showToast('Login successful! Welcome to GradeHub.', 'success');
        setupDashboardView(email);
    } else {
        showToast('Invalid email or password credentials', 'error');
        setError(loginEmail.closest('.input-group'), 'Check credentials');
        setError(loginPassword.closest('.input-group'), 'Check credentials');
    }
});

// Setup Dashboard View
function setupDashboardView(email) {
    userDisplayEmail.textContent = email;
    // Set initials from email
    const initials = email.substring(0, 2).toUpperCase();
    userAvatarInitials.textContent = initials;
    
    // Switch active view
    authSection.classList.remove('active-section');
    setTimeout(() => {
        authSection.style.display = 'none';
        dashboardSection.style.display = 'flex';
        setTimeout(() => {
            dashboardSection.classList.add('active-section');
        }, 50);
    }, 300);
    
    // Load student records
    loadStudents();
}

// Handle Logout
logoutBtn.addEventListener('click', () => {
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('adminEmail');
    
    showToast('Logged out successfully', 'success');
    
    // Reset login form fields
    loginForm.reset();
    clearValidationState(loginForm);
    
    dashboardSection.classList.remove('active-section');
    setTimeout(() => {
        dashboardSection.style.display = 'none';
        authSection.style.display = 'flex';
        setTimeout(() => {
            authSection.classList.add('active-section');
        }, 50);
    }, 300);
});

// Check Session on Start
function checkSession() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    const adminEmail = sessionStorage.getItem('adminEmail');
    
    if (isLoggedIn === 'true' && adminEmail) {
        authSection.style.display = 'none';
        authSection.classList.remove('active-section');
        dashboardSection.style.display = 'flex';
        dashboardSection.classList.add('active-section');
        setupDashboardView(adminEmail);
    } else {
        authSection.style.display = 'flex';
        authSection.classList.add('active-section');
    }
}

/* ----------------------------------------------------
   STUDENT RECORDS MANAGEMENT (CRUD)
   ---------------------------------------------------- */

// Load data from LocalStorage or use Mock data
function loadStudents() {
    const stored = localStorage.getItem('gradehub_students');
    if (stored) {
        students = JSON.parse(stored);
    } else {
        students = [...MOCK_STUDENTS];
        saveStudentsToStorage();
    }
    renderStudentsTable();
    updateStatistics();
}

function saveStudentsToStorage() {
    localStorage.setItem('gradehub_students', JSON.stringify(students));
}

// Calculation formulas
function calculateStats(student) {
    const total = Number(student.math) + Number(student.science) + Number(student.english);
    const percentage = Number((total / 3).toFixed(1));
    
    let grade = 'F';
    if (percentage >= 90) grade = 'A';
    else if (percentage >= 80) grade = 'B';
    else if (percentage >= 70) grade = 'C';
    else if (percentage >= 60) grade = 'D';
    
    // Status is PASS only if score in all subjects is at least 40
    const status = (student.math >= 40 && student.science >= 40 && student.english >= 40) ? 'Pass' : 'Fail';
    
    return { total, percentage, grade, status };
}

// Render student records dynamically
function renderStudentsTable() {
    const query = searchInput.value.toLowerCase().trim();
    const gradeSel = filterGrade.value;
    const statusSel = filterStatus.value;
    
    studentsTableBody.innerHTML = '';
    
    let filtered = students.filter(student => {
        const matchesQuery = student.name.toLowerCase().includes(query) || student.roll.toLowerCase().includes(query);
        const stats = calculateStats(student);
        
        const matchesGrade = gradeSel === 'all' || stats.grade === gradeSel;
        const matchesStatus = statusSel === 'all' || stats.status === statusSel;
        
        return matchesQuery && matchesGrade && matchesStatus;
    });
    
    if (filtered.length === 0) {
        studentsTable.style.display = 'none';
        emptyState.style.display = 'flex';
    } else {
        studentsTable.style.display = 'table';
        emptyState.style.display = 'none';
        
        filtered.forEach((student, index) => {
            // Find real index in parent student array
            const realIndex = students.findIndex(s => s.roll === student.roll);
            const { total, percentage, grade, status } = calculateStats(student);
            
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="student-meta">
                        <span class="student-tbl-name">${escapeHTML(student.name)}</span>
                    </div>
                </td>
                <td><span class="tbl-roll-no">${escapeHTML(student.roll)}</span></td>
                <td class="marks-cell">${student.math}</td>
                <td class="marks-cell">${student.science}</td>
                <td class="marks-cell">${student.english}</td>
                <td class="marks-cell font-bold"><strong>${total}</strong></td>
                <td class="marks-cell">${percentage}%</td>
                <td><span class="grade-badge grade-${grade}">${grade}</span></td>
                <td>
                    <span class="status-badge ${status === 'Pass' ? 'status-pass' : 'status-fail'}">
                        <i class="fa-solid ${status === 'Pass' ? 'fa-circle-check' : 'fa-circle-xmark'}"></i>
                        ${status}
                    </span>
                </td>
                <td class="text-right">
                    <div class="action-buttons">
                        <button onclick="editStudent(${realIndex})" class="action-btn action-btn-edit" title="Edit Student">
                            <i class="fa-solid fa-pencil"></i>
                        </button>
                        <button onclick="deleteStudent(${realIndex})" class="action-btn action-btn-delete" title="Delete Student">
                            <i class="fa-solid fa-trash-can"></i>
                        </button>
                    </div>
                </td>
            `;
            studentsTableBody.appendChild(tr);
        });
    }
}

// HTML Escaper to prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Update stats header dashboard indicators
function updateStatistics() {
    if (students.length === 0) {
        statTotalStudents.textContent = '0';
        statClassAverage.textContent = '0.0%';
        statPassRate.textContent = '0.0%';
        statTopPerformer.textContent = 'N/A';
        return;
    }
    
    let totalPercentageSum = 0;
    let passedCount = 0;
    let topStudent = null;
    let topPercentage = -1;
    
    students.forEach(student => {
        const { percentage, status } = calculateStats(student);
        totalPercentageSum += percentage;
        
        if (status === 'Pass') {
            passedCount++;
        }
        
        if (percentage > topPercentage) {
            topPercentage = percentage;
            topStudent = student;
        }
    });
    
    const classAvg = (totalPercentageSum / students.length).toFixed(1);
    const passRate = ((passedCount / students.length) * 100).toFixed(1);
    
    statTotalStudents.textContent = students.length;
    statClassAverage.textContent = `${classAvg}%`;
    statPassRate.textContent = `${passRate}%`;
    
    if (topStudent) {
        statTopPerformer.innerHTML = `${escapeHTML(topStudent.name)} <span style="font-size: 0.8rem; font-weight:500; color: var(--cyan);">(${topPercentage}%)</span>`;
    } else {
        statTopPerformer.textContent = 'N/A';
    }
}

/* ----------------------------------------------------
   FORM VALIDATION LOGIC FOR ADD / EDIT STUDENT
   ---------------------------------------------------- */

// Setup field input validation listeners
studentNameInput.addEventListener('input', () => validateStudentName());
studentRollInput.addEventListener('input', () => validateStudentRoll());
studentMathInput.addEventListener('input', () => validateSubjectMark(studentMathInput, 'math-error'));
studentScienceInput.addEventListener('input', () => validateSubjectMark(studentScienceInput, 'science-error'));
studentEnglishInput.addEventListener('input', () => validateSubjectMark(studentEnglishInput, 'english-error'));

function validateStudentName() {
    const name = studentNameInput.value.trim();
    const group = studentNameInput.closest('.input-group');
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    
    if (name === "") {
        setError(group, "Student name is required");
        return false;
    } else if (!nameRegex.test(name)) {
        setError(group, "Name must contain only letters/spaces (2-50 characters)");
        return false;
    } else {
        setSuccess(group);
        return true;
    }
}

function validateStudentRoll() {
    const roll = studentRollInput.value.trim().toUpperCase();
    const group = studentRollInput.closest('.input-group');
    const rollRegex = /^[A-Z0-9\-\_]{2,20}$/;
    
    if (roll === "") {
        setError(group, "Roll number / ID is required");
        return false;
    } else if (!rollRegex.test(roll)) {
        setError(group, "Roll number must be alphanumeric (2-20 characters)");
        return false;
    }
    
    // Check uniqueness (except current record being edited)
    const duplicate = students.some((s, idx) => s.roll.toUpperCase() === roll && idx !== editIndex);
    if (duplicate) {
        setError(group, "Roll number must be unique in this class database");
        return false;
    }
    
    setSuccess(group);
    return true;
}

function validateSubjectMark(inputElement, errorId) {
    const value = inputElement.value;
    const group = inputElement.closest('.input-group');
    
    if (value === "") {
        setError(group, "Required");
        return false;
    }
    
    const numeric = Number(value);
    if (isNaN(numeric) || !Number.isInteger(numeric) || numeric < 0 || numeric > 100) {
        setError(group, "Marks must be between 0 and 100");
        return false;
    }
    
    setSuccess(group);
    return true;
}

function validateStudentForm() {
    const isNameValid = validateStudentName();
    const isRollValid = validateStudentRoll();
    const isMathValid = validateSubjectMark(studentMathInput, 'math-error');
    const isScienceValid = validateSubjectMark(studentScienceInput, 'science-error');
    const isEnglishValid = validateSubjectMark(studentEnglishInput, 'english-error');
    
    return isNameValid && isRollValid && isMathValid && isScienceValid && isEnglishValid;
}

/* ----------------------------------------------------
   MODAL CONTROLLER ACTIONS
   ---------------------------------------------------- */

function openModal(mode = 'add', index = null) {
    editIndex = index;
    studentForm.reset();
    clearValidationState(studentForm);
    
    if (mode === 'add') {
        modalTitle.textContent = "Add New Student Record";
        studentRollInput.disabled = false;
        document.getElementById('edit-index').value = "";
    } else {
        modalTitle.textContent = "Edit Student Record";
        studentRollInput.disabled = true; // Lock roll number during edit to maintain DB integrity
        document.getElementById('edit-index').value = index;
        
        // Populate form
        const student = students[index];
        studentNameInput.value = student.name;
        studentRollInput.value = student.roll;
        studentMathInput.value = student.math;
        studentScienceInput.value = student.science;
        studentEnglishInput.value = student.english;
        
        // Trigger validation visually for values
        validateStudentName();
        validateStudentRoll();
        validateSubjectMark(studentMathInput, 'math-error');
        validateSubjectMark(studentScienceInput, 'science-error');
        validateSubjectMark(studentEnglishInput, 'english-error');
    }
    
    studentModal.classList.add('active');
}

function closeModal() {
    studentModal.classList.remove('active');
    editIndex = null;
}

addStudentBtn.addEventListener('click', () => openModal('add'));
emptyStateAddBtn.addEventListener('click', () => openModal('add'));
cancelModalBtn.addEventListener('click', closeModal);
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking on backdrop shadow
studentModal.addEventListener('click', (e) => {
    if (e.target === studentModal) {
        closeModal();
    }
});

// Handle Student Save Record
studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    if (!validateStudentForm()) {
        showToast('Please verify input values before saving', 'error');
        return;
    }
    
    const record = {
        name: studentNameInput.value.trim(),
        roll: studentRollInput.value.trim().toUpperCase(),
        math: parseInt(studentMathInput.value),
        science: parseInt(studentScienceInput.value),
        english: parseInt(studentEnglishInput.value)
    };
    
    if (editIndex !== null) {
        // Edit Mode
        students[editIndex] = record;
        showToast(`Successfully updated record for ${record.name}`, 'success');
    } else {
        // Create Mode
        students.push(record);
        showToast(`Successfully added record for ${record.name}`, 'success');
    }
    
    saveStudentsToStorage();
    closeModal();
    renderStudentsTable();
    updateStatistics();
});

// Global triggers accessible outside modules
window.editStudent = function(index) {
    openModal('edit', index);
};

window.deleteStudent = function(index) {
    const student = students[index];
    const confirmDelete = confirm(`Are you sure you want to delete student ${student.name} (${student.roll})?`);
    
    if (confirmDelete) {
        students.splice(index, 1);
        saveStudentsToStorage();
        renderStudentsTable();
        updateStatistics();
        showToast(`Record for ${student.name} deleted`, 'success');
    }
};

/* ----------------------------------------------------
   FILTERS & LIVE SEARCH LOGIC
   ---------------------------------------------------- */
searchInput.addEventListener('input', () => {
    renderStudentsTable();
});

filterGrade.addEventListener('change', () => {
    renderStudentsTable();
});

filterStatus.addEventListener('change', () => {
    renderStudentsTable();
});

/* ----------------------------------------------------
   TOAST NOTIFICATION COMPONENT
   ---------------------------------------------------- */
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exmark';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Automatically fadeout and clean up
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 4000);
}

// Initialise application session
checkSession();
