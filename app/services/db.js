const mysql = require('mysql');
const dbConfig = require('../config/db.config');

module.exports = pool = mysql.createPool({
    host:dbConfig.HOST,
    user:dbConfig.USER,
    password:dbConfig.PASSWORD,
    database:dbConfig.DB,
    connectionLimit:10
})

