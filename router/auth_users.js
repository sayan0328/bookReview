const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{"Username": "sayanbasak", "password": "sayan@42"}];

const isValid = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.query['username']
  let password = req.query['password']
  if(!username || !password){
      return res.status(400).json("Username or Password not detected")
  } else if(!authenticatedUser(username, password)){
    return res.status(400).json("Username or Password is not valid")
  } else{
    user = {username, password}
    let accessToken = jwt.sign({
        data: user
      }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = {
        accessToken,user
    }

    return res.status(300).json("You have logged in successfully");

  }
  
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params['isbn']
    if(!books[isbn]){
        return res.status(400).json("You have entered an invalid ISBN");
    } else{
        let curUser = req.session.authorization.user.username
        books[isbn].reviews[curUser] = req.query['review']
        return res.status(300).json("Your review for the book with ISBN " + isbn + " has been added/updated");
    }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let isbn = req.params['isbn']
    if(!books[isbn]){
        return res.status(400).json("You have entered an invalid ISBN");
    } else{
        let curUser = req.session.authorization.user.username
        delete books[isbn].reviews[curUser]
        return res.status(300).json("Reviews for the ISBN " + isbn + " posted by the user " + curUser + " was deleted");
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
