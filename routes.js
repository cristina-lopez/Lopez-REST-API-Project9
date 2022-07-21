'use strict';

const express = require('express');
const { asyncHandler } = require('./async-handler');
const { authenticateUser } = require('./auth-user');
const router = express.Router();
const { User } = require('./models');
const Course  = require('./models').Course;
//const bcrypt = require('bcrypt');

// Route returns all props and values for currently authenticated user.
router.get('/users', authenticateUser, asyncHandler(async(req, res) => {
  const user = req.currentUser;
  res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
    password: user.password,
  });
}));

// Route creates a new user.
router.post('/users', asyncHandler(async(req, res) => {
  try {
    await User.create(req.body);
    res.location('/');
    //res.json({user});
    res.status(201).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }

  //const errors = [];
  //validate we have a name value
  /* if (!user.name) {
    errors.push("Please provide a value for 'name'");
  }
  //validate we have an email value
  if (!user.email) {
    errors.push("Please provide a value for 'email'");
  } */
  //validate we have a password value that is betwee 8 and 10
/*   let password = user.password;
  if (!password) {
    errors.push('Please provide a value for "password"');
  } else if (password.length < 8 || password.length > 20) {
    errors.push('Your password should be between 8 and 20 characters');
  } else {
    user.password = bcrypt.hashSync(password, 10);
  } */

  // if there are any errors...
  /* if (errors.length > 0) {
    res.status(400).json({errors: errors});
  } else {
    // Add the user to the `users` array.
    users.push(user);

    // Set the status to 201 Created and end the response.
    res.status(201).end();
  } */

}));

// Route returns all courses including user associated with course
router.get('/courses', asyncHandler(async(req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'user',
      }
    ]
  });
  res.status(200).json({
    courses
  });
}));

// Route  returns corresponding course including user associated with the course
router.get('/courses/:id', asyncHandler(async(req, res) => {
  const courses = await Course.findByPk(req.params.id, {
    include: [
      {
        model: User,
        as: 'user',
      }
    ]
  });
  res.status(200).json({
    courses
  });
}));


module.exports = router;