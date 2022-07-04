module.exports = function(app){
    const users = require('../services/users.services')


    

    app.get("/", (req, res) => {
    res.json({ message: "Connected to campus security database" });
  });
  
    app.get('/users',users.getAllUsers)

   
}