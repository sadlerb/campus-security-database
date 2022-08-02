
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
        if (node in graph) {
            console.log('here')
            children = Object.entries(graph[node].children)
            console.log(children)
        }
        return children
    }

    path(start, current) {
        let path = []
        while (current.label != start.label) {
            path.splice(0, 0, current.label)
            current = current.parent
        }
        path.splice(0, 0, start.label)
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

    constructor(label, parent) {
        this.label = label
        this.parent = parent
        this.g = 0 
        this.f = 0 
        this.h = 0 
    }
    
    lt(other) {
        return this.f < other.f
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

exports.generateRoute = (req,res) => {
    const query = "CALL getAllDestinationDetails()"

    const pathGraph = new Object()
    pool.query(query,(err,results)=>{
        if (err){
            res.json(err)
            return
        }
        results = results[0]
        console.log(results)
        let count = 0
        results.forEach(function(val){
            const query = `CALL getDestinationChildren(${val['destination_id']})`
            pool.query(query,(err,row) =>{
                if (err) {
                    throw err
                }else{
                    pathGraph[val["name"]] = {"latitude": val.latitude, "longitude": val.longitude, "children": row[0]}
                }
                count+=1
                if (count == results.length) {
                    //console.log(pathGraph)
                    res.status(200)
                    res.json(results)
                }
            });
        });           
    });
    /* query = ""//want to call the heuristics part here set them all to zero in the db initially
    pool.query(query, (err, results)=>{
        here just add the heurist key to the pathgrapgh variable. The value for that key would be in the form of an object.
        {
            name: val 
        }
    })
    const locations = req.body
    let fringe = new PriorityQueue()
    let startNode = new Node(locations.start.name, null)
    let goalNode = new Node(locations.goal.name, null)
    let visited = []

    fringe.enqueue(startNode)
    visited.push(startNode.label)

    while (fringe.queue.length != 0) {
        let current = fringe.dequeue()
        if (current.label == goalNode.label){
            res.json(fringe.path(startNode, current))
            res.status(200)
            return
        } else {
            fringe.getChildren(pathGraph, current.label).forEach((i)=>{
                let temp = new Node(i[0], current)
                temp.g = i[1]
                if (!(temp.label in visited)){
                    visited.push(temp.label)
                }
                cost = temp.g
                temp.g = current.g + temp.g
                temp.f = pathGraph.heurist[temp.label] + current.g + cost
                fringe.enqueue(temp)
                current.g += pathGraph.heurist[temp.label]
            })
        }
    } */

};