const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

  if(!username || !password)
{
    return res.status(400).json({message: "Username and password are required."});
}  
if(isValid(username)){
    return res.status(409).json({ message: "Username already exists. Please choose another." });
}
// Register the new user
users.push({ username, password });

return res.status(201).json({ message: "User registered successfully." })
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json(JSON.stringify({ books: Object.values(books) }));
});

public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "Book not found with the given ISBN" });
    }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author.toLowerCase();
  const matchingBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
  if(matchingBooks.length>0){
    res.status(200).json({booksByAuther: matchingBooks});
  }else{
    res.status(404).json({message:"No books found by the given author"});
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();

    const matchingBooks = Object.values(books).filter(book => 
        book.title.toLowerCase() === title
    );

    if (matchingBooks.length > 0) {
        res.status(200).json({ booksByTitle: matchingBooks });
    } else {
        res.status(404).json({ message: "No books found with the given title" });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
    const book = books[isbn];

    if (book) {
        res.status(200).json({ reviews: book.reviews || {} });
    } else {
        res.status(404).json({ message: "Book not found with the given ISBN" });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
