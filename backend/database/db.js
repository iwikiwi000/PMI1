const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "Zemjegulata123!",
    database: "FEITsecurity"
});

db.connect(err => {
    if(err){
        console.log("Connection to database has failed: ", err.message)
    }else{
        console.log("Connection to database successful")
    }
});

module.exports = db;