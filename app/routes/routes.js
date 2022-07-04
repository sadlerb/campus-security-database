module.exports = function(app){
    const users = require('../services/users.services')

    app.get("/", (req, res) => {
    res.json({ message: "Connected to campus security database" });
  });


    // get all users
    app.get('/users',users.getAllUsers)
    // get a single user
    app.get('/users/:id',users.getOneUser)
    // add a new user
    app.post('/users',users.create)
    //delete user
    app.delete("/users/:id",users.delete)
}   