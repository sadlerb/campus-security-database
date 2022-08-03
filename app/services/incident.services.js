const pool = require('../services/db')
const geolib = require ('geolib')


exports.getIncidents = (req,res) =>{
    const query = "CALL getAllIncidentDetails()"
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
    const {latitude,longitude,severity,date,report_details,heuristic} = req.body

    addIncident(latitude,longitude,severity,date,report_details,heuristic)

    //Immediately returns a message to frontend. Database updates in background
    res.json({"message":"INCIDENT ADDED. UPDATING DATABASE"})
    
}

function addIncident(latitude,longitude,severity,date,report_details,heuristic){
    const max_distance = 200 // Max distance where the incident will affect the heuristics of destination 
    const query = `CALL addIncident(${latitude},${longitude},${severity},'${date}','${report_details}')`
    pool.query(query,(err) => {
        if (err){
            res.json(err)
            return
        }
        pool.query(`CALL getAllDestinationDetails()`,(err,results)=>{
            if (err){
                throw err
            }
            // Check if destination is close to incident
            results[0].forEach((row)=>{
                const dist = geolib.getDistance(
                    {latitude:latitude,longitude:longitude},
                    {latitude:row['latitude'],longitude:row['longitude']}
                );
                    
                if (dist <=max_distance){
                    const calculated_heuristic_percentage = 1 - (dist/max_distance)
                    const heuristic_calculated = Math.floor(heuristic * calculated_heuristic_percentage)
                    console.log({"name":row['name'],'heuristic':heuristic_calculated,"distance":dist})
                    const query = `UPDATE destinations SET heuristics=${heuristic_calculated} WHERE destination_id=${row['destination_id']}`
                    pool.query(query,(err)=>{
                        if (err) throw err
                    });
                };//end if
            });// end foreach 
        });// end get destination details
    });// end add incident 
    pathGraph = new Object()
};//end function

