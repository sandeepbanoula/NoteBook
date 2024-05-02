const express = require('express');
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

// add assignment route
router.get("/assignment/add", controller.addassignment);

// assignment board route
router.get('/assignment', controller.assignment);

//  board route
router.get('/assignment/:subjectid', controller.subjectassignment);

// individual assignment route
router.get("/assignment/view/:assignmentid", controller.viewassignment);

// delete assignment route
router.get("/assignment/delete/:assignmentid", controller.deleteassignment);

// view student submit assignment assignment route
router.get("/assignment/view/:assignmentid/:userid", controller.viewsubmissions);

// settings page route
router.get("/settings", controller.settings);

// about us page route
router.get("/about", controller.about);

// POST ROUTES

// create notebook route
router.post("/create/notebook", controller.createNotebook);

// join notebook route
router.post("/join/notebook", controller.joinNotebook);

// demo login for admins and teachers
router.post('/demologin', passport.authenticate('local', { failureRedirect: '/login' }),
  function (req, res) {
    // Successful authentication, redirect home.
    console.log(req);
    res.redirect('/assignment');
  });

// submit assignments solution post route
router.post("/assignment/submit", store.array('assignmentImages', 12), controller.uploads);

// route for adding assignment for teacher
router.post("/assignment/add", controller.addassignmentpost);

// submit feedback on student's assignment for admin & teachers
router.post("/assignment/feedback/:assignmentid/:userid", controller.submitfeedback);

// ---post routes for settings page---

// post route for edit profiles
router.post("/edit/profile", controller.editprofile);

// post route for edit roles
router.post("/edit/roles", controller.editroles);

//post route for edit subjects
router.post("/edit/subjects", controller.editsubjects);

module.exports = router;
