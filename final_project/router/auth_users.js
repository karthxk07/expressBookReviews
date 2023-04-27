const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
if(users.find((user)=>user.username === username))return true;
else return false;
}



const authenticatedUser = (username,password)=>{ //returns boolean
if(users.find((user)=>{user.username === username && user.password === password }))return true;
return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
}
if (!authenticatedUser(username,password)) {
  let accessToken = jwt.sign({
    data: password
  }, 'access', { expiresIn: 60 * 60 });
  req.session.authorization = {
    accessToken,username
}
return res.status(200).send("User successfully logged in");
} else {
  return res.status(208).json({message: "Invalid Login. Check username and password"});
}});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
      let book = books[req.params.isbn]
      if(book){
        let reviewToAdd = req.body.review;
        if(reviewToAdd){
          book.review = reviewToAdd;
          res.status(200).send(`Review for isbn:${req.params.isbn} added `)
        } 
      }
});
//Delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
      let book = books[req.params.isbn]
      if(book){
        let reviewToAdd = req.body.review;
        if(reviewToAdd){
          delete book.review;
          res.status(200).send(`Review for isbn:${req.params.isbn} deleted`)
        } 
      }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
