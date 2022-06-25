// importing express
const express = require('express')

const User = require("../models/user")

const authRouter = express.Router();

authRouter.post('./api/signup', async (req, res) => {
    // get the data from client
    // post the data into db and return to user

    // gettung data from body of request
    const {name, email, password} = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return res.status(400).json({msg: 'User with same email already exists!'});
    }

    // let is basically var
    let user = new User ({
        email,
        password,
        name,
    })
    user = await user.save();
    res.json(user);
})

module.exports = authRouter;