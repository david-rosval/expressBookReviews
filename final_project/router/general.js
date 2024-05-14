const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbnParam = req.params.isbn
  const book = books[isbnParam]
  if (!book) return res.status(404).json({ message: "Book not found" })
  res.send(JSON.stringify(book, null, 4))
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // validate the author param (spaces with %20)
  const authorParam = req.params.author
  const authorDecoded = decodeURIComponent(authorParam).trim()
  // find the books with the author
  const booksArray = Object.entries(books)
  const filteredBooks = booksArray.filter(([key, value]) => value.author === authorDecoded)
  // send the book
  if (filteredBooks.length === 0) return res.status(404).json({ message: "Books not found" })
  const filteredBooksObject = Object.fromEntries(filteredBooks)
  res.send(JSON.stringify(filteredBooksObject, null, 4))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titleParam = req.params.title
  const titleDecoded = decodeURIComponent(titleParam).trim()
  const booksArray = Object.entries(books)
  const filteredBooks = booksArray.filter(([key, value]) => value.title === titleDecoded)
  if (filteredBooks.length === 0) return res.status(404).json({ message: "Books not found" })
  const filteredBooksObject = Object.fromEntries(filteredBooks)
  res.send(JSON.stringify(filteredBooksObject, null, 4))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
