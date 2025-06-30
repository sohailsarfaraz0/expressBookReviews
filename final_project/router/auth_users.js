const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();
const JWT_SECRET = 'your_secret_key_here';
let users = [{
    username:'test',password:'test'
}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.find(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    const user = authenticatedUser(username, password);

    if (!user) {
        return res.status(401).json({ message: "Invalid username or password." });
    }

    // Generate JWT
    const token = jwt.sign({ username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
        message: "Login successful",
        token: token
    });
});

function authenticateJWT(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token missing' });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // e.g., { username: "john" }
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
}

// Add a book review
regd_users.put("/auth/review/:isbn", authenticateJWT, (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.user.username;

    if (!review) {
        return res.status(400).json({ message: "Review query parameter is required." });
    }

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found with given ISBN." });
    }

    if (!book.reviews) {
        book.reviews = {};
    }

    const action = book.reviews[username] ? "updated" : "added";
    book.reviews[username] = review;

    return res.status(200).json({
        message: `Review successfully ${action}.`,
        reviews: book.reviews
    });
});
regd_users.delete("/auth/review/:isbn", authenticateJWT, (req, res) => {
    const isbn = req.params.isbn;
    const username = req.user.username;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({ message: "Book not found with the given ISBN." });
    }

    if (book.reviews && book.reviews[username]) {
        delete book.reviews[username];
        return res.status(200).json({ message: "Review deleted successfully." });
    } else {
        return res.status(404).json({ message: "No review found for this user on this book." });
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
