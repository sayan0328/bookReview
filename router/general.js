const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
 let username = req.query['username']
 let password = req.query['password']
    if(!username || !password){
        return res.status(400).json("Username or Password not provided")
    }
    for(const user of users){
        if(user.username == username){
            return res.status(400).json("Username already exists!");
        }
    }
    users.push({username, password })
  return res.status(300).json({"message" : "User successfully registered. Now you can login."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(300).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params['isbn']
  return res.status(300).json(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
    const author = req.params['author']
    return res.status(300).json({
        'booksbyauthor' : Object.values(books).filter((book) => book.author == author)
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params["title"]
  return res.status(300).json({
    'booksbytitle' : Object.values(books).filter((book) => book.title == title)
});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params['isbn']
  if(!books[isbn]){
    res.status(400).json("Not found")
  }
  return res.status(300).json(books[isbn].reviews);
});

module.exports.general = public_users;
