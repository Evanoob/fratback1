require("dotenv").config();
require("./config/mongo");

const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const MongoStore = require("connect-mongo")(session);
const cors = require("cors");
const morgan = require("morgan"); // morgan est un logger
const app = express();

//SOCKET.IO
// const io = require('socket.io')(server);

// io.on('connection', function(socket) {
//     console.log(socket.id)
//     socket.on('SEND_MESSAGE', function(data) {
//         io.emit('MESSAGE', data)
//     });
// }); 

// POST SETUP
app.use(express.json());

// CORS SETUP
// app.use(cors("*"));
app.use(cors(["http://localhost:3000", "http://localhost:8080"])); 
// obligatoire pour accepter les appels ajax entrant

// API CALL LOGGIN
app.use(morgan("dev"));

// SESSION SETUP
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: { maxAge: 60000 }, // in millisec
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 24 * 60 * 60, // 1 day
    }),
    saveUninitialized: true,
    resave: true,
  })
);

app.get("/", (req, res) => res.send("hello :) my api is working"));
app.use("/users", require("./routes/users"));
app.use("/signals", require("./routes/signals"));
app.use("/actus", require("./routes/actus"));
app.use("/auth", require ("./routes/auth"));
app.use("/contact", require("./routes/contact"));
// app.use("/poles", require ("./routes/api.poles"));

// app.use("/chatMsg", require("./routes/api.chatMsgs"));
// app.use("/forums", require("./routes/api.forums"));
// app.use("/subjects", require("./routes/api.subjects"));
// app.use("/posts", require("./routes/api.posts"));



module.exports = app;
