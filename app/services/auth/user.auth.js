
const auth  = require("./auth")

exports.validateUser = (req,res) => {
    const {user_id,password} = req.body

    const query = `SELECT user_password FROM users WHERE user_id = ${user_id}`
    pool.query(query,(err,results) =>{
        if (err){
            res.json(err)
            return 
        }

        if (!results.length){
            res.status(404)
            res.json({"message":"User not found","validated":false})
            return
        }

        else{
            
            const temp = results[0].user_password.split("+")
            const hash = temp[0]
            const salt = temp[1]
            if (auth.verifyPassword(password,salt,hash)){
                res.status(200)
                res.json({"message":"User verified","validated":true})
                return    
            }
            res.json({"message":"Incorrect Username or Password","validated":false})
            return 
            
        }
    })
}




