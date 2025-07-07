const mongoose = require('mongoose');


const projectSchema = mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    description: {
        type:String
    },
    deadline : Date,
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: String,
        ref: 'User'
    }],
}, {timestamps: true});

module.exports = mongoose.model("Project", projectSchema);