//init
require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const methodOverride = require('method-override')
const app = express();
const port = process.env.PORT;
const host = process.env.HOST;
require("./database");
const users = require('./Controllers/users');

//EJS stuff
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));

//Middleware
app.use("/public", express.static("public"));
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(methodOverride('_method'));



//Routes
app.get('/', users);
app.post('/', users);
app.get('/register', users);
app.post('/register', users);
app.get('/logout', users);
app.get("/notes", users);
app.post("/notes", users);
app.put("/mark/:id", users);
app.delete("/delete/:id", users);
app.get("/update/:id", users);
app.put("/update/:id", users);
app.all('*', users);

//Server Listen
app.listen(port, host, () => {
    console.log(`Server is running at host ${host} and on port ${port}`);
});