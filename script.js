const API_URL = 'https://dummyjson.com/todos';
const taskList = document.getElementById('taskList');
const addBtn = document.getElementById('addBtn');
const newTaskInput = document.getElementById('newTask');
const searchInput = document.getElementById('search');
const pagination = document.getElementById('pagination');

let todos = [];
let currentPage = 1;
const limit = 6;

// === READ (с пагинацией) ===
async function loadTodos(page = 1) {
  const skip = (page - 1) * limit;
  const res = await fetch(`${API_URL}?limit=${limit}&skip=${skip}`);
  const data = await res.json();
  todos = data.todos;
  renderTodos(todos);
  renderPagination(data.total, page);
}

// === CREATE ===
async function addTodo() {
  const text = newTaskInput.value.trim();
  if (!text) return alert('Введите задачу!');

  const res = await fetch(`${API_URL}/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      todo: text,
      completed: false,
      userId: 1
    })
  });

  const newTodo = await res.json();
  todos.unshift(newTodo);
  renderTodos(todos);
  newTaskInput.value = '';
}

// === UPDATE (выполнение) ===
async function toggleTodo(id) {
  const todo = todos.find(t => t.id === id);
  todo.completed = !todo.completed;

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: todo.completed })
  });

  renderTodos(todos);
}

// === UPDATE (редактирование текста) ===
async function editTodoTitle(id, newText) {
  const todo = todos.find(t => t.id === id);
  todo.todo = newText;

  await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ todo: newText })
  });

  renderTodos(todos);
}

// === DELETE ===
async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  todos = todos.filter(t => t.id !== id);
  renderTodos(todos);
}

// === SEARCH ===
function filterTodos() {
  const query = searchInput.value.toLowerCase();
  const filtered = todos.filter(t => t.todo.toLowerCase().includes(query));
  renderTodos(filtered);
}

// === PAGINATION ===
function renderPagination(total, page) {
  const totalPages = Math.ceil(total / limit);
  pagination.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = '← Назад';
  prevBtn.disabled = page === 1;
  prevBtn.onclick = () => {
    if (currentPage > 1) {
      currentPage--;
      loadTodos(currentPage);
    }
  };

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Вперёд →';
  nextBtn.disabled = page === totalPages;
  nextBtn.onclick = () => {
    if (currentPage < totalPages) {
      currentPage++;
      loadTodos(currentPage);
    }
  };

  const info = document.createElement('span');
  info.textContent = `Страница ${page} из ${totalPages}`;

  pagination.append(prevBtn, info, nextBtn);
}

// === RENDER ===
function renderTodos(list) {
  taskList.innerHTML = '';
  list.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';

    // кружок
    const circle = document.createElement('div');
    circle.className = 'circle';
    circle.onclick = () => toggleTodo(todo.id);

    // текст задачи
    const span = document.createElement('span');
    span.textContent = todo.todo;

    // редактирование при двойном клике
    span.ondblclick = () => {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = todo.todo;
      input.classList.add('edit-input');

      input.onblur = () => {
        const newText = input.value.trim();
        if (newText && newText !== todo.todo) editTodoTitle(todo.id, newText);
        else renderTodos(todos);
      };

      input.onkeydown = (e) => {
        if (e.key === 'Enter') input.blur();
      };

      li.replaceChild(input, span);
      input.focus();
    };

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑';
    delBtn.classList.add('action');
    delBtn.onclick = () => deleteTodo(todo.id);

    li.append(circle, span, delBtn);
    taskList.appendChild(li);
  });
}

// === EVENT LISTENERS ===
addBtn.addEventListener('click', addTodo);
searchInput.addEventListener('input', filterTodos);
window.addEventListener('DOMContentLoaded', () => loadTodos(currentPage));
