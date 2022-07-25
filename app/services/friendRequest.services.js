const pool = require('../services/db')


exports.sendRequest = (req,res) =>{
    const {fromUserID,toUserID} = req.body
    const query = `INSERT INTO requests(fromUserID,toUserID,status) VALUES (${fromUserID},${toUserID},"P")`
    pool.query(query,(err)=>{
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json({"message":"request added"})
    })
}

exports.getAllRequests = (req,res) => {
    const userID = req.params.id
    const query = `SELECT * from requests WHERE requests.toUserID = ${userID}`
    pool.query(query,(err,results)=>{
        if (err){
            res.json(err)
            return
        }
        if (!results.length){
            res.status(404)
            res.json({"message":"user has no friend requests"})
            return
        }

        res.status(200)
        res.json(results)
    })
}

exports.acceptRequest = (req,res) => {
    const {requestID} = req.body
    const query = `UPDATE requests SET status = "A" WHERE request_id = ${requestID}`
    pool.query(query,(err) =>{
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json({"message":"request accepted"})
    })
    
}

exports.rejectRequest = (req,res) => {
    const {requestID} = req.body
    const query = `UPDATE requests SET status = "R" WHERE request_id = ${requestID}`
    pool.query(query,(err) =>{
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json({"message":"request rejected"})
    })
    
}