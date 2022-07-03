const express = require('express')
const mysql = require('mysql')
const config = require('./app/config/db.config')


// Create connection 
const db = mysql.createConnection(config.databaseOptions);

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

app.listen(config.port.PORT,() =>{
    console.log("Server started on port 3000")
})