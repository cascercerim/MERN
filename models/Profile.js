const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    company: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    skills: {
        // array of strings 
        type: [String],
        // required because it has to show on the profile 
        required: true
    },
    bio: {

        type: String
    },
    githubusername: {
        type: String
    },
    company: {
        type: String
    },
    // experience is an array of other fields 
    experiences: [
        {
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                // if currently work there they will have a boolean so they can check if they are still working there 
                type: Boolean,
                required: false
            },
            description: {
                type: String
            }
        }
    ],
    education: [
        {
            school: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldofstudy: {
                type: String,
                required: true
            },
            from: {
                type: Date,
                required: true
            },
            to: {
                type: Date
            },
            current: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }
    ],
    social: {
        youtube: {
            type: String
        },
        twitter: {
            type: String

        },
        facebook: {
            type: String

        },
        linkedin: {
            type: String

        },
        instagram: {
            type: String

        }
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);