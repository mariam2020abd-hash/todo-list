/**
 * To-Do List Application
 * Vanilla JavaScript with localStorage persistence
 */

const STORAGE_KEY = "todoListTasks";

// DOM element references
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const errorMessage = document.getElementById("error-message");
const taskList = document.getElementById("task-list");
const totalCountEl = document.getElementById("total-count");
const completedCountEl = document.getElementById("completed-count");
const emptyState = document.getElementById("empty-state");

/** In-memory task store */
let tasks = [];

/**
 * Initialize the application: load saved tasks and bind events.
 */
function init() {
  loadTasks();
  renderTasks();
  updateCounters();
  bindEvents();
}

/**
 * Attach event listeners to form and task list.
 */
function bindEvents() {
  taskForm.addEventListener("submit", handleAddTask);

  // Clear error styling when user starts typing
  taskInput.addEventListener("input", clearError);

  // Event delegation for checkbox toggle and delete buttons
  taskList.addEventListener("click", handleTaskListClick);
}

/**
 * Handle form submission to add a new task.
 * @param {Event} event
 */
function handleAddTask(event) {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    showError("Please enter a task before adding.");
    return;
  }

  clearError();
  addTask(text);
  taskInput.value = "";
  taskInput.focus();
}

/**
 * Handle clicks on the task list (toggle complete / delete).
 * @param {Event} event
 */
function handleTaskListClick(event) {
  const target = event.target;
  const taskItem = target.closest(".task-item");

  if (!taskItem) return;

  const taskId = taskItem.dataset.id;

  if (target.classList.contains("task-checkbox")) {
    toggleTask(taskId);
  } else if (target.classList.contains("btn-delete")) {
    deleteTask(taskId);
  }
}

/**
 * Create and store a new task.
 * @param {string} text - Task description
 */
function addTask(text) {
  const task = {
    id: Date.now().toString(),
    text,
    completed: false,
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  updateCounters();
}

/**
 * Toggle the completed state of a task.
 * @param {string} id - Task ID
 */
function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();
  renderTasks();
  updateCounters();
}

/**
 * Remove a task by ID.
 * @param {string} id - Task ID
 */
function deleteTask(id) {
  tasks = tasks.filter((t) => t.id !== id);
  saveTasks();
  renderTasks();
  updateCounters();
}

/**
 * Render all tasks into the DOM.
 */
function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.className = `task-item${task.completed ? " completed" : ""}`;
    li.dataset.id = task.id;

    li.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""} aria-label="Mark task as complete">
      <span class="task-text">${escapeHtml(task.text)}</span>
      <button type="button" class="btn btn-delete" aria-label="Delete task">Delete</button>
    `;

    taskList.appendChild(li);
  });

  // Show or hide the empty state message
  emptyState.classList.toggle("hidden", tasks.length > 0);
}

/**
 * Update total and completed task counters in the UI.
 */
function updateCounters() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;

  totalCountEl.textContent = total;
  completedCountEl.textContent = completed;
}

/**
 * Display an error message and highlight the input field.
 * @param {string} message - Error text to display
 */
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.add("visible");
  taskInput.classList.add("input-error");
  taskInput.focus();
}

/**
 * Clear error message and input highlight.
 */
function clearError() {
  errorMessage.textContent = "";
  errorMessage.classList.remove("visible");
  taskInput.classList.remove("input-error");
}

/**
 * Save the current tasks array to localStorage.
 */
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

/**
 * Load tasks from localStorage into the in-memory store.
 */
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch {
      tasks = [];
    }
  }
}

/**
 * Escape HTML special characters to prevent XSS.
 * @param {string} text - Raw user input
 * @returns {string} Safe HTML string
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Start the app when the DOM is ready
document.addEventListener("DOMContentLoaded", init);
