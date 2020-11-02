//This is dev branch
//init
require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const methodOverride = require('method-override')
const app = express();
const port = process.env.PORT || 80;
const host = process.env.HOST || "localhost";
require("./database");
const routes = require('./routes/routes');

//EJS stuff
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//Middleware
app.use("/public", express.static("public"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'));

//Routes
app.use('/', routes);

//Server Listen
app.listen(port, host, () => {
    console.log(`Server is running at http://${host}:${port}`);
});