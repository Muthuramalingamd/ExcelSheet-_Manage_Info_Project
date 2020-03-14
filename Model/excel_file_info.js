var mongoose = require('mongoose');
	var excelSchema = mongoose.Schema({
        original_name: String,
        path: String,
        file_name: String,
        size: Number
	});
	
 
module.exports = mongoose.model('excelfile_info', excelSchema)
