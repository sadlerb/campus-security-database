
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

exports.getAllDestinationsWithChildren= (req,res) => {
    const query = "CALL getAllDestinationDetails()"
    pool.query(query,(err,results)=>{
        if (err){
            res.json(err)
            return
        }
        results = results[0]
        let output = []

        results.forEach(function(val){
            const query = `CALL getDestinationChildren(${val['destination_id']})`
            pool.query(query,(err,row) =>{
                if (err) {
                    throw err
                }else{
                val["children"] = row[0]
                output.push(val)}
                
                
                if (output.length === results.length){
                    res.status(200)
                    res.json(output)
                }
            });
        });
                       
    });

    
};