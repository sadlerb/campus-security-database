
const pool = require('../services/db')

class PriorityQueue {
    queue;

    constructor() {
        this.queue = []
    }
          
    dequeue(){
        return this.queue.shift()
    }

    enqueue(el){
        //console.log('enqueue has started, queue is', this.queue, el)
        if (this.queue.length > 0) {
            //console.log('queue length > 0', this.queue.length)
            for (let i in this.queue) {
                if (el.lt(i)) {
                    this.queue.splice(this.queue.indexOf(i), 0, el)
                    return
                }
                if (i == (this.queue.length-1)){
                    this.queue.push(el)
                }
            }
        } else {
            this.queue.push(el)
        }
    }

    getChildren(graph, node) {
        let children;
        if (node in graph) 
            children = Object.entries(graph[node].children)
            //console.log(children) 
            return children
    }

    path(start, current) {
        let path = []
        while (current.label != start.label) {
            path.splice(0, 0, {"name": current.label, "location": current.location})
            current = current.parent
        }
        path.splice(0, 0, {"name": start.label, "location": start.location})
        console.log(path)
        return path
    }
}

class Node {
    label;
    parent;
    g;
    f;
    h;
    location;
    constructor(label, parent, location) {
        this.label = label
        this.parent = parent
        this.g = 0 
        this.f = 0 
        this.h = 0 
        this.location = location
    }
    
    lt(other) {
        return this.f < other.f
    }
}

getRoute =(pathGraph, req)=> {
    const locations = req.body
    let fringe = new PriorityQueue()
    let startNode = new Node(locations.start.name, null, {"latitude":locations.start.latitude, "longitude":locations.start.longitude})
    let goalNode = new Node(locations.goal.name, null, {"latitude":locations.goal.latitude, "longitude":locations.goal.longitude})
    let visited = []

    fringe.enqueue(startNode)
    visited.push(startNode.label)

    while (fringe.queue.length != 0) {
        let current = fringe.dequeue()
        if (current.label == goalNode.label){
            return(fringe.path(startNode, current))
        } else {
            //return fringe.getChildren(pathGraph, current.label)
            fringe.getChildren(pathGraph, current.label).forEach((i)=>{
                let temp = new Node(i[0], current)
                temp.g = i[1]
                temp.location = current.location
                if (!(temp.label in visited)){
                    visited.push(temp.label)
                }
                cost = temp.g
                temp.g = current.g + temp.g
                temp.f = /* pathGraph.heurist[temp.label] */ +  current.g + cost
                fringe.enqueue(temp)
                //current.g += pathGraph.heurist[temp.label]
            })
            
        }
    }
}

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

exports.getAllDestinationsWithChildren = (req,res) => {
    const query = "CALL getAllDestinationDetails()"

    const pathGraph = new Object()
    pool.query(query,(err,results)=>{
        if (err){
            res.json(err)
            return
        }
        results = results[0]
        let count = 0
        results.forEach(function(val){
            const query = `CALL getDestinationChildren(${val['destination_id']})`
            pool.query(query,(err,row) =>{
                if (err) {
                    throw err
                }else{
                    let children = new Object()
                    row[0].forEach((item)=>{
                        children[item.name] = {"latitude":item.latitude, "longitude": item.longitude, "distance": item.distance}
                    })
                    pathGraph[val["name"]] = {"latitude": val.latitude, "longitude": val.longitude, "children": children}
                }
                count+=1
                if (count == results.length) {
                    //console.log(pathGraph)
                    /* query = ""//want to call the heuristics part here set them all to zero in the db initially

                    here just add the heurist key to the pathgrapgh variable. The value for that key would be in the form of an object.
                    {
                        name: val 
                    }*/
                    res.status(200)
                    res.json(getRoute(pathGraph, req))
                }
            });
        });          
    })
    
};