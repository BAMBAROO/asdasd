const completeBooks = document.querySelector("#completeBookshelfList"),
  inCompleteBooks = document.querySelector("#incompleteBookshelfList"),
  searchBook = document.querySelector("#searchBookTitle"),
  formSearchBook = document.querySelector("#searchBook"),
  formSubmit = document.querySelector("#inputBook");

const RENDER_EVENT = new Event("RENDER");

let todos = []
function untask(id) {
  const elementId = id.getAttribute("id");
  const theElement = todos.find((element) => element.id == elementId);
  theElement.isComplete = false;
  document.dispatchEvent(RENDER_EVENT);
}

function tasked(id) {
  const elementId = id.getAttribute("id");
  const theElement = todos.find((element) => element.id == elementId);
  theElement.isComplete = true;
  document.dispatchEvent(RENDER_EVENT);
}

// Delete Books
function deleteElement(id) {
  const elementId = id.getAttribute("id");
  const index = todos.findIndex((element) => element.id == elementId);
  todos.splice(index, 1);
  id.remove();
  if (todos.length == 0) {
    localStorage.clear()
  }
  document.dispatchEvent(RENDER_EVENT);
}

// Create Element for Books
function createTodo(value) {
  const article = document.createElement("article");
  article.classList.add("book_item");
  article.setAttribute("id", `${value.id}`);

  const div = document.createElement("div");
  div.classList.add("action");

  const judul = document.createElement("h3");
  judul.innerText = value.title;

  const penulis = document.createElement("p");
  penulis.innerText = `Penulis: ${value.author}`;

  const tahun = document.createElement("p");
  tahun.innerText = `Tahun: ${value.year}`;

  const tombolGreen = document.createElement("button");
  tombolGreen.classList.add("green");
  tombolGreen.innerText =
    value.isComplete === true ? "Belum selesai dibaca" : "Selesai dibaca";
  value.isComplete
    ? tombolGreen.setAttribute("onclick", `untask(${value.id})`)
    : tombolGreen.setAttribute("onclick", `tasked(${value.id})`);

  const tombolRed = document.createElement("button");
  tombolRed.classList.add("red");
  tombolRed.innerText = "Hapus Buku";
  tombolRed.setAttribute("onclick", `deleteElement(${value.id})`);

  div.append(tombolGreen, tombolRed);
  article.append(judul, penulis, tahun, div);

  value.isComplete
    ? completeBooks.append(article)
    : inCompleteBooks.append(article);
}

// Create Object or Information Book
function createObject() {
  const id = "b" + +new Date();
  const title = document.querySelector("#inputBookTitle").value;
  const author = document.querySelector("#inputBookAuthor").value;
  const year = document.querySelector("#inputBookYear").value;
  const isComplete = document.querySelector("#inputBookIsComplete").checked;
  return {id, title, author, year, isComplete};
}

// Rendering Function
document.addEventListener("RENDER", (e) => {
  e.preventDefault();
  inCompleteBooks.innerHTML = "";
  completeBooks.innerHTML = "";
  localStorage.setItem("data", JSON.stringify(todos))
  for (const todo of todos) {
    createTodo(todo);
  }
});

// Submit the Book
formSubmit.addEventListener("submit",  (e) => {
  e.preventDefault();
  const objectTodo = createObject();
  todos.push(objectTodo)
  localStorage.setItem("data", JSON.stringify(todos))
  document.dispatchEvent(RENDER_EVENT);
});

// Handling Submit
formSearchBook.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = searchBook.value;
  if (!value) return document.dispatchEvent(RENDER_EVENT);
  inCompleteBooks.innerHTML = "";
  completeBooks.innerHTML = "";
  for (const todo of todos) {
    if (todo.title.toLowerCase().includes(value.toLowerCase())) {
      createTodo(todo);
    }
  }
});

// Handling on Window Reload
window.addEventListener("load", () => {
  todos = JSON.parse(localStorage.getItem("data"));
  if (todos !== null) {
    for (const todo of todos) {
      createTodo(todo);
    }
  } else {
    todos = []
  }
});