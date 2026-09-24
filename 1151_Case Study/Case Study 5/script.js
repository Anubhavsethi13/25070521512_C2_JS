// ===== STUDENT GRADE MANAGER =====
// A practical project using JavaScript Array methods

let students = [];

// ===== ADD STUDENT (push method) =====
function addStudent() {
  const nameInput = document.getElementById("studentName");
  const gradeInput = document.getElementById("studentGrade");
  const name = nameInput.value.trim();
  const grade = gradeInput.value.trim();

  if (!name || !grade) {
    alert("⚠️ Please enter both student name and grade");
    if (!name) nameInput.focus();
    return;
  }

  const gradeNum = parseInt(grade);
  if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
    alert("⚠️ Grade must be a number between 0 and 100");
    gradeInput.focus();
    return;
  }

  // PUSH: Add student to end of array
  students.push({
    name: name,
    grade: gradeNum,
  });

  console.log(`✓ Added: ${name} with grade ${gradeNum}`);

  // Clear inputs
  nameInput.value = "";
  gradeInput.value = "";
  nameInput.focus();

  displayStudents();
}

// ===== DISPLAY ALL STUDENTS (forEach method) =====
function displayStudents() {
  const listDiv = document.getElementById("studentList");

  if (students.length === 0) {
    listDiv.innerHTML =
      '<p class="empty">No students added yet. Add one to get started!</p>';
    return;
  }

  let html = "";

  // FOREACH: Loop through each student
  students.forEach((student, index) => {
    html += `
      <div class="student-card">
        <div class="name">${index + 1}. ${student.name}</div>
        <div class="grade-label">Grade:</div>
        <div class="grade">${student.grade}%</div>
      </div>
    `;
  });

  listDiv.innerHTML = html;
}

// ===== CALCULATE AVERAGE (reduce method) =====
function calculateAverage() {
  if (students.length === 0) {
    document.getElementById("averageGrade").innerHTML = "No students";
    return;
  }

  // REDUCE: Sum all grades and divide by count
  const total = students.reduce((sum, student) => sum + student.grade, 0);
  const average = (total / students.length).toFixed(2);

  document.getElementById("averageGrade").innerHTML = `${average}%`;
}

// ===== FIND HIGHEST GRADE (Math.max with map) =====
function findHighest() {
  if (students.length === 0) {
    document.getElementById("highestGrade").innerHTML = "No students";
    return;
  }

  // MAP: Extract only grades
  const grades = students.map((student) => student.grade);
  // MATH.MAX: Find maximum
  const highest = Math.max(...grades);

  document.getElementById("highestGrade").innerHTML = `${highest}%`;
}

// ===== FIND LOWEST GRADE (Math.min with map) =====
function findLowest() {
  if (students.length === 0) {
    document.getElementById("lowestGrade").innerHTML = "No students";
    return;
  }

  // MAP: Extract only grades
  const grades = students.map((student) => student.grade);
  // MATH.MIN: Find minimum
  const lowest = Math.min(...grades);

  document.getElementById("lowestGrade").innerHTML = `${lowest}%`;
}

// ===== FIND TOP PERFORMER (reduce + sort concept) =====
function findTopStudent() {
  if (students.length === 0) {
    document.getElementById("topStudent").innerHTML = "No students";
    return;
  }

  // REDUCE: Find student with highest grade
  const topStudent = students.reduce((top, current) =>
    current.grade > top.grade ? current : top,
  );

  document.getElementById("topStudent").innerHTML =
    `${topStudent.name} (${topStudent.grade}%)`;
}

// ===== FILTER PASSING STUDENTS (filter method) =====
function filterPassing() {
  if (students.length === 0) {
    document.getElementById("passingList").innerHTML = "No students";
    return;
  }

  // FILTER: Get only students with grade >= 50
  const passing = students.filter((student) => student.grade >= 50);

  let html = "";
  if (passing.length === 0) {
    html = "No students passing";
  } else {
    html = "Passing Students (≥50):\n";
    passing.forEach((student) => {
      html += `• ${student.name}: ${student.grade}%\n`;
    });
  }

  document.getElementById("passingList").innerHTML = html;
}

// ===== FILTER EXCELLENT STUDENTS (filter method) =====
function filterExcellent() {
  if (students.length === 0) {
    document.getElementById("excellentList").innerHTML = "No students";
    return;
  }

  // FILTER: Get only students with grade >= 80
  const excellent = students.filter((student) => student.grade >= 80);

  let html = "";
  if (excellent.length === 0) {
    html = "No students with excellent grades";
  } else {
    html = "Excellent Students (≥80):\n";
    excellent.forEach((student) => {
      html += `⭐ ${student.name}: ${student.grade}%\n`;
    });
  }

  document.getElementById("excellentList").innerHTML = html;
}

// ===== ADD BONUS POINTS (map method) =====
function addBonus() {
  if (students.length === 0) {
    document.getElementById("bonusList").innerHTML = "No students";
    return;
  }

  // MAP: Create new array with bonus points
  const withBonus = students.map((student) => ({
    name: student.name,
    originalGrade: student.grade,
    newGrade: Math.min(student.grade + 5, 100), // Cap at 100
  }));

  let html = "After Adding 5 Bonus Points:\n";
  withBonus.forEach((student) => {
    html += `${student.name}: ${student.originalGrade}% → ${student.newGrade}%\n`;
  });

  document.getElementById("bonusList").innerHTML = html;
}

// ===== REMOVE FIRST STUDENT (shift method) =====
function removeFirst() {
  if (students.length === 0) {
    alert("No students to remove");
    return;
  }

  // SHIFT: Remove from beginning
  const removed = students.shift();
  alert(`Removed: ${removed.name}`);
  displayStudents();
}

// ===== REMOVE LAST STUDENT (pop method) =====
function removeLast() {
  if (students.length === 0) {
    alert("No students to remove");
    return;
  }

  // POP: Remove from end
  const removed = students.pop();
  alert(`Removed: ${removed.name}`);
  displayStudents();
}

// ===== CLEAR ALL STUDENTS =====
function clearAll() {
  if (confirm("Are you sure? This will delete all students.")) {
    students = [];
    displayStudents();
    document.getElementById("averageGrade").innerHTML = "-";
    document.getElementById("highestGrade").innerHTML = "-";
    document.getElementById("lowestGrade").innerHTML = "-";
    document.getElementById("topStudent").innerHTML = "-";
  }
}

// ===== SORT BY GRADE =====
function sortByGrade() {
  if (students.length === 0) {
    alert("No students to sort");
    return;
  }

  // SORT: Order by grade (highest first)
  students.sort((a, b) => b.grade - a.grade);
  displayStudents();
  alert("Sorted by grade (highest first)");
}

// ===== LOAD SAMPLE DATA =====
function resetToDefault() {
  students = [
    { name: "Alice Johnson", grade: 95 },
    { name: "Bob Smith", grade: 87 },
    { name: "Charlie Brown", grade: 72 },
    { name: "Diana Prince", grade: 91 },
    { name: "Evan Davis", grade: 68 },
  ];
  displayStudents();
  console.log("✓ Sample data loaded! Total students: " + students.length);
}

// Initialize page - ensure students array is ready
(function init() {
  console.log("Student Grade Manager initialized");
})();
