const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);

  if (username && password) {
    const isUserExists = isValid(username);

    if (isUserExists) {
      return res.status(409).json({message: "User already exists!"});
    }

    users.push({username, password});
    return res.status(201).json({ message: "Use successfully registered!" });
  }

  return res.status(300).json({message: `${username} ${password}`});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn || !books.hasOwnProperty(isbn)) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found`});
  }

  return res.status(200).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let result;

  for (const key in books) {
    if (books[key].author === author) {
      result = books[key];
      break;
    }
  }

  if (!result) {
    return res.status(404).json({ message: `Book with author ${author} not found`});
  }

  return res.status(200).json(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result;

  for (const key in books) {
    if (books[key].title === title) {
      result = books[key];
      break;
    }
  }

  if (!result) {
    return res.status(404).json({ message: `Book with title ${title} not found`});
  }

  return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  if (!isbn || !books.hasOwnProperty(isbn)) {
    return res.status(404).json({ message: `Book with ISBN ${isbn} not found`});
  }

  return res.status(200).json(books[isbn].reviews);
});

module.exports.general = public_users;
