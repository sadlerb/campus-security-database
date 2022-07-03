const express = require('express')
const mysql = require('mysql')
const config = require('./app/config/db.config')


// Create connection 
var db = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB
  });


//Connect to MySql 
db.connect(err => {
    if (err){
        throw err
    }
    console.log("MySQL Connected")
})

const app = express()

// Create Database 
app.get('/createdb',(req,res) =>{
   const sql = "CREATE DATABASE campus_security_database"
   db.query(sql,err =>{
    if (err){
        throw err
    }
    res.send('Database Created')
   })
})

app.get('/createTable',(req,res)=>{
    const sql = "CREATE TABLE users (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), address VARCHAR(255))";
    db.query(sql,err =>{
        if (err){
            throw err
        }
        res.send("User table created")
    })
})

app.get('/insert',(req,res)=>{
    const sql = "INSERT INTO users (name, address) VALUES ('B', 'A')";
    db.query(sql,err =>{
        if (err){
            throw err
        }
        res.send("User Inserted")
    })
})

app.get('/users',(req,res)=>{
    const sql = "SELECT * from users"
    db.query(sql,err =>{
        if (err){
            throw err
        }
    })
    console.log(res)
})

app.listen(config.PORT,() =>{
    console.log("Server started on port " + config.PORT)
})