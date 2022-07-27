const pool = require('../services/db')


exports.getAllDestinations=(req,res) => {
    const query = "CALL getAllDestinationDetails()"
    pool.query(query,(err,results)=>{
        if (err){
            res.json(err)
            return
        }
        res.status(200)
        res.json(results)
    })
}