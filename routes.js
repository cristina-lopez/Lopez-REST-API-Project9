'use strict';

const express = require('express');
const { asyncHandler } = require('./async-handler');
const { authenticateUser } = require('./auth-user');
const router = express.Router();
const User = require('./models').User;
const Course  = require('./models').Course;

// Route returns props and values for currently authenticated user. 
router.get('/users', authenticateUser, asyncHandler(async(req, res) => {
  const user = req.currentUser;
  res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    emailAddress: user.emailAddress,
  });
}));

// Route creates a new user.
router.post('/users', asyncHandler(async(req, res) => {
  try {
    await User.create(req.body); 
    res.location('/');
    res.status(201).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
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
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
      }
    ], attributes: {
      exclude: [
        'createdAt',
        'updatedAt',
      ]
    },
  });
  res.status(200).json({
    courses
  });
}));

// Route returns corresponding course including user associated with the course
router.get('/courses/:id', asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id, {
    attributes: {
      exclude: [
        'createdAt',
        'updatedAt',
      ]
    },
    include: [
      {
        model: User,
        as: 'user',
        attributes: ['id', 'firstName', 'lastName', 'emailAddress'],
      }
    ]
  });
  res.status(200).json({
    title: course.title,
    description: course.description,
    estimatedTime: course.estimatedTime,
    materialsNeeded: course.materialsNeeded,
    user: course.user,
  });
}));

// Route creates new course
router.post('/courses', authenticateUser, asyncHandler(async(req, res) => {
  try {
    const course = await Course.create(req.body);
    res.location(`/courses/${course.id}`);
    res.status(201).json({"message": "New course created!"}).end();
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// Route updates the corresponding course
router.put('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if(course) {
      if (req.currentUser.id === course.userId) {
        await course.update(req.body);
        res.status(204).json({"message": "Course has been updated!"}).end(); 
      } else {
        res.status(403).json({"message": "You are not authorized to update a course."});
      }
    } else {
      res.status(404).json({"message": "Course not found."});
    }
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const errors = error.errors.map(err => err.message);
      res.status(400).json({ errors });   
    } else {
      throw error;
    }
  }
}));

// Route deletes the corresponding course
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
  const course = await Course.findByPk(req.params.id);
    if(course) {
      if (req.currentUser.id === course.userId) {
        await course.destroy();
        res.status(204).json({"message": "Course has been deleted!"}).end(); 
      } else {
        res.status(403).json({"message": "You are not authorized to delete a course."});
      }   
    } else {
      res.status(404).json({"message": "Course not found."});
    }
}));

module.exports = router;