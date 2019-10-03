const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'wolverine',
    database : 'flipkart',
  });

  function dbconnect(){
    connection.connect(function(err){
        if(!err) {
            console.log("Database is connected ... \n\n");
        }
        else{
            console.log(err);
        }
  });
}

module.exports=dbconnect;