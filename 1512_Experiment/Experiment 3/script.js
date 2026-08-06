const gradeForm = document.getElementById("gradeForm");

// Theme Toggling Logic
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// SVGs paths for Moon and Sun
const moonPath = "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z";
const sunPath = "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z";

function updateThemeUI(theme) {
    if (theme === "dark") {
        themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="${sunPath}" />`;
    } else {
        themeIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="${moonPath}" />`;
    }
}

// Initial Theme setup
const savedTheme = localStorage.getItem("theme") || "light";
document.documentElement.setAttribute("data-theme", savedTheme);
updateThemeUI(savedTheme);

themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeUI(newTheme);
});

// Calculation Logic
gradeForm.addEventListener("submit", function (event) {
    event.preventDefault();
    
    const name = document.getElementById("studentName").value.trim();
    const rollNumber = document.getElementById("rollNumber").value.trim();
    
    const javascript = Number(document.getElementById("javascript").value);
    const computerNetworks = Number(document.getElementById("computer-networks").value);
    const compilerConstruction = Number(document.getElementById("compiler-construction").value);
    const dataCompression = Number(document.getElementById("data-compression").value);
    const specialization = Number(document.getElementById("specialization").value);
    
    const marks = [
        javascript,
        computerNetworks,
        compilerConstruction,
        dataCompression,
        specialization
    ];
    
    if (name === "") {
        alert("Please enter Student Name.");
        return;
    }
    if (rollNumber === "") {
        alert("Please enter Roll Number.");
        return;
    }
    
    for (let mark of marks) {
        if (isNaN(mark) || mark === "" || document.getElementById("javascript").value === "") {
            alert("Please enter all subject marks.");
            return;
        }
        if (mark < 0 || mark > 100) {
            alert("Marks should be between 0 and 100.");
            return;
        }
    }
    
    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const percentage = (total / 500) * 100;
    
    let status = "Pass";
    for (let mark of marks) {
        if (mark < 35) {
            status = "Fail";
            break;
        }
    }
    
    let grade;
    if (status === "Fail") {
        grade = "F";
    } else if (percentage >= 90) {
        grade = "A+";
    } else if (percentage >= 80) {
        grade = "A";
    } else if (percentage >= 70) {
        grade = "B";
    } else if (percentage >= 60) {
        grade = "C";
    } else if (percentage >= 50) {
        grade = "D";
    } else {
        grade = "F";
    }
    
    let remarks;
    switch (grade) {
        case "A+":
            remarks = "Outstanding academic performance!";
            break;
        case "A":
            remarks = "Excellent results! Keep up the great work.";
            break;
        case "B":
            remarks = "Very good effort. Continuous progress observed.";
            break;
        case "C":
            remarks = "Good performance. Room for higher achievements.";
            break;
        case "D":
            remarks = "Passed, but needs significant improvement.";
            break;
        default:
            remarks = "Better luck next time. Focus on fundamental concepts.";
    }
    
    const studentResult = {
        name,
        rollNumber,
        total,
        percentage: percentage.toFixed(2),
        grade,
        status,
        remarks,
        subjects: {
            javascript,
            computerNetworks,
            compilerConstruction,
            dataCompression,
            specialization
        }
    };
    
    localStorage.setItem("studentResult", JSON.stringify(studentResult));
    displayResult(studentResult);
});

function displayResult(data) {
    const resultContainer = document.getElementById("resultContainer");
    
    // Graceful fallback for older localStorage formats
    const subjects = data.subjects || {
        javascript: 0,
        computerNetworks: 0,
        compilerConstruction: 0,
        dataCompression: 0,
        specialization: 0
    };
    
    const percentage = Number(data.percentage);
    // Radius of circular chart is 38. Circumference C = 2 * pi * 38 = 238.76
    const circumference = 2 * Math.PI * 38;
    const offset = circumference - (percentage / 100) * circumference;
    
    const isPass = data.status === "Pass";
    const badgeClass = isPass ? "badge-pass" : "badge-fail";
    
    // SVGs for success/failure status badges
    const statusIcon = isPass 
        ? `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" /></svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>`;

    // Determine performance level for custom progress bars styling
    const getBarClass = (score) => {
        if (score >= 75) return "bar-excellent";
        if (score >= 35) return "bar-warning";
        return "bar-danger";
    };

    resultContainer.innerHTML = `
        <div class="result-content">
            <!-- Student Header Profile -->
            <div class="result-header">
                <div class="student-info">
                    <h2>${data.name}</h2>
                    <p>Roll Number: ${data.rollNumber}</p>
                </div>
                <span class="badge ${badgeClass}">
                    ${statusIcon}
                    ${data.status}
                </span>
            </div>

            <!-- Main Score Overview -->
            <div class="overview-panel">
                <div class="progress-circular-wrapper">
                    <svg class="progress-ring" width="90" height="90">
                        <circle class="progress-ring__background" stroke-width="6" fill="transparent" r="38" cx="45" cy="45"/>
                        <circle class="progress-ring__circle" stroke="${isPass ? 'var(--success)' : 'var(--fail)'}" stroke-width="6" fill="transparent" r="38" cx="45" cy="45" 
                            stroke-dasharray="${circumference}" 
                            stroke-dashoffset="${offset}" />
                    </svg>
                    <div class="progress-percentage">
                        ${percentage}%
                        <span>Score</span>
                    </div>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-item">
                        <span class="stat-label">Total Marks</span>
                        <span class="stat-value">${data.total} <span style="font-size: 13px; font-weight: 500; color: var(--text-muted);">/ 500</span></span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Overall Grade</span>
                        <span class="stat-value grade" style="color: ${isPass ? 'var(--primary)' : 'var(--fail)'}">${data.grade}</span>
                    </div>
                </div>
            </div>

            <!-- Subject-wise Breakdown -->
            <div class="performance-list">
                <div class="performance-header">Subject breakdown</div>
                
                <div class="subject-row">
                    <div class="subject-details">
                        <span class="subject-name">JavaScript</span>
                        <span class="subject-score">${subjects.javascript} <span>/ 100</span></span>
                    </div>
                    <div class="subject-progress-container">
                        <div class="subject-progress-bar ${getBarClass(subjects.javascript)}" style="width: ${subjects.javascript}%"></div>
                    </div>
                </div>

                <div class="subject-row">
                    <div class="subject-details">
                        <span class="subject-name">Computer Networks</span>
                        <span class="subject-score">${subjects.computerNetworks} <span>/ 100</span></span>
                    </div>
                    <div class="subject-progress-container">
                        <div class="subject-progress-bar ${getBarClass(subjects.computerNetworks)}" style="width: ${subjects.computerNetworks}%"></div>
                    </div>
                </div>

                <div class="subject-row">
                    <div class="subject-details">
                        <span class="subject-name">Compiler Construction</span>
                        <span class="subject-score">${subjects.compilerConstruction} <span>/ 100</span></span>
                    </div>
                    <div class="subject-progress-container">
                        <div class="subject-progress-bar ${getBarClass(subjects.compilerConstruction)}" style="width: ${subjects.compilerConstruction}%"></div>
                    </div>
                </div>

                <div class="subject-row">
                    <div class="subject-details">
                        <span class="subject-name">Data Compression</span>
                        <span class="subject-score">${subjects.dataCompression} <span>/ 100</span></span>
                    </div>
                    <div class="subject-progress-container">
                        <div class="subject-progress-bar ${getBarClass(subjects.dataCompression)}" style="width: ${subjects.dataCompression}%"></div>
                    </div>
                </div>

                <div class="subject-row">
                    <div class="subject-details">
                        <span class="subject-name">Specialization</span>
                        <span class="subject-score">${subjects.specialization} <span>/ 100</span></span>
                    </div>
                    <div class="subject-progress-container">
                        <div class="subject-progress-bar ${getBarClass(subjects.specialization)}" style="width: ${subjects.specialization}%"></div>
                    </div>
                </div>
            </div>

            <!-- Remarks -->
            <div class="remarks-card" style="border-left-color: ${isPass ? 'var(--primary)' : 'var(--fail)'}; background: ${isPass ? 'var(--primary-light)' : 'var(--fail-bg)'}">
                <strong>Remarks:</strong> ${data.remarks}
            </div>
        </div>
    `;
}

window.onload = function () {
    const savedData = localStorage.getItem("studentResult");
    if (savedData) {
        try {
            displayResult(JSON.parse(savedData));
        } catch (e) {
            console.error("Error loading saved grading results:", e);
            localStorage.removeItem("studentResult"); // Wipe corrupted storage
        }
    }
};