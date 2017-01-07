var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: [1, 'You must include an email address'],
        trim: true
    }
});

module.exports = {User};
