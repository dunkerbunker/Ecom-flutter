// importing express
const express = require('express');

const User = require("../models/user");

const bcryptjs = require("bcryptjs");

const authRouter = express.Router();

// signup
authRouter.post('/api/signup', async (req, res) => {
    // get the data from client
    // post the data into db and return to user

    // gettung data from body of request
    try {
        const {name, email, password} = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({msg: 'User with same email already exists!'});
        }

        const hashedPassword = await bcryptjs.hash(password, 8);

        // let is basically var
        let user = new User ({
            email,
            password: hashedPassword,
            name,
        })
        user = await user.save();
        res.json(user);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
})


// sign in


module.exports = authRouter;