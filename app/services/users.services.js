const pool = require('../services/db')
const auth  = require("./auth/auth")


exports.addLocationToUser = (req,res) =>{
    const entity_id = req.params.id
    const {latitude,longitude} = req.body
    const query = `CALL setUserLocation(${entity_id},${latitude},${longitude})`
    pool.query(query,(err)=>{
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json({"message":"location added to user"})
        })
    }

exports.getUserLocation = (req,res) =>{
    const user_id = req.params.id
    const query = `SELECT * FROM users INNER JOIN location ON location.entity_id = users.user_id WHERE location.entity_id = ${user_id} AND location.entity_type = 'U'`
    pool.query(query,(err,results)=>{
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json(results)
    })

}
exports.getAllUsers = (req,res) =>{
    const query = "SELECT * from users"
    pool.query(query,(err,results)=>{
        if (err) res.json(err)
        res.status(200)
        res.json(results)
    })
}



exports.getOneUser = (req,res) =>{
    const query = `Select * FROM users WHERE user_id = ${req.params.id}`
    pool.query(query,(err,results)=>{
        if (err) {
            res.json(err)
            return
        }
        
        if (!results.length){
            res.status(404)
            res.json({"message":"no user found"})
            return
        }
        res.status(200)
        res.json(results)

    })
}

exports.create = (req,res) =>{
    const {user_id,fname,lname,password} = req.body
    const {hash,salt} = auth.encryptPassword(password)
    const saltedHash = hash+"+"+salt
    const query = `INSERT INTO users (user_id,user_password,user_fname,user_lname,user_status) VALUES ('${user_id}','${saltedHash}','${fname}','${lname}','S')`
    pool.query(query,(err)=>{
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json({"message":"user was successfully added"})
    })
}

exports.delete = (req,res) => {
    const query = `DELETE FROM users WHERE user_id = '${req.params.id}'`
    pool.query(query,(err) => {
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json({"message":"user sucessfully deleted"})
    })


}

