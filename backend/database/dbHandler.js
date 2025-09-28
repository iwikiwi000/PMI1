const db = require("./db");

const getUser = async(name) => {
    try{
       const [user] = await db.promise().query(
        'SELECT * FROM user WHERE name = ?', [name]
        ); 
        return user[0];
    }catch(err){
        console.log("DB Error:", err);
        throw err;
    }
}

module.exports = {
    getUser,
}