// Dependencies
const express = require('express');
const bcrypt = require('bcrypt');
const sessionsRouter = express.Router();
const User = require('../models/user.js');

// New (login page)
sessionsRouter.get('/new', (req, res) => {
    res.render('sessions/new.ejs', {
        currentUser: req.session.currentUser
    })
})

// Delete (logout route)
sessionsRouter.delete('/', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/')
    })
})

// Create (login route)
sessionsRouter.post('/', (req, res) => {
    //Check for an existing user
    User.findOne({
        email: req.body.email
    }, (error, foundUser) => {
        // send error message if no user is found 
        if(!foundUser) {
            res.send('Oops! No user with that email address has been registered')
        } else {
            //if a uiser has been found
            //compare the given password with the hashed password we have 
            const passwordMatches = bcrypt.compareSync(req.body.password, foundUser.password)

            //if passwords match
            if (passwordMatches) {
                //add to session
                req.session.currentUser = foundUser
                //redirect 
                res.redirect('/')
            } else {
                //if password doesnt match
                res.send('Access Denied')
            }
        }
    })
})

// Export Sessions Router
module.exports = sessionsRouter;