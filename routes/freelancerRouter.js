const express = require('express');
const { freelancerSignup, freelancerLogin, freelancerApply, projects, authenticate } = require('../controllers/freelancerController');
const { validateFreelancerToken } = require('../middleware/auth');
const router = express();

router.post('/signup', freelancerSignup);
router.post('/login', freelancerLogin);
router.post('/apply',validateFreelancerToken, freelancerApply);
router.get('/projects',validateFreelancerToken, projects);
router.get('/authenticate', validateFreelancerToken, authenticate)

module.exports = router;