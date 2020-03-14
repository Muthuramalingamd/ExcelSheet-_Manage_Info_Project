 var express = require('express'); 
var mongoose = require('mongoose');
    var app = express(); 
    var bodyParser = require('body-parser');
    var multer = require('multer');
    var xlstojson = require("xls-to-json-lc");
    var xlsxtojson = require("xlsx-to-json-lc");

var http = require('http');
var server = http.createServer(app);

//Models 
var Customer = require('./Model/customer.js')
var Excel_File_Info = require('./Model/excel_file_info.js')
 

var multer  = require('multer');
var mkdirp = require('mkdirp');

//connect mongodb uri
mongoose.connect('mongodb://testdbuser:test()123@ds211368.mlab.com:11368/testdata');
var port = 3000;

//body parser 
  app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Multer 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    //var code = JSON.parse(req.body.model).empCode;
    var dest = 'public/document/';
    mkdirp(dest, function (err) {
        if (err) cb(err, dest);
        else cb(null, dest);
    });
  },
  filename: function (req, file, cb) {
    cb(null, Date.now()+'-'+file.originalname);
  }
});

var upload = multer({ storage: storage });

//get excel information
app.get('/getexcels', upload.any(), function(req , res){
    
    Excel_File_Info.find({},function(error, data){
        if(error){
            return res.send({status:500,Message:"Internal Error"})
        }else{
            return res.send({status:200,Data:data}).end();
        }
    })
})


//get json(customer) information which are split from excel sheet and stored database
app.get('/getcustomerinfo', upload.any(), function(req , res){
    
    Customer.find({},function(error, data){
        if(error){
            return res.send({status:500,Message:"Internal Error"})
        }else{
            return res.send({status:200,Data:data}).end();
        }
    })
})


//upload excel file
app.post('/upload', upload.any(), function(req , res){
    var exceltojson;
    var file_path = req.files[0].path
    var original_name = req.files[0].originalname;
    var file_name = req.files[0].filename;
    var size = req.files[0].size;
    var excelObj = {"original_name":original_name,"path":file_path,"file_name":file_name,size:size}
     if(original_name.split('.')[original_name.split('.').length-1] === 'xlsx'){
                exceltojson = xlsxtojson;
            } else {
                exceltojson = xlstojson;
            }
            
                exceltojson({
                    input: file_path, 
                    output: null, 
                    lowerCaseHeaders:true
                }, function(err,result){
                    if(err) {
                        return res.send({status:500,Message:"Data not converted"});
                    }
                    Excel_File_Info.create(excelObj);
                    Customer.create(result);
                   return res.send({status:200, xl_record: result,Message:"XL record added successfully into Database"});
                });
});

   
    server.listen(function(){
        console.log('App running Port : '+port);
    });