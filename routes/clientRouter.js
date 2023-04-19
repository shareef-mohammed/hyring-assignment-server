const express = require('express');
const { clientSignup, clientLogin, clientProjects, clientPostProjects, authenticate } = require('../controllers/clientController');
const { validateClientToken } = require('../middleware/auth');
const router = express();

router.post('/signup',  clientSignup);
router.post('/login', clientLogin);
router.post('/project', validateClientToken, clientPostProjects);
router.get('/projects',validateClientToken, clientProjects);
router.get('/authenticate',validateClientToken, authenticate);

module.exports = router;