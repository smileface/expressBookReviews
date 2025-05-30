const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let existingUser = users.filter((user) => user.username === username);
  return !!existingUser.length;
}

const authenticatedUser = (username, password)=>{
  let validUser = users.filter((user) => user.username === username && user.password === password);

  return !!validUser.length;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in!" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = { accessToken, username };

    return res.status(200).json({ message: "User successfully logged in" });
  }

  return res.status(401).json({ message: "Invalid username or password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username,
        isbn = req.params.isbn,
        review = req.query.review;

  if (!isbn || !books.hasOwnProperty(isbn)) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found`});
  }

  let book = books[isbn];
  book.reviews[username] = review;
  
  return res.status(201).json({message: "Review added"});
});

// Remove a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const username = req.session.username,
        isbn = req.params.isbn;

  if (!isbn || !books.hasOwnProperty(isbn)) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found`});
  }

  let book = books[isbn];
  if (!book.reviews.hasOwnProperty(username)) {
    return res.status(404).json({message: "No review to delete"});
  }

  delete book.reviews[username];
  
  return res.status(200).json({message: "Review deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
