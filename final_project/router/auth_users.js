const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  return !users.some(user => user.username === username)
}

const authenticatedUser = (username,password)=>{ 
  return users.some(user => user.username === username && user.password === password)
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body
  if (!username || !password) {
    return res.status(400).json({ message: "Missing username or password" })
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" })
  }
  const accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60*60 })
  req.session.authorization = {
    accessToken,
    username
  }
  res.status(200).send(`User ${username} successfully logged in`)
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbnParam = req.params.isbn.trim()
  const review = decodeURIComponent(req.query.review.trim())
  const user = req.session.authorization.username
  const book = books[isbnParam]
  if (!book) {
    return res.status(404).json({ message: "Book not found" })
  }
  if (review === "") {
    return res.status(400).json({ message: "Missing review" })
  }
  book.reviews[user] = review
  res.send(`Review from user ${user} successfully added`)
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbnParam = req.params.isbn
  const user = req.session.authorization.username
  const book = books[isbnParam]
  if (!book) {
    return res.status(404).json({ message: "Book not found" })
  }
  const review = book.reviews[user]
  if (!review) {
    return res.status(404).json({ message: `No reviews from user ${user} for this book` })
  }
  delete books[isbnParam].reviews[user]
  res.send(`Review from user ${user} successfully deleted`)
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
