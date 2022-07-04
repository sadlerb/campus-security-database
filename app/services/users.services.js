const pool = require('../services/db')
exports.getAllUsers = (req,res,next) =>{
    const query = "SELECT * from users"
    pool.query(query,(err,results)=>{
        if (err) res.json(err)
        res.json(results)
    })
}