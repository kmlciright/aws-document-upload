var mysql      = require('mysql');
const fs = require('fs');
const AWS = require('aws-sdk');


var connection = mysql.createConnection({
  host     : '10.10.10.230',
  port     :  '3306',
  user     : 'cirightdev',
  password : 'DA!tABa20M!YCIri',
  database : 'ciright'
});

const s3 = new AWS.S3({
    accessKeyId: "AKIAUDQ26SNOKZ3WWX64",
    secretAccessKey: "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"
});


connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
   
    console.log('connected as id ' + connection.threadId);
  });
 
connection.query('select t.digital_document_id ,td.file_extention,t.document from tbl_digital_documents t LEFt JOIN tbl_digital_document_details td on td.digital_doc_detail_id= t.digital_doc_detail_id where td.file_extention IS NOT NULL and td.file_extention!=""  and t.document is not null and t.document!="" ', function (error, results, fields) {
  
if (error) throw error;

 
  results.forEach(function(value){
  
    const fileName = value.digital_document_id+"."+value.file_extention;

    const params = {
        Bucket: 'ciright-documents',
        Key: fileName, 
        Body: value.document
    };
    s3.upload(params, function(s3Err, data) {
        if (s3Err) throw s3Err
        console.log(`File uploaded successfully at ${data.Location}`)
    });
  });
});






