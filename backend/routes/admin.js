const express = require("express");
const dbHndler = require("../database/dbHandler");
const { body, validationResult } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/getUsers", authMiddleware, async(req, res)=>{
    try{
        const users = await dbHndler.getUsers();
        console.log(users);
        res.json(users);
    }catch(err){
        console.log("Error fetching users", err);
        res.status(500).send("DB error");
    }
});

module.exports = router;