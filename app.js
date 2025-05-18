let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let editId = null;

const taskTitle = document.getElementById("taskTitle");
const taskDeadline = document.getElementById("taskDeadline");
const taskPriority = document.getElementById("taskPriority");
const taskList = document.getElementById("taskList");
const addTaskBtn = document.getElementById("addTaskBtn");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}






function renderTasks() {
  taskList.innerHTML = "";

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed - b.completed;
    const priorityOrder = { High: 1, Medium: 2, Low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.deadline) - new Date(b.deadline);
  });

  for (const task of sortedTasks) {
    const taskDiv = document.createElement("div");
    taskDiv.className = `task ${task.priority.toLowerCase()} ${task.completed ? "completed" : ""}`;

    taskDiv.innerHTML = `
      <div>
        <input type="checkbox" ${task.completed ? "checked" : ""} onclick="toggleComplete(${task.id})">
        <strong>${task.text}</strong> 
      </div>
      <div class="task-controls">
        Priority: ${task.priority} | Deadline: ${new Date(task.deadline).toLocaleDateString()} | 
        Status: ${task.completed ? "Completed" : "Pending"}
        <br>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    taskList.appendChild(taskDiv);
  }
}

function addOrUpdateTask() {
  const text = taskTitle.value.trim();
  const deadline = taskDeadline.value;
  const priority = taskPriority.value;

  if (!text || !deadline) return;

  if (editId !== null) {
    tasks = tasks.map((task) =>
      task.id === editId ? { ...task, text, priority, deadline } : task
    );
    editId = null;
    addTaskBtn.textContent = "Add Task";
  } else {
    const newTask = {
      id: Date.now(),
      text,
      deadline,
      priority,
      completed: false,
    };
    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  taskTitle.value = "";
  taskDeadline.value = "";
  taskPriority.value = "Medium";
}

function toggleComplete(id) {
  tasks = tasks.map(task =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  taskTitle.value = task.text;
  taskDeadline.value = task.deadline;
  taskPriority.value = task.priority;
  editId = id;
  addTaskBtn.textContent = "Update Task";
}

addTaskBtn.onclick = addOrUpdateTask;
renderTasks();
