require("dotenv").config();
const express = require("express")
const dbHndler = require("../database/dbHandler")
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");


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

const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50, // pre devov
    message: "Priveľa pokusov na prihlásenie. Skúste to neskôr."
});

router.post(
    "/login",
    loginLimiter,
    [
        body("name").trim().isLength({ min: 3 }),
        body("password").isLength({ min: 8 })
    ],
    async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: "Nesprávne údaje" });
        }

        const { name, password } = req.body;

        try {
            const user = await dbHndler.getUser(name);

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const isValid = await bcrypt.compare(password, user.hashed);
            if (!isValid) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            const token = jwt.sign(
                { id: user.id, name: user.name, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            );

            console.log("JWT SECRET (SIGN):", process.env.JWT_SECRET);

            res.json({ token });

        } catch (err) {
            res.status(500).json({ message: "Server error" });
        }
    }
);

router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

module.exports = router;