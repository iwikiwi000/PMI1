const express = require("express");
const bcrypt = require("bcrypt");
const dbHandler = require("../database/dbHandler");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

const roleMiddleware = require("../middleware/releMiddleware");

router.get("/getUsers", authMiddleware, roleMiddleware(["admin"]), async(req, res)=>{
    try{
        const users = await dbHandler.getUsers();
        console.log(users);
        res.json(users);
    }catch(err){
        console.log("Error fetching users", err);
        res.status(500).send("DB error");
    }
});

router.post("/addUser", authMiddleware, roleMiddleware(["admin"]), async(req, res)=>{
    const {name, password, role} = req.body;
    console.log("Na backend", name, password, role);

    try{

        if (!name || !password || !role) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed = await bcrypt.hash(password, salt);

        await dbHandler.addUser(name, role, salt, hashed);
        console.log("User succesfully added");
        res.status(201).json({ message: "User added successfully" });

    }catch(err){
        console.log("Error adding new User", err);
        res.status(500).send("DB error");
    }
});

router.delete("/deleteUser/:u_id", authMiddleware, roleMiddleware(["admin"]), async(req, res)=>{
    const {u_id} = req.params;

    try{
        dbHandler.deleteUser(u_id);
        res.status(201).json({message: "User removed successfully "});
    }catch(err){
        console.log("Error deleting user ", err);
        res.status(500).send("DB error");
    }
});

module.exports = router;