const fs = require('fs');
const multer = require('multer');
const express = require('express');

let MongoClient = require('mongodb').MongoClient;
let url = "mongodb+srv://Alexa:Alexa@cluster0.0dldg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const csv=require('csvtojson')
 
const app = express();
 
global.__basedir = __dirname;

const storage = multer.diskStorage({
 destination: (req, file, cb) => {
    cb(null, __basedir + '/uploads/')
 },
 filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
 }
});
const upload = multer({storage: storage});


app.post('/api/uploadfile', upload.single("uploadfile"), (req, res) =>{
    importCsvData2MongoDB(__basedir + '/uploads/' + req.file.filename);
    res.json({
        'msg': 'File uploaded!', 'file': req.file
    });
});
function importCsvData2MongoDB(filePath){
    csv()
        .fromFile(filePath)
        .then((jsonObj)=>{
            console.log(jsonObj);
            MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
                if (err) throw err;
                let dbo = db.db("intern");
                dbo.collection("products").insertMany(jsonObj, (err, res) => {
                   if (err) throw err;
                });
            });
			
            fs.unlinkSync(filePath);
        })
}
 
 
let server = app.listen(3000, function () {
 
    let host = server.address().address;
    let port = server.address().port;
   
    console.log("App listening at 3000", host, port);
  })



  module.exports = app;