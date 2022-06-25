// importing express
const express = require('express')

const authRouter = express.Router();

authRouter.post('./api/signup', (req, res) => {
    // get the data from client
    // post the data into db and return to user

    // gettung data from body of request
    const {name, email, password} = req.body;
    
})

module.exports = authRouter;