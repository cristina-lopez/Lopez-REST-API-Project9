'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const {User} = require('./models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
   let message; //stores message to display
    // Parse the user's credentials from the Authorization header.
    //this will be set to object containing user's key and secret
    const credentials = auth(req);

  // If the user's credentials are available...
     // Attempt to retrieve the user from the data store
     // by their username (i.e. the user's "key"
     // from the Authorization header).
     if (credentials) {
        const user = await User.findOne({where: {emailAddress: credentials.name}});
        if (user) {
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            if (authenticated) { //if pswds match
                console.log(`Authentication successful for username: ${user.emailAddress}`);
            //store user on request object
                req.currentUser = user;
            } else {
                message = `Authentication failure for ${user.emailAddress}`;
            }
        } else {
            message = `User not found for username: ${credentials.name}`;
        }
     } else {
        message = "Auth header not found"
     }
     if (message) {
        console.warn(message);
        res.status(401).json({message: 'Access Denied'});
     } else {
        next();
     }

  // If a user was successfully retrieved from the data store...
     // Use the bcrypt npm package to compare the user's password
     // (from the Authorization header) to the user's password
     // that was retrieved from the data store.

  // If the passwords match...
     // Store the retrieved user object on the request object
     // so any middleware functions that follow this middleware function
     // will have access to the user's information.

  // If user authentication failed...
     // Return a response with a 401 Unauthorized HTTP status code.

  // Or if user authentication succeeded...
     // Call the next() method.
    next();
}