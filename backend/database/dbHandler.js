const db = require("./db");

const getUser = async(name) => {
    try{
       const [user] = await db.query(
        'SELECT * FROM user WHERE name = ?', [name]
        ); 
        return user.length ? user[0] : null;
    }catch(err){
        console.log("DB Error:", err);
        throw err;
    }
}

const getCameraById = async (c_id) =>{
    try{
        const [cameras] = await db.query('SELECT * FROM camera WHERE c_id = ?', [c_id]);
        return cameras.length ? cameras[0] : null;
    }catch(err){
        console.log("Error in db: ", err);
        throw err;
    } 
}

const getCameras = async () => {
    const [cameras] = await db.query('SELECT * FROM camera');
    return cameras.map(cam => ({
        ...cam,
        link: `http://localhost:5000/hls/${cam.title.toLowerCase().replace(/\s+/g, "_")}/stream.m3u8`
    }));
}

const addCamera = async (title, source, link) => {
  try {
    await db.query(
      'INSERT INTO camera(title, source, link) VALUES(?, ?, ?)',
      [title, source, link]
    );
  } catch (err) {
    console.log("DB Error: ", err);
    throw err;
  }
};


const removeCamera = async (id) =>{
    try{
        await db.query(
            'DELETE FROM camera WHERE c_id = ?', [id]
        )
    }catch(err){
        console.log("DB Error: ", err);
        throw err;
    }
}

const getUsers = async()=>{
    try{
        const [users] = await db.query('SELECT * FROM user');
        return users;
    }catch(err){
        console.log("DB Error: ", err);
        throw err;
    }
}

const addUser = async(name, role, hashed, salt)=>{
    try{
        await db.query('INSERT INTO user(name, role, hashed, salt) values(?, ?, ?, ?)', [name, role, hashed, salt]);
    }catch(err){
        console.log("Error adding new User", err);
        throw err;
    }
}

const deleteUser = async(u_id)=>{
    try{
        await db.query('DELETE FROM user WHERE u_id = ?', [u_id]);
    }catch(err){
        console.log("Error deleting User form DB ", err);
        throw err;
    }
}

module.exports = {
    getUser,
    getCameras,
    addCamera,
    removeCamera,
    getCameraById,
    getUsers,
    addUser,
    deleteUser,

}