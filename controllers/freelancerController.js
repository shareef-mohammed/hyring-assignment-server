const freelancerData = require('../models/freelancerModel');
const projectData = require('../models/projectModel');
const { hashPassword, comparePassword } = require('../utils/helpers');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose')

module.exports.freelancerSignup = async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const exist = await freelancerData.findOne({email});
        if(exist) {
            return res.status(409).send('Email already exist');
        }
        const hashedPassword = hashPassword(password);
        const freelancer = new freelancerData({
            name,
            email,
            password: hashedPassword
        });
        await freelancer.save();
        const accessToken = jwt.sign({
            id: freelancer._id,
            email: freelancer.email,
            type: 'freelancerToken'
        },process.env.JWT_SECRET_KEY,
        { expiresIn: "2d" })
        console.log(accessToken)
        res.status(200).json(accessToken);
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}

module.exports.freelancerLogin = async(req, res) => {
    try {
        const { email, password } = req.body;
        const freelancer = await freelancerData.findOne({email});
        if(freelancer) {
            const valid = comparePassword(password, freelancer.password);
            if(valid) {
                const accessToken = jwt.sign({
                    id: freelancer._id,
                    email: freelancer.email,
                    type: 'freelancerToken'
                },process.env.JWT_SECRET_KEY,
                { expiresIn: "2d" })
                res.status(200).json(accessToken);
            } else {
                res.status(400).send('Invalid Password');
            }
        } else {
            res.status(400).send('Invalid Email');
        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error.');
    }
}

module.exports.freelancerApply = async(req, res) => {
    try {
        const { id } = req.body;
        const project = await projectData.findOne({'projects._id':id});
        
        const projectIndex = project.projects.findIndex(
            (project) => project._id == id
        );

        const freeId = new mongoose.Types.ObjectId(req.freelancerId)
        const freelancer = await freelancerData.findById({_id: freeId})
        
        if(project.projects[projectIndex].applicants.some((a) => a.email === freelancer.email)) {
            return res.status(409).send('Already applied.')
        }else {

            project.projects[projectIndex].applicants.push({ 
                name: freelancer.name,
                email: freelancer.email
            }); 
            await project.save();
            res.status(200).json(project);

        }
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error.');
    }
}

module.exports.projects = async(req, res) => {
    try {
        const projects = await projectData.find({});
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).send('Internal Server Error.');
    }
}

module.exports.authenticate = async(req, res) => {
    try {
        const id = req.clientId;
        const client = await freelancerData.findById({id})
        if(!client) {
            return res.status(404).send('authentication failed')
        }
        res.status(200)
    }catch(err) {
        res.status(500).send('Internal Server Error');
    }
}