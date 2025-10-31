const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

function addTask() {
  const taskText = taskInput.value.trim();
  if (taskText === "") return;

  // Создаем блок задачи
  const taskDiv = document.createElement("div");
  taskDiv.className = "task";

  const taskSpan = document.createElement("span");
  taskSpan.textContent = taskText;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "❌";
  deleteBtn.onclick = () => taskDiv.remove();

  taskDiv.appendChild(taskSpan);
  taskDiv.appendChild(deleteBtn);

  taskList.appendChild(taskDiv);

  taskInput.value = "";
}
