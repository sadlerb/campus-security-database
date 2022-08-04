const pool = require('../services/db')
const geolib = require ('geolib')
const kmeans = require('dimas-kmeans')


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

exports.update = (req,res) => {

    updateHotzones()
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
        updateHotzones()
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

function updateHotzones() {


    const query = "CALL getAllIncidentDetails()"
    let points = []
    pool.query(query,(err,data)=>{
        data = data[0]
        if (err) throw err;
        data.forEach((row)=>{
            let temp = []
            let merged = [].concat.apply([], points);
            let filtered_results = data.filter((i => i['incident_id'] != row['incident_id'] && helper(i,merged) ))
 
            filtered_results.forEach((result) =>{
                const dist = geolib.getDistance([row['latitude'],row['longitude']],[result['latitude'],result['longitude']])
                if (dist < 170){
                    temp.push(result)
                }
            })
            
            if (temp.length >= 1){
                temp.push(row)
                points.push(temp)
            }
        });

        points.forEach((coordinates)=>{
            var locations = []
            var severity_list =  []
            
            coordinates.forEach((coord)=>{
                locations.push({'latitude':coord['latitude'],'longitude':coord['longitude']})
                severity_list.push(coord['severity'])

            })
            const center = geolib.getCenter(locations)
            const avg = severity_list.reduce((partialSum, a) => partialSum + a, 0)/severity_list.length;
            const weight = (((avg - 0) / (100 - 0)) * (10 - 0) + 0) * 10

            const query = `CALL addHotzone (${center.latitude}.${center.longitude},${weight})`
            pool.query(query,(err)=>{
                if (err) throw err;
            })
            
            
        })
    }) 
}

function helper(i,array) {
    var ids = []
    for (var x = 0; x < array.length;x++){
       
       ids.push(array[x]['incident_id'])
    }
    return !(ids.includes(i.incident_id))
}

