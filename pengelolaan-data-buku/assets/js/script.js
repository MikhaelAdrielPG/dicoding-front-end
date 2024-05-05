document.addEventListener("DOMContentLoaded", function () {
  const bookForm = document.getElementById("book-form");
  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  displayBooks();
});

const STORAGE_KEY = "BOOKS";

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function saveData(data) {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

function loadData() {
  if (isStorageExist()) {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data !== null) {
      return JSON.parse(data);
    } else {
      return [];
    }
  }
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = parseInt(document.getElementById("year").value);

  const newBook = {
    id: +new Date(),
    title,
    author,
    year,
    isCompleted: false,
  };

  const books = loadData();
  books.push(newBook);
  saveData(books);
  displayBooks();
  resetForm();
}

function displayBooks() {
  const unfinishedBooksList = document.getElementById("unfinished-books");
  const finishedBooksList = document.getElementById("finished-books");

  unfinishedBooksList.innerHTML = "";
  finishedBooksList.innerHTML = "";

  const books = loadData();
  books.forEach((book) => {
    const newBook = createBookElement(book);
    if (book.isCompleted) {
      finishedBooksList.appendChild(newBook);
    } else {
      unfinishedBooksList.appendChild(newBook);
    }
  });
}

function createBookElement(book) {
  const li = document.createElement("li");
  li.innerHTML = `<strong>${book.title}</strong> - ${book.author} (${book.year})`;

  const actionButton = document.createElement("button");
  actionButton.innerText = book.isCompleted ? "Kembalikan" : "Selesai";
  actionButton.addEventListener("click", function () {
    toggleBookStatus(book);
  });

  const deleteButton = document.createElement("button");
  deleteButton.innerText = "Hapus";
  deleteButton.addEventListener("click", function () {
    deleteBook(book);
  });

  li.appendChild(actionButton);
  li.appendChild(deleteButton);

  return li;
}

function toggleBookStatus(book) {
  book.isCompleted = !book.isCompleted;
  const books = loadData();
  const index = books.findIndex((b) => b.id === book.id);
  books[index] = book;
  saveData(books);
  displayBooks();
}

function deleteBook(book) {
  const confirmation = confirm(
    `Apakah Anda yakin ingin menghapus buku "${book.title}"?`
  );
  if (confirmation) {
    const books = loadData();
    const index = books.findIndex((b) => b.id === book.id);
    if (index !== -1) {
      books.splice(index, 1);
      saveData(books);
      displayBooks();
    }
  }
}

function resetForm() {
  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  document.getElementById("year").value = "";
}
