const express = require("express")
const dbHndler = require("../database/dbHandler")
const router = express.Router();
const bcrypt = require("bcrypt");

const hashPassword = async (password)=>{
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashed = await bcrypt.hash(password, salt);
    return { hashed, salt };
}

(async () => {
    const { hashed, salt } = await hashPassword("FEITsecurity123*");
    console.log("Hashed password:", hashed, salt);
})();


router.post("/login", async(req, res)=>{

    const {name, password} = req.body;

    try {
        const user = await dbHndler.getUser(name);

        console.log(user);
        console.log(name, password);
        const isValid = await bcrypt.compare(password, user.hashed);
        
        if (!isValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        req.session.user = { id: user.id, name: user.name };
        res.json({ message: "Login successful", user: req.session.user });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }

})

router.post("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: "Logout failed" });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out successfully" });
    });
});

module.exports = router;