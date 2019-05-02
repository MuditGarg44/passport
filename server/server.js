const express = require("express");
const port = 9000;
const app = express();
const mongoose = require("mongoose");
const router = require("./routes/index");

mongoose.connect('mongodb://localhost:27017/AuthUsers', {useNewUrlParser  : true}).then(()=>{
    console.log("Database connected");
})

router(app);

app.listen(port, ()=>{
    console.log(`Server running @ http://localhost:${port}/`);
})
