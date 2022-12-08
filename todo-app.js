// Массив, где хранятся все дела
let todos = [];
let listNumder;

// Создать и вернуть заголовок
function createAppTitle(title) {
  let todoTitle = document.createElement('h1');
  todoTitle.textContent = title;

  return todoTitle;
}

// Создать и вернуть форму и ее элементы (в виде объекта)
function createTodoForm() {
  let form = document.createElement('form');
  let input = document.createElement('input');
  let btnWrapper = document.createElement('div');
  let btnAdd = document.createElement('button');

  form.className = 'input-group mb-3';

  input.className = 'form-control';
  input.placeholder = 'Введите название нового дела';

  btnWrapper.className = 'input-group-append';
  btnAdd.className = 'btn btn-primary';
  btnAdd.textContent = 'Добавить';
  btnAdd.disabled = true;

  input.addEventListener('input', function () {
    (input.value) ? btnAdd.disabled = false : btnAdd.disabled = true; // если input не пустой, то кнопка активна
  });

  form.append(input, btnWrapper);
  btnWrapper.append(btnAdd);

  return { form, input, btnAdd };
}

// Создать и вернуть список
function createTodoList() {
  let list = document.createElement('ul');
  list.className = 'list-group';

  return list;
}

// Создать и вернуть элемент (в виде объекта)
function createTodoItem(obj) {
  let item = document.createElement('li');
  let btnGroup = document.createElement('div');
  let doneBtn = document.createElement('button');
  let deleteBtn = document.createElement('button');

  item.className = 'list-group-item d-flex justify-content-between align-items-center';
  item.textContent = obj.name;

  btnGroup.className = 'btn-group btn-group-sm';
  doneBtn.className = 'btn btn-success mr-1';
  doneBtn.textContent = 'Готово';
  deleteBtn.className = 'btn btn-danger';
  deleteBtn.textContent = 'Удалить';

  if (obj.done) { item.classList.toggle('list-group-item-success'); }

  doneBtn.addEventListener('click', function () {
    obj.done = !obj.done;
    saveList(todos, listNumder);
    item.classList.toggle('list-group-item-success');
  });

  deleteBtn.addEventListener('click', function () {
    if (confirm('Вы уверены?')) {
      let indexObj = todos.indexOf(obj); // индекс объекта
      todos.splice(indexObj, 1); // удалить объект
      saveList(todos, listNumder);
      item.remove();
    }
  });

  item.append(btnGroup);
  btnGroup.append(doneBtn, deleteBtn);

  return { item, doneBtn, deleteBtn };
}

// Добавить заголовок, форму и список в DOM дерево, обработать событие "submit" и добавить элемент в DOM
function createTodoApp(container, title, list, defList = []) {
  let todoTitle = createAppTitle(title);
  let todoForm = createTodoForm();
  let todoList = createTodoList();

  container.append(todoTitle, todoForm.form, todoList);

  listNumder = list;

  let localData = localStorage.getItem(listNumder);

  if (localData !== '' && localData !== null) {
    todos = JSON.parse(localData);
  } else {
    todos = defList;
    saveList(todos, listNumder);
  }

  for (let i = 0; i < todos.length; i++) {
    let todoItem = createTodoItem(todos[i]);
    todoList.append(todoItem.item);
  }

  todoForm.form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!todoForm.input.value) { return };

    let newItem = {
      name: todoForm.input.value,
      done: false
    };

    todos.push(newItem);

    saveList(todos, listNumder);

    let todoItem = createTodoItem(newItem);

    todoList.append(todoItem.item);
    todoForm.input.value = '';
    todoForm.btnAdd.disabled = true;
  });
}

function saveList(array, listName) {
  localStorage.setItem(listName, JSON.stringify(array));
}
