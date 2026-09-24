const form = document.getElementById("admissionForm");
const planSelect = document.getElementById("plan");
const planNote = document.getElementById("planNote");
const formStatus = document.getElementById("formStatus");

const fields = {
  fullName: {
    element: document.getElementById("fullName"),
    validate(value) {
      return /^[A-Za-z]+(?: [A-Za-z]+)*$/.test(value.trim()) &&
        value.trim().length >= 2
        ? "Looks good."
        : "Use alphabet characters only.";
    },
  },
  email: {
    element: document.getElementById("email"),
    validate(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? "Looks good."
        : "Enter a valid email address.";
    },
  },
  phone: {
    element: document.getElementById("phone"),
    validate(value) {
      const digits = value.replace(/\D/g, "");
      return digits.length === 10
        ? "Looks good."
        : "Enter a 10 digit phone number.";
    },
  },
  age: {
    element: document.getElementById("age"),
    validate(value) {
      const age = Number(value);
      return age >= 16 && age <= 90
        ? "Looks good."
        : "Members must be between 16 and 90.";
    },
  },
  plan: {
    element: planSelect,
    validate(value) {
      return value ? "Plan selected." : "Choose a membership plan.";
    },
  },
};

function setFieldState(fieldName) {
  const field = fields[fieldName];
  const group = field.element.closest(".field-group");
  const message = document.getElementById(`${fieldName}Message`);
  const result = field.validate(field.element.value);
  const isValid = result.includes("good") || result.includes("selected");

  group.classList.toggle("valid", isValid);
  group.classList.toggle("invalid", !isValid && field.element.value.length > 0);
  message.textContent = field.element.value ? result : "";
  return isValid;
}

Object.keys(fields).forEach((fieldName) => {
  if (fieldName === "fullName") {
    return;
  }

  fields[fieldName].element.addEventListener("input", () => {
    setFieldState(fieldName);
    formStatus.textContent = "";
  });
});

fields.fullName.element.addEventListener("input", (event) => {
  event.target.value = event.target.value.replace(/[^A-Za-z ]/g, "");
  setFieldState("fullName");
  formStatus.textContent = "";
});

planSelect.addEventListener("change", () => {
  const planDetails = {
    starter: "Starter gives you 3 training days every week.",
    unlimited: "Unlimited unlocks every class and open-gym hour.",
    coaching: "Coaching pairs you with a trainer for focused 1:1 work.",
  };
  const selectedPlan = planSelect.value;
  planNote.querySelector("span:last-child").textContent =
    planDetails[selectedPlan] || "Select a plan to see your access level.";
  setFieldState("plan");
  formStatus.textContent = "";
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formIsValid = Object.keys(fields).every(setFieldState);

  if (!formIsValid) {
    formStatus.textContent = "Check the highlighted fields before submitting.";
    formStatus.style.color = "var(--error)";
    return;
  }

  const name = encodeURIComponent(fields.fullName.element.value.trim());
  const plan = encodeURIComponent(
    planSelect.options[planSelect.selectedIndex].textContent,
  );
  window.location.href = `thankyou.html?name=${name}&plan=${plan}`;
});
