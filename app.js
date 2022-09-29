let toDoList = []; // This array will hold the To Do List items.

function renderToDo(todo) {
  localStorage.setItem("todoItemsRef", JSON.stringify(toDoList)); // This persists application state's to the browser's local storage
  //This function will render the to do list.

  const list = document.querySelector(".todo-list"); // select the first element with a class of 'todo-list'

  const item = document.querySelector(`[data-key='${todo.id}']`); // select the current todo item in the DOM

  if (todo.deleted) {
    // remove the item from the DOM
    item.remove();

    if (todoItems.length === 0) list.innerHTML = "";
    return;
  }

  const isChecked = todo.checked ? "done" : ""; // check if todo.checked is true, if so assign 'done' to ischecked. otherwise assign empty string

  const node = document.createElement("li"); // create a li element and assign it to the 'node'

  node.setAttribute("class", `todo-item ${isChecked}`); // set the class attribute

  node.setAttribute("data-key", todo.id); // set the data-key attribute to the id of todo

  // Set the contents of li element created above.
  node.innerHTML = `
    <input id="${todo.id}" type="checkbox" />
    <label for="${todo.id}" class="tick js-tick"></label>
    <span>${todo.text}</span>
    <button class="delete-todo js-delete-todo">
    <svg><use href="#delete-icon"></use></svg>
    </button>
    `;

  if (item) {
    // if the item already exists in the DOM

    list.replaceChild(node, item);
  } else {
    list.append(node);
  }
}

function addTodo(text) {
  // This function will add items to the To do List array.
  const todo = {
    text,
    checked: false,
    id: Date.now(),
  };
  toDoList.push(todo);
  renderToDo(todo);
}

function toggleDone(key) {
  const index = toDoList.findIndex((item) => item.id === Number(key)); // Locate the todo item in the array and set its checked property to the opposite.

  toDoList[index].checked = !toDoList[index].checked;

  renderToDo(toDoList[index]);
}

function deleteToDo(key) {
  const index = toDoList.findIndex((item) => item.id === Number(key)); // Find the corresponding to do object in the array.

  const todo = {
    // Create a new object with properties of the current to do item and a deleted property which is set to true
    deleted: true,
    ...toDoList[index],
  };

  toDoList = toDoList.filter(item => item.id !== Number(key)); // Remove the todo item from the array by filtering it out
  renderToDo(todo);
}

const form = document.querySelector(".toDoForm"); // Select the form element

form.addEventListener("submit", (event) => {
  event.preventDefault(); // prevent the page from refreshing upon submission

  const input = document.querySelector(".todo-input"); // select the text input

  const text = input.value.trim(); // get the input and trim the whitespaces

  if (text !== "") {
    addTodo(text);
    input.value = "";
    input.focus();
  }
});

const list = document.querySelector(".todo-list"); // Select the entire list.

list.addEventListener("click", (event) => {
  // Add a click event listener to the list and its children
  if (event.target.classList.contains("js-tick")) {
    const itemKey = event.target.parentElement.dataset.key;
    toggleDone(itemKey);
  }
  if (event.target.classList.contains("delete-todo")) {
    const itemKey = event.target.parentElement.dataset.key;
    deleteToDo(itemKey);
  }
});

document.addEventListener('DOMContentLoaded', () => {
    const ref = localStorage.getItem('todoItemsRef');
    if (ref) {
      todoItems = JSON.parse(ref);
      todoItems.forEach(t => {
        renderToDo(t);
      });
    }
  });