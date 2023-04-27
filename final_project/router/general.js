const express = require('express');
let books = require("./booksdb.js");
const jwt = require('jsonwebtoken');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password){
    if(!isValid(username)){
      
      users.push({'username':username,'password':password});
      console.log(users)
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = {
        accessToken,username
      }
      return res.status(200).json({message: "User successfully registred"});

    } else {
      return res.status(404).json({message: "User already exists"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.status(200).json({"bookList":books})
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  res.status(200).json({"bookbyisbn":books[isbn]})
});


// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let targetauthor = req.params.author;
  const authorExists = (targetauthor)=>{for (let book in books){
    if(books[book].author === targetauthor){
      return books[book];
    }
  }return false;
  }
  if(targetauthor && authorExists(targetauthor)){}
  res.status(200).json({"booksbyauthor":authorExists(targetauthor)})
});

//Get book details based on Title
public_users.get('/title/:title',function (req, res) {
  let targettitle = req.params.title;
  const titleExists = (targettitle)=>{for (let book in books){
    if(books[book].title === targettitle){
      return books[book];
    }
  }return false;
  }
  if(targettitle && titleExists(targettitle)){}
  res.status(200).json({"booksbytitle":titleExists(targettitle)})
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  return res.status(200).json({"bookreviewbyisbn":books[isbn].reviews})
});


//Async function
async function getbookList() {
  try {
    const response = await axios.get('/');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

async function getbookListbyISBN() {
  try {
    const response = await axios.get('/isbn',{params:{isbn:1}});
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

async function getbookListbyAuthor() {
  try {
    const response = await axios.get('/author',{params:{author:"Chinua Achebe"}});
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

async function getbookListbyTitle() {
  try {
    const response = await axios.get('/title',{params:{title:"Things Fall Apart"}});
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}  

async function getbookreview() {
  try {
    const response = await axios.get('/review',{params:{isbn:1}});
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

module.exports.general = public_users;
