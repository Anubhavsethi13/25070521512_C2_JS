const taskForm = document.querySelector("#taskForm");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const emptyState = document.querySelector("#emptyState");
const emptyTitle = document.querySelector("#emptyTitle");
const emptyDescription = document.querySelector("#emptyDescription");
const taskMessage = document.querySelector("#taskMessage");
const completedCount = document.querySelector("#completedCount");
const totalCount = document.querySelector("#totalCount");
const filterButtons = document.querySelectorAll(".filter-button");

let tasks = JSON.parse(localStorage.getItem("daymark-tasks") || "[]");
let activeFilter = "all";
let clearNewTaskTimer;

function saveTasks() {
  localStorage.setItem("daymark-tasks", JSON.stringify(tasks));
}

function getVisibleTasks() {
  if (activeFilter === "active") return tasks.filter((task) => !task.completed);
  if (activeFilter === "completed")
    return tasks.filter((task) => task.completed);
  return tasks;
}

function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = `task-item${task.completed ? " is-complete" : ""}${task.justAdded ? " is-new" : ""}`;
  item.dataset.id = task.id;

  const checkbox = document.createElement("input");
  checkbox.className = "task-check";
  checkbox.type = "checkbox";
  checkbox.checked = task.completed;
  checkbox.setAttribute("aria-label", `Mark ${task.text} as complete`);
  checkbox.dataset.action = "toggle";

  const text = document.createElement(task.editing ? "input" : "span");
  text.className = task.editing ? "task-edit-input" : "task-text";
  if (task.editing) {
    text.value = task.text;
    text.maxLength = 100;
    text.setAttribute("aria-label", "Edit task");
  } else {
    text.textContent = task.text;
  }

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editButton = document.createElement("button");
  editButton.className = "task-action";
  editButton.type = "button";
  editButton.textContent = task.editing ? "Save" : "Edit";
  editButton.dataset.action = task.editing ? "save" : "edit";

  const deleteButton = document.createElement("button");
  deleteButton.className = "task-action delete";
  deleteButton.type = "button";
  deleteButton.textContent = task.editing ? "Cancel" : "Delete";
  deleteButton.dataset.action = task.editing ? "cancel" : "delete";

  actions.append(editButton, deleteButton);
  item.append(checkbox, text, actions);
  if (task.editing) text.focus();
  return item;
}

function renderTasks({ celebrate = false } = {}) {
  taskList.replaceChildren();
  const visibleTasks = getVisibleTasks();
  visibleTasks.forEach((task) => taskList.append(createTaskElement(task)));

  const completed = tasks.filter((task) => task.completed).length;
  completedCount.textContent = completed;
  totalCount.textContent = tasks.length;
  if (celebrate) {
    completedCount.classList.remove("count-pop");
    void completedCount.offsetWidth;
    completedCount.classList.add("count-pop");
  }
  taskMessage.textContent =
    tasks.length === 0
      ? "Start with one small thing."
      : `${tasks.length - completed} ${tasks.length - completed === 1 ? "task" : "tasks"} still in motion.`;

  const hasNoVisibleTasks = visibleTasks.length === 0;
  emptyState.hidden = !hasNoVisibleTasks;
  if (hasNoVisibleTasks && tasks.length > 0) {
    emptyTitle.textContent =
      activeFilter === "completed" ? "Nothing done yet." : "All clear.";
    emptyDescription.textContent =
      activeFilter === "completed"
        ? "Completed tasks will collect here."
        : "You have finished every task in this view.";
  } else {
    emptyTitle.textContent = "Nothing here yet.";
    emptyDescription.textContent =
      "Add a task above and give your attention somewhere useful to land.";
  }

  clearTimeout(clearNewTaskTimer);
  clearNewTaskTimer = window.setTimeout(() => {
    tasks.forEach((task) => delete task.justAdded);
    saveTasks();
  }, 420);
}

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  tasks.unshift({ id: `${Date.now()}`, text, completed: false });
  saveTasks();
  tasks[0].justAdded = true;
  renderTasks();
  taskForm.reset();
  taskInput.focus();
});

taskList.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-action]");
  if (!actionButton || actionButton.tagName === "INPUT") return;
  const item = actionButton.closest(".task-item");
  const task = tasks.find((currentTask) => currentTask.id === item.dataset.id);
  if (!task) return;

  if (actionButton.dataset.action === "delete") {
    tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
  } else if (actionButton.dataset.action === "edit") {
    task.editing = true;
  } else if (actionButton.dataset.action === "save") {
    const editInput = item.querySelector(".task-edit-input");
    const trimmedText = editInput.value.trim();
    if (!trimmedText) return;
    task.text = trimmedText;
    delete task.editing;
  } else if (actionButton.dataset.action === "cancel") {
    delete task.editing;
  }
  saveTasks();
  renderTasks();
});

taskList.addEventListener("change", (event) => {
  if (event.target.dataset.action !== "toggle") return;
  const item = event.target.closest(".task-item");
  const task = tasks.find((currentTask) => currentTask.id === item.dataset.id);
  if (!task) return;
  task.completed = event.target.checked;
  saveTasks();
  renderTasks({ celebrate: task.completed });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTasks();
  });
});

renderTasks();
