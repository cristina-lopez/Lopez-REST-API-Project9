'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcrypt');
const {User} = require('./models');

// Middleware to authenticate the request using Basic Authentication.
exports.authenticateUser = async (req, res, next) => {
   let message; //stores message to display
    // Parse the user's credentials from the Authorization header.
    // this will be set to object containing user's key and secret
    const credentials = auth(req);

  // If the user's credentials are available...
   if (credentials) {
      const user = await User.findOne({where: {emailAddress: credentials.name}});
      // If a user was successfully retrieved from the data store...
      if (user) {
         const authenticated = bcrypt
            .compareSync(credentials.pass, user.password);
         // If the passwords match...
         if (authenticated) { 
            console.log(`Authentication successful for username: ${user.emailAddress}`);
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
   // If user authentication failed...
   if (message) {
      console.warn(message);
      res.status(401).json({message: 'Access Denied'});
   // Or if user authentication succeeded...
   } else {
      next();
   }
   //next();
}