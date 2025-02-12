var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
    userid: {
        type: mongoose.Schema.Types.ObjectId, ref: 'UserModel'
    },
    tokenvalue: {
        type: String
    },
   
    status: {
        type: String,
        default: 'active' //loggedout
    },
    
}, {
    //timestamps: true
    timestamps: { createdAt: 'create_date', updatedAt: 'update_date' }
});

module.exports = mongoose.model('TokenModel', tokenSchema);