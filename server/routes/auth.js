// importing express
const express = require('express');

const User = require("../models/user");

const bcryptjs = require("bcryptjs");

const authRouter = express.Router();

const jwt = require("jsonwebtoken");
const auth = require('../middlewares/auth');

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


// sign in route
authRouter.post('/api/signin', async (req, res) => {
    try {
        const {email, password} = req.body;

        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({msg: 'Incorrect email or password!'});
        }
        // decode password
        const isMatch = await bcryptjs.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({msg: 'Incorrect email or password!'});
        }

        const token = jwt.sign({id: user._id}, "passwordKey");
        // ... deconstructs user object. will give specific properties of user
        res.json({token, ...user._doc});

    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

authRouter.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.json(false);
        }
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) {
            return res.json(false);
        }
        const user = await User.findById(verified.id);
        if (!user) {
            return res.json(false);
        }
        return res.json(true);
    } catch (e) {
        res.status(500).json({error: e.message});
    }
});

// get user daa 
authRouter.get('/', auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json(...user._doc, {token: req.token});
});

module.exports = authRouter;