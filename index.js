const express = require("express");
const app = express();


app.use(express.urlencoded({ extended: true }))
app.use(express.json())


require ('./app/routes/routes.js') (app);
// Listen on port
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});