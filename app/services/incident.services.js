const pool = require('../services/db')



exports.getIncidents = (req,res) =>{
    const query = "SELECT * from incidents"
    pool.query(query,(err,results)=>{
        if (err) res.json(err)
        res.status(200)
        res.json(results)
    })
}

exports.getOneIncident = (req,res) => {
    const query = `SELECT * from incidents where incident_id = ${req.params.id}`
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

exports.createIncident = (req,res) => {
    const {time,severity,report_details} = req.body
    const query = `INSERT INTO incidents (time,severity,report_details) VALUES ('${time}',${severity},'${report_details}')`
    pool.query(query,(err) => {
        if (err){
            res.json(err)
            return
        }

        res.status(200)
        res.json({"message": "incident successfuly created"})
    })
}
