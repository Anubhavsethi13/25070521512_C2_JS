const form = document.getElementById("jobApplication");
const statusMessage = document.getElementById("formStatus");
const dateOfBirth = document.getElementById("dateOfBirth");
const sections = [...form.querySelectorAll(".form-section")];
const stepChips = [...document.querySelectorAll(".step-chip")];
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const stepCount = document.getElementById("stepCount");
let currentStep = 0;

const fieldMessages = {
  fullName: "Enter your full name.",
  dateOfBirth: "Enter a valid date of birth.",
  email: "Enter a valid email address.",
  mobile: "Enter exactly 10 digits.",
  address: "Enter your complete address.",
  cityState: "Enter your city and state.",
  pinCode: "Enter exactly 6 digits.",
  qualification: "Select your highest qualification.",
  passingYear: "Enter a year between 1950 and 2026.",
  university: "Enter your university or institute.",
  percentage: "Enter a valid percentage or CGPA.",
  position: "Enter the job position you want to apply for.",
  experience: "Enter your experience in years.",
  salary: "Enter your expected annual salary.",
  organization: "Enter your current or previous organization.",
  designation: "Enter your current designation.",
  programmingLanguages: "List at least one programming language.",
  technicalSkills: "List at least one technical skill.",
};

const today = new Date();
dateOfBirth.max = today.toISOString().split("T")[0];
showStep(0);

function getFieldMessage(field) {
  if (field.validity.valueMissing)
    return fieldMessages[field.name] || "This field is required.";
  if (field.validity.typeMismatch)
    return fieldMessages[field.name] || "Enter a valid value.";
  if (field.validity.patternMismatch)
    return fieldMessages[field.name] || "Use the requested format.";
  if (field.validity.rangeUnderflow || field.validity.rangeOverflow)
    return (
      fieldMessages[field.name] || "Enter a value within the allowed range."
    );
  if (field.validity.badInput) return "Enter a valid number.";
  if (field.validity.tooShort)
    return fieldMessages[field.name] || "Add a little more detail.";
  return "";
}

function showFieldState(field) {
  const error = document.getElementById(`${field.id}Error`);
  if (!error) return field.checkValidity();

  const message = field.validity.valid ? "" : getFieldMessage(field);
  field.setAttribute("aria-invalid", String(Boolean(message)));
  error.textContent = message;
  return !message;
}

function validateForm() {
  let isValid = true;
  const fields = form.querySelectorAll(
    'input:not([type="radio"]), select, textarea',
  );
  fields.forEach((field) => {
    if (!showFieldState(field)) isValid = false;
  });

  const genderError = document.getElementById("genderError");
  const genderSelected = form.querySelector('input[name="gender"]:checked');
  genderError.textContent = genderSelected ? "" : "Select an option.";
  isValid = Boolean(genderSelected) && isValid;

  return isValid;
}

function validateSection(section) {
  let isValid = true;
  section
    .querySelectorAll('input:not([type="radio"]), select, textarea')
    .forEach((field) => {
      if (!showFieldState(field)) isValid = false;
    });

  const genderSelected = form.querySelector('input[name="gender"]:checked');
  const genderError = document.getElementById("genderError");
  if (section.contains(genderError)) {
    genderError.textContent = genderSelected ? "" : "Select an option.";
    isValid = Boolean(genderSelected) && isValid;
  }
  return isValid;
}

function showStep(step) {
  currentStep = step;
  sections.forEach((section, index) => {
    section.classList.toggle("active", index === step);
    section.setAttribute("aria-hidden", String(index !== step));
  });
  stepChips.forEach((chip, index) => {
    const isActive = index === step;
    chip.classList.toggle("active", isActive);
    if (isActive) chip.setAttribute("aria-current", "step");
    else chip.removeAttribute("aria-current");
  });
  backButton.hidden = step === 0;
  nextButton.hidden = step === sections.length - 1;
  document.querySelector(".submit-button").hidden = step !== sections.length - 1;
  stepCount.textContent = `Step ${step + 1} of ${sections.length}`;
  window.scrollTo({ top: document.querySelector(".application-form").offsetTop - 24, behavior: "smooth" });
}

form
  .querySelectorAll('input:not([type="radio"]), select, textarea')
  .forEach((field) => {
    field.addEventListener("input", () => {
      showFieldState(field);
      statusMessage.textContent = "";
      statusMessage.classList.remove("success");
    });
    field.addEventListener("blur", () => showFieldState(field));
  });

form.querySelectorAll('input[name="gender"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    document.getElementById("genderError").textContent = "";
    statusMessage.textContent = "";
  });
});

nextButton.addEventListener("click", () => {
  if (!validateSection(sections[currentStep])) {
    statusMessage.textContent = "Please complete this step before continuing.";
    statusMessage.classList.remove("success");
    const firstInvalid = sections[currentStep].querySelector(
      '[aria-invalid="true"], input[name="gender"]:invalid',
    );
    firstInvalid?.focus();
    return;
  }
  statusMessage.textContent = "";
  showStep(currentStep + 1);
});

backButton.addEventListener("click", () => {
  if (currentStep > 0) showStep(currentStep - 1);
});

stepChips.forEach((chip, index) => {
  chip.addEventListener("click", () => {
    if (index <= currentStep) showStep(index);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const isValid = validateForm();

  if (!isValid) {
    statusMessage.textContent =
      "Please correct the highlighted fields before submitting.";
    statusMessage.classList.remove("success");
    const firstInvalid = form.querySelector(
      '[aria-invalid="true"], input[name="gender"]:invalid',
    );
    firstInvalid?.focus();
    return;
  }

  statusMessage.textContent =
    "Application validated successfully. Thank you for applying.";
  statusMessage.classList.add("success");
});
