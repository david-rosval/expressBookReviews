const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" })
  }
  if (!isValid(username)) {
    return res.status(409).json({ message: "User already exists" })
  }
  users.push({ username, password })
  res.send(`User ${username} successfully registered`)
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  const gettingAllBooksPromise = new Promise((resolve, reject) => {
    try {
      resolve(books)
    } catch (error) {
      reject(error)
    }
  })
  gettingAllBooksPromise.then(
    booksObtained => res.send(JSON.stringify(booksObtained, null, 4)),
    error => res.status(500).json({ message: "Unable to retrieve data from the database" })
  )
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnParam = req.params.isbn
  const getBookByIsbnPromise = new Promise((resolve, reject) => {
    try {
      if (!books[isbnParam]) throw new Error("Book not found")
      resolve(books[isbnParam])
    } catch (error) {
      reject(error.message)
    }
  })
  getBookByIsbnPromise.then(
    bookObtained => res.send(JSON.stringify(bookObtained, null, 4)),
    error => res.status(404).json({ message: error })
  )
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const authorParam = req.params.author
  const authorDecoded = decodeURIComponent(authorParam).trim()
  const getBooksByAuthorPromise = new Promise((resolve, reject) => {
    try {
      const filteredBooks = Object.entries(books)
        .filter(([key, value]) => value.author === authorDecoded)
      if (filteredBooks.length === 0) {
        throw new Error(`No books with author ${authorDecoded}`)
      }
      resolve(Object.fromEntries(filteredBooks))
    } catch (error) {
      reject(error.message)
    }
  })
  getBooksByAuthorPromise.then(
    booksObtained => res.send(JSON.stringify(booksObtained, null, 4)),
    error => res.status(404).json({ message: error })
  )
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleParam = req.params.title
  const titleDecoded = decodeURIComponent(titleParam).trim()
  const getBooksByTitlePromise = new Promise((resolve, reject) => {
    try {
      const filteredBooks = Object.entries(books)
        .filter(([key, value]) => value.title === titleDecoded)
      if (filteredBooks.length === 0) {
        throw new Error(`No books with title ${titleDecoded}`)
      }
      resolve(Object.fromEntries(filteredBooks))
    } catch (error) {
      reject(error.message)
    }
  })
  getBooksByTitlePromise.then(
    booksObtained => res.send(JSON.stringify(booksObtained, null, 4)),
    error => res.status(404).json({ message: error })
  )
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbnParam = req.params.isbn.trim()
  const reviews = books[isbnParam].reviews
  res.send(JSON.stringify(reviews, null, 4))
});

module.exports.general = public_users;
