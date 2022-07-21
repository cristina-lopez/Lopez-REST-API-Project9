'use strict';

const express = require('express');
const { asyncHandler } = require('./async-handler');
const { authenticateUser } = require('./auth-user');
const router = express.Router();
const User = require('./models').User;
//const user = require('./models/user');
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
    const user = await User.create(req.body); 
    console.log(req.body);
    res.location('/');
    res.status(201).json({user, message: "Account created successfully!"}).end();
    /* // add user validation
    const errors = [];
    if (!user.firstName) {
      errors.push("Please provide a value for first name.");
    }
    if (!user.lastName) {
      errors.push("Please provide a value for last name.");
    }
    if (!user.emailAddress) {
      errors.push("Please provide a value for email address.");
    }
    if (!user.password) {
      errors.push("Please provide a value for password.");
    }
    if (errors.length > 0) {
      res.status(400).json({errors: errors});
    } else {
      res.location('/');
      res.status(201).json({message: "Account created successfully!"}).end();
    } */
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
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

// Route returns corresponding course including user associated with the course
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

// Route creates new course
router.post('/courses', asyncHandler(async(req, res) => {
  try {
    const course = await Course.create(req.body);
    //title: req.body.title,
    //description: req.body.description,
    //estimatedTime: req.body.estimatedTime,
    //materialsNeeded: req.body.materialsNeeded,
    //userId: req.body.userId,
    res.location(`/courses/${course.id}`);
    res.status(201).json({message: "New course created!"}).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// Route updates the corresponding course
router.put('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
    if(course) {
      await course.update(req.body);
      res.status(204).json({message: "Course has been updated!"}).end(); 
    } else {
      res.status(404).json({message: "Course not found."});
    }
}));

// Route deletes the corresponding course
router.delete('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
    if(course) {
      await course.destroy();
      res.status(204).json({message: "Course has been deleted!"}).end(); 
    } else {
      res.status(404).json({message: "Course not found."});
    }
}));

module.exports = router;