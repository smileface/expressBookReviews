const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

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
public_users.get('/', async function (req, res) {
  try {
    let result = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 3000);
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error: fetching failed' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    const isbn = req.params.isbn;

    if (!isbn || !books.hasOwnProperty(isbn)) {
      return res.status(404).json({ message: `Book with ISBN ${isbn} not found`});
    }

  try {
    let result = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books[isbn]);
      }, 3000);
    });

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error: fetching failed' });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  let result;

  try {
    result = await new Promise((resolve) => {
      setTimeout(() => {
          for (const key in books) {
            if (books[key].author === author) {
              resolve(books[key]);
            }
          }
      }, 3000);
    });

    if (!result) {
      return res.status(404).json({ message: `Book with author ${author} not found`});
    }

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error: fetching failed' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  let result;

  try {
    result = await new Promise((resolve) => {
      setTimeout(() => {
          for (const key in books) {
            if (books[key].title === title) {
              resolve(books[key]);
            }
          }
      }, 3000);
    });

    if (!result) {
      return res.status(404).json({ message: `Book with title ${title} not found`});
    }

    return res.status(200).json(result);

  } catch (error) {
    return res.status(500).json({ message: 'Error: fetching failed' });
  }
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
