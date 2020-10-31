//init
const mongoose = require('mongoose');
const db_url = process.env.DB_URL;


//Connection
mongoose.connect(db_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    //if connection successful
    console.log('We are connected with Database')
})