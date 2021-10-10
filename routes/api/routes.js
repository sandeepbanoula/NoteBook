const express = require('express');
const db = require('../../database/db');
const passport = require('passport');
const controller = require('../../server/controller/controller');
const store = require('../../server/middleware/upload');

const router = express.Router();

// authentication Routes
router.get('/auth/google', passport.authenticate('google', { scope: ["profile", "email"] }));

router.get('/auth/google/notebook', passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/assignment');
  });

// home page Route
router.get("/", controller.home);

// signup page route
router.get('/signup', controller.signup);

// login page route
router.get('/login', controller.login);

// signout route
router.get('/signout', controller.signout);

// dashboard page route
router.get('/dashboard', controller.dashboard);

// assignment board route
router.get('/assignment', controller.assignment);

// individual assignment route
router.get("/assignment/view/:assignmentid", controller.viewassignment);

// add assignment route
router.get("/assignment/add", controller.addassignment);

// view student submit assignment assignment route
router.get("/assignment/view/:assignmentid/:userid", controller.viewsubmissions);

// settings page route
router.get("/settings", controller.settings);

// about us page route
router.get("/about", controller.about);

// POST ROUTES

// submit assignments solution post route
router.post("/assignment/submit", store.array('assignmentImages', 12),controller.uploads);

//route for adding assignment for teacher
router.post("/assignment/add", controller.addassignmentpost);

// post routes for settings page

// post route for edit profiles
router.post("/edit/profile", controller.editprofile);

// post route for edit roles
router.post("/edit/roles", controller.editroles);

//post route for edit subjects
router.post("/edit/subjects", controller.editsubjects);

module.exports = router;
