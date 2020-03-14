var mongoose = require('mongoose');
	var customerSchema = mongoose.Schema({
        emailid: String,
        name: String,
        phoneno: Number,
        address: String
	});
	
 
module.exports = mongoose.model('customer', customerSchema)
