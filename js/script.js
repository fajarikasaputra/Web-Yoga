const books = []
const RENDER_EVENT = "render-book" //Nama Custom Event
const SAVED_EVENT = "save-book"
const STORAGE_KEY = "bookshelf-app"

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser anda tidak mendukung 'Local Storage'")
    return false
  }
  return true
}

function saveToStorage() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books)
    localStorage.setItem(STORAGE_KEY, parsed)
    document.dispatchEvent(new Event(SAVED_EVENT))
  }
}

function loadFromStorage() {
  const bookData = localStorage.getItem(STORAGE_KEY)
  let data = JSON.parse(bookData)

  if (data !== null) {
    for (const book of data) {
      books.push(book)
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT))
}

const generateID = () => {
  return +new Date()
}

function generateBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  }
}

function addBook() {
  const id = generateID()
  const title = document.getElementById("bookTitle").value
  const author = document.getElementById("bookAuthor").value
  const year = document.getElementById("bookYear").value
  const isComplete = document.getElementById("bookIsComplete")

  const booksObject = generateBook(id, title, author, year, isComplete.checked)
  books.push(booksObject)

  document.dispatchEvent(new Event(RENDER_EVENT))
  saveToStorage()
}

function clearForm() {
  document.getElementById("bookTitle").value = ""
  document.getElementById("bookAuthor").value = ""
  document.getElementById("bookYear").value = ""
  document.getElementById("bookIsComplete").checked = false

  document.dispatchEvent(new Event(RENDER_EVENT))
}

function removeBook(bookID) {
  const idTarget = findBookID(bookID)

  if (idTarget === -1) return

  books.splice(idTarget, 1)
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveToStorage()
}

const addToReadList = (bookID) => {
  const idTarget = findBookID(bookID)

  if (idTarget == null) return

  idTarget.isComplete = false
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveToStorage()
}

const addToHistory = (bookID) => {
  const idTarget = findBookID(bookID)

  if (idTarget == null) return

  idTarget.isComplete = true
  document.dispatchEvent(new Event(RENDER_EVENT))
  saveToStorage()
}

function findBookID(bookID) {
  for (const bookItem of books) {
    if (bookItem.id === bookID) {
      return bookItem
    }
  }
  return null
}

function findBookIndex(bookID) {
  for (const index in books) {
    if (books[index].id === bookID) {
      return index
    }
  }

  return -1
}

const makeBook = (booksObject) => {
  const htmTitle = document.createElement("h2")
  htmTitle.innerText = booksObject.title

  const htmAuthor = document.createElement("p")
  htmAuthor.innerText = "Penulis : " + booksObject.author

  const htmYear = document.createElement("p")
  htmYear.innerText = "Tahun : " + booksObject.year

  const htmBtnRead = document.createElement("button")
  htmBtnRead.classList.add("green")
  if (booksObject.isComplete) {
    htmBtnRead.innerText = "Baca Ulang"
    htmBtnRead.addEventListener("click", function () {
      addToReadList(booksObject.id)
    })
  } else {
    htmBtnRead.innerText = "Selesai Baca"
    htmBtnRead.addEventListener("click", function () {
      addToHistory(booksObject.id)
    })
  }

  const htmBtnDel = document.createElement("button")
  htmBtnDel.classList.add("red")
  htmBtnDel.innerText = "Hapus Buku"

  htmBtnDel.addEventListener("click", function () {
    removeBook(booksObject.id)
  })

  const htmContainer = document.createElement("div")
  htmContainer.classList.add("action")
  htmContainer.append(htmBtnRead, htmBtnDel)

  const htmArticle = document.createElement("article")
  htmArticle.classList.add("book-item")
  htmArticle.append(htmTitle, htmAuthor, htmYear, htmContainer)

  return htmArticle
}

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("inputBook")

  form.addEventListener("submit", function (event) {
    event.preventDefault()
    addBook()
    clearForm()
  })

  if (isStorageExist()) {
    loadFromStorage()
  }
})

document.addEventListener(RENDER_EVENT, function () {
  const htmIncomplete = document.getElementById("readList")
  htmIncomplete.innerHTML = ""

  const htmComplete = document.getElementById("history")
  htmComplete.innerHTML = ""

  for (const bookItem of books) {
    const htmBook = makeBook(bookItem)
    if (bookItem.isComplete) {
      htmComplete.append(htmBook)
    } else {
      htmIncomplete.append(htmBook)
    }
  }
})

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY))
})
