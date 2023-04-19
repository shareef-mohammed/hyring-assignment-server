const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema ({
    clientId: mongoose.Schema.Types.ObjectId,
    projects: [{
        title: String,
        description: String,
        applicants: [{
            name: String,
            email: String
        }]
    }]
}, {timestamps: true})

module.exports = mongoose.model('Project', projectSchema);