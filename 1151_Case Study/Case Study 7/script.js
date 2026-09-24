const starterTasks = [
  { id: 1, text: "Call Mr. Rahul to confirm appointment", complete: false },
  { id: 2, text: "Prepare patient registration forms", complete: false },
  { id: 3, text: "Update Dr. Sharma's appointment schedule", complete: false },
  { id: 4, text: "Send appointment reminder to patients", complete: false },
];

const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const filterButton = document.querySelector("#filterButton");
const progressNumber = document.querySelector("#progressNumber");
const progressTotal = document.querySelector("#progressTotal");
const navCount = document.querySelector("#navCount");
const toast = document.querySelector("#toast");
let showingActiveOnly = false;
let tasks = loadTasks();

document.querySelector("#todayLabel").textContent = new Intl.DateTimeFormat(
  "en-US",
  {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  },
).format(new Date());

function loadTasks() {
  try {
    const saved = localStorage.getItem("careline-tasks");
    return saved ? JSON.parse(saved) : starterTasks;
  } catch (error) {
    return starterTasks;
  }
}

function saveTasks() {
  localStorage.setItem("careline-tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.replaceChildren();
  const visibleTasks = showingActiveOnly
    ? tasks.filter((task) => !task.complete)
    : tasks;
  visibleTasks.forEach((task) => taskList.append(createTaskElement(task)));
  emptyState.hidden = visibleTasks.length > 0;
  progressTotal.textContent = tasks.length;
  progressNumber.textContent = tasks.filter((task) => task.complete).length;
  navCount.textContent = tasks.filter((task) => !task.complete).length;
}

function createTaskElement(task) {
  const item = document.createElement("article");
  item.className = `task-item${task.complete ? " is-complete" : ""}`;
  item.dataset.taskId = task.id;

  const checkbox = document.createElement("input");
  checkbox.className = "task-check";
  checkbox.type = "checkbox";
  checkbox.checked = task.complete;
  checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);
  checkbox.dataset.action = "toggle";

  const copy = document.createElement("div");
  copy.className = "task-copy";
  copy.textContent = task.text;

  const actions = document.createElement("div");
  actions.className = "task-actions";
  actions.innerHTML = `
    <button class="icon-button" type="button" data-action="edit" aria-label="Edit ${task.text}" title="Edit task">✎</button>
    <button class="icon-button delete" type="button" data-action="delete" aria-label="Delete ${task.text}" title="Delete task">×</button>
  `;

  item.append(checkbox, copy, actions);
  return item;
}

function announce(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(announce.timeout);
  announce.timeout = window.setTimeout(
    () => toast.classList.remove("visible"),
    2400,
  );
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.push({ id: Date.now(), text, complete: false });
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
  announce("Task added to today’s list");
});

taskList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("button[data-action]");
  if (!actionButton) return;
  const taskItem = actionButton.closest("[data-task-id]");
  const taskId = Number(taskItem.dataset.taskId);
  const task = tasks.find((item) => item.id === taskId);
  if (!task) return;

  if (actionButton.dataset.action === "delete") {
    tasks = tasks.filter((item) => item.id !== taskId);
    saveTasks();
    renderTasks();
    announce("Task removed");
  }

  if (actionButton.dataset.action === "edit") {
    startEditing(taskItem, task);
  }
});

taskList.addEventListener("change", (event) => {
  if (!event.target.matches("[data-action='toggle']")) return;
  const taskItem = event.target.closest("[data-task-id]");
  const task = tasks.find(
    (item) => item.id === Number(taskItem.dataset.taskId),
  );
  task.complete = event.target.checked;
  saveTasks();
  renderTasks();
  announce(
    task.complete ? "Task marked complete" : "Task moved back to active",
  );
});

function startEditing(taskItem, task) {
  const copy = taskItem.querySelector(".task-copy");
  const input = document.createElement("input");
  input.className = "task-edit";
  input.value = task.text;
  input.maxLength = 120;
  input.setAttribute("aria-label", "Edit task");
  copy.replaceWith(input);
  input.focus();
  input.select();

  const finishEditing = () => {
    const nextText = input.value.trim();
    if (nextText) task.text = nextText;
    saveTasks();
    renderTasks();
    announce("Task updated");
  };
  input.addEventListener("blur", finishEditing, { once: true });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") input.blur();
    if (event.key === "Escape") {
      input.value = task.text;
      input.blur();
    }
  });
}

filterButton.addEventListener("click", () => {
  showingActiveOnly = !showingActiveOnly;
  filterButton.setAttribute("aria-pressed", String(showingActiveOnly));
  filterButton.innerHTML = `<span class="filter-icon" aria-hidden="true">≡</span> ${showingActiveOnly ? "Show all tasks" : "Show active only"}`;
  renderTasks();
});

renderTasks();
