const BASE_URL = 'http://localhost:8000'

// Get todos from API
// TODO: set proper UI when response failed


// () => Todo
async function getTodos() {
  try {
    const response = await fetch(`${BASE_URL}/todo`);
    const todos = await response.json();
    return todos;
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
}

// Add new todo via API
// ({todoText: string, is_done: bool = false}) => {status: string, data: {name: string, is_done: bool}[] } 
async function addTodo({todoText, is_done = false}) {
  try {
    const response = await fetch(`${BASE_URL}/todo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: todoText, is_done}),
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding todo:", error);
  }
}

// Delete todo via API
// (todoId: int) => void
async function deleteTodo(todoId) {
  try {
      await fetch(`${BASE_URL}/todo/${todoId}`, {
      method: "DELETE",
      });
  } catch (error) {
      console.error("Error deleting todo:", error);
  }
}

// Update todo via API
// (todoId: numeric, updatedDate: {name: string, is_done: boolean}) => {success: string}
async function updateTodo(todoId, updatedData) {
  try {
    const response = await fetch(
      `${BASE_URL}/todo/${todoId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      }
    );
    return await response.json()['data'];
  } catch (error) {
    console.error("Error updating todo:", error);
  }
}

function addTodoToList(todo) {
  const todoList = document.getElementById("todo-list");
  const todoItem = document.createElement("div");
  todoItem.classList.add("todo-item");
  todoItem.dataset.id = todo.id;
  todoItem.innerHTML = `
    <input type="checkbox" ${todo.is_done ? "checked" : ""}>
    <span>${todo.name}</span>
    <div class="actions">
      <button type="button" class="edit-todo-btn">Edit</button>
      <button type="button" class="delete-todo-btn">Hapus</button>
    </div>
  `;

  // Delete functionality
  todoItem
    .querySelector(".delete-todo-btn")
    .addEventListener("click", async () => {
      await deleteTodo(todo.id);
      todoItem.remove();
    });

  // Edit functionality
  todoItem
    .querySelector(".edit-todo-btn")
    .addEventListener("click", async () => {
      const span = todoItem.querySelector("span");
      const newText = prompt("Edit tugas:", span.textContent);
      if (newText) {
        const updatedTodo = await updateTodo(todo.id, { name: newText });
        if (updatedTodo) {
          span.textContent = newText;
        }
      }
    });

  // Checkbox functionality
  todoItem
    .querySelector('input[type="checkbox"]')
    .addEventListener("change", async (e) => {
      await updateTodo(todo.id, { is_done: e.target.checked });
    });

  todoList.appendChild(todoItem);
}

  // Add todo button event listener
document
  .getElementById("add-todo-btn")
  .addEventListener("click", async () => {
    const todoInput = document.getElementById("todo-input");
    const todoText = todoInput.value.trim();

    if (todoText !== "") {
      const newTodo = await addTodo({todoText: todoText});
      if (newTodo) {
        addTodoToList(newTodo);

        // Reset the input value
        todoInput.value = "";
      }
    }
  });

  // Initialize app
async function initApp() {
  const todos = await getTodos();
  console.log(todos)
  if (todos) {
    todos.forEach((todo) => addTodoToList(todo));
  }
}

async function patchTodo(todoId, partialUpdate) {
  try {
    const response = await fetch(
      `${BASE_URL}/todo/${todoId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(partialUpdate),
      }
    );
    return await response.json()['data'];
  } catch (error) {
    console.error("Error patching todo:", error);
  }
}

initApp();