const apiUrl = "http://localhost:8082/tasks"; 
const taskList = document.getElementById("taskList");
const taskHistory = document.getElementById("taskHistory");

// Fetch all tasks from backend
function fetchTasks() {
  fetch(apiUrl)
    .then(res => res.json())
    .then(tasks => {
      taskList.innerHTML = "";
      taskHistory.innerHTML = "";
      tasks.forEach(task => displayTask(task));
    })
    .catch(err => console.error("Error fetching tasks:", err));
}

// Display task in list & history
function displayTask(task) {
  // Task List Item
  const li = document.createElement("li");
  li.className = "task-item";
  if(task.completed) li.classList.add("completed");

  li.innerHTML = `
    <span>${task.title} - ${task.description} (${task.completed ? 'Completed' : 'Pending'})</span>
    <div>
      <input type="checkbox" ${task.completed ? "checked" : ""} onchange="toggleComplete(${task.id}, this.checked)">
      <button class="edit" onclick="editTask(${task.id})"><i class="fa fa-edit"></i></button>
      <button class="delete" onclick="deleteTask(${task.id})"><i class="fa fa-trash"></i></button>
    </div>
  `;
  taskList.appendChild(li);

  // Task History
  const histLi = document.createElement("li");
  histLi.innerHTML = `<strong>${task.title}</strong> - ${task.description} (Status: ${task.completed ? 'Completed' : 'Pending'}, Added: ${new Date().toLocaleString()})`;
  taskHistory.appendChild(histLi);
}

// Create Task
function createTask() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();

  if(!title) return alert("Task title is required");

  fetch(apiUrl, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ title, description, completed:false })
  })
  .then(res => {
    if(!res.ok) throw new Error("Failed to create task");
    return res.json();
  })
  .then(() => fetchTasks())
  .catch(err => console.error(err));

  // Clear input fields
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
}

// Delete Task
function deleteTask(id) {
  fetch(`${apiUrl}/${id}`, { method: "DELETE" })
    .then(res => {
      if(!res.ok) throw new Error("Failed to delete task");
      fetchTasks();
    })
    .catch(err => console.error(err));
}

// Edit Task
function editTask(id) {
  const newTitle = prompt("New title:");
  const newDescription = prompt("New description:");

  if(!newTitle) return; // title required

  fetch(`${apiUrl}/${id}`)
    .then(res => res.json())
    .then(task => {
      fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          title: newTitle,
          description: newDescription || task.description,
          completed: task.completed
        })
      }).then(() => fetchTasks());
    })
    .catch(err => console.error(err));
}

// Toggle Completed Status
function toggleComplete(id, completed) {
  fetch(`${apiUrl}/${id}`)
    .then(res => res.json())
    .then(task => {
      fetch(`${apiUrl}/${id}`, {
        method: "PUT",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          completed: completed
        })
      }).then(() => fetchTasks());
    })
    .catch(err => console.error(err));
}

// Initial load
fetchTasks();
