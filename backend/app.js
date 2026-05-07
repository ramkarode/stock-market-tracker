const express = require("express");
const cookieParser = require("cookie-parser")
const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser())
// app.use(cors({
//     origin:"",
//     Credential:true
// }))  // setup this later 

// Routes
app.get("/", (req, res) => {
  res.send("server is live");
});

module.exports = app;
