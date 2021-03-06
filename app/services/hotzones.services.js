const pool = require('../services/db')


// get all
exports.getAllHotzones=(req,res) => {
    const query = "SELECT * from hotzones"
    pool.query(query,(err,results)=>{
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json(results)
    })
}
// get one 
exports.getHotzone = (req,res) => {
    const query = `Select * from hotzones WHERE hotzone_id = ${req.params.id}`
    pool.query(query,(err,results) => {
        if (err) {
            res.json(err)
            return
        }
        
        if (!results.length){
            res.status(404)
            res.json({"message":"no hotzone found"})
            return
        }
        res.status(200)
        res.json(results)

    })
}
// create
exports.createHotzone = (req,res) => {
    const {severity_rating,size,location} = req.body
    const query = `INSERT INTO hotzones (severity_rating,size,location) VALUES (${severity_rating},${size},${location})`
    pool.query(query,(err) => {
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json({"message":"hotzone sucessfully added"})
    })

}

// delete 
exports.deleteHotzone = (req,res) => {
    const query = `DELETE FROM hotzones WHERE hotzone_id ${req.params.id}`
    pool.query(query,(err,results) => {
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json({"message":"hotzone sucessfully deleted"})
    })
}