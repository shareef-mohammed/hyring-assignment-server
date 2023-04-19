const clientData = require('../models/clientModel');
const projectData = require('../models/projectModel');
const { hashPassword, comparePassword } = require('../utils/helpers');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

module.exports.clientSignup = async(req, res) => {
    try {
        const { name, email, password } = req.body;

        const exist = await clientData.findOne({email});
        if(exist) {
            return res.status(409).send('Email already exist.')
        }
        const hashedPassword = hashPassword(password);
        const client = new clientData({
            name,
            email,
            password: hashedPassword
        });
        await client.save();
        const accessToken = jwt.sign({
            id: client._id,
            email: client.email,
            type: 'clientToken'
        },process.env.JWT_SECRET_KEY,
        { expiresIn: "2d" })
        res.status(200).json(accessToken);
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }
}

module.exports.clientLogin = async(req, res) => {
    try {
        const { email, password } = req.body;
        const client = await clientData.findOne({email});
        if(client) {
            const valid = comparePassword(password, client.password);
            if(valid) {
                const accessToken = jwt.sign({
                    id: client._id,
                    email: client.email,
                    type: 'clientToken'
                },process.env.JWT_SECRET_KEY,
                { expiresIn: "2d" })
                res.status(200).json(accessToken);
            } else {
                res.status(400).send('Invalid Password');
            }
        } else {
            res.status(400).send('Invalid Email');
        }
    } catch (err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }
}

module.exports.clientPostProjects = async (req, res) => {
    try {
        const { title, description } = req.body;
        const clientId = new mongoose.Types.ObjectId(req.clientId)
        const project = await projectData.findOne({clientId});        
        if(project) {
            project.projects.push({
                title,
                description,
                applicants: []
            });
            await project.save();
            res.status(200).json(project);
        } else {
            const project = new projectData ({
                clientId: req.clientId,
                projects:[
                    {
                        title,
                        description,
                        applicants:[]
                    }
                ]
            })
            await project.save();
            res.status(200).json(project);
        }        
        
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal Server Error');
    }
};

module.exports.clientProjects = async(req, res) => {
    try {
        const clientId = new mongoose.Types.ObjectId(req.clientId);
        const projects = await projectData.find({clientId})
        res.status(200).json(projects);
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}

module.exports.authenticate = async(req, res) => {
    try {
        const id = req.clientId;
        const client = await clientData.findById(id)
        
        if(!client) {
            return res.status(404).send('authentication failed')
        }
        res.status(200)
    }catch(err) {
        console.log(err)
        res.status(500).send('Internal Server Error');
    }
} 