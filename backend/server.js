const express = require("express");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = 5000;

const publicRoutes = require("./routes/public")

app.use(express.json());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(session({
    secret: "extremnetajnykluc",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

app.use("/", publicRoutes);

app.get('/', (req, res) => {
  res.send('Backend running!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
