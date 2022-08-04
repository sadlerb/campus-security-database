module.exports = function(app){
    const usersService = require('../services/users.services')
    const hotzonesService = require ('../services/hotzones.services')
    const incidentService = require ('../services/incident.services')
    const friendReqestService = require('../services/friendRequest.services')
    const authServices = require('../services/auth/user.auth')
    const destinationServices = require("../services/destinationServices")
    app.get("/", (req, res) => {
    res.json({ message: "Connected to campus security database" });
  });

// USER Routes
    // get all users
  app.get('/api/users',usersService.getAllUsers)
  // get a single user
  app.get('/api/users/:id',usersService.getOneUser)
    // get user location
  app.get('/api/users/:id/location',usersService.getUserLocation)
  // add a new user

  app.post('/api/users',usersService.create)
  // add location to user
  app.post('/api/users/:id/location',usersService.addLocationToUser)

  //delete user
  app.delete("/api/users/:id",usersService.delete)
  

// Hotzone Routes
  app.get('/api/hotzones',hotzonesService.getAllHotzones)
  app.get('/api/hotzones/:id',hotzonesService.getHotzone)
  app.post('/api/hotzones',hotzonesService.createHotzone)
  app.post('/api/hotzones/:id/location',hotzonesService.setHotzoneLocation)
  app.delete('/api/hotzones/:id',hotzonesService.deleteHotzone)

// Incident Routes

  app.get('/api/incidents',incidentService.getIncidents)
  app.get('/api/incidents/:id',incidentService.getOneIncident)
  app.post('/api/incidents',incidentService.createIncident)


// Friend Requests
app.post('/api/request',friendReqestService.sendRequest)
app.get('/api/request/:id',friendReqestService.getAllRequests)
app.get('/api/request/:id/friends',friendReqestService.getAllFriends)
app.put('/api/request/accept',friendReqestService.acceptRequest)
app.put('/api/request/reject',friendReqestService.rejectRequest)

//Auth Routes
app.get('/api/auth/validate',authServices.validateUser)


//Destination Routes
app.get('/api/destinations',destinationServices.getAllDestinations)
app.post('/api/destinations/children',destinationServices.getAllDestinationsWithChildren)


//TEST ROUTES. REMOVE WHEN DONE
app.get('/api/des/test',incidentService.update)
}  
