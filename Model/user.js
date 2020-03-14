var mongoose = require('mongoose');
	var userSchema = mongoose.Schema({
        name: String,
        user_name:String,
        password: String,
        phone: String,
        address: String,
        age:String
	});
	
 
module.exports = mongoose.model('user', userSchema)
