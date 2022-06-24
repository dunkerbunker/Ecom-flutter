// importing express
const express = require('express')

const PORT = 3000;

// init express
const app = express();

// creating api
app.listen(PORT, "0.0.0.0", ()=> {
    console.log(`connected at port ${PORT}`);
});