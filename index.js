require('dotenv').config();

const http = require('http');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const es6Renderer = require('express-es6-template-engine');

const session = require('express-session');
const FileStore = require('session-file-store')(session);

const app = express();
const server = http.createServer(app);

// const bcrypt = require("bcryptjs");

const logger = morgan('tiny');
const PORT = 5555
const HOST = '127.0.0.1';

const routes = require("./routers")
// const { layout } = require("./layout");

app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(logger);
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.engine('html', es6Renderer);
app.set('views', 'templates');
app.set('view engine', 'html');

app.use(routes)

// app.get("/", (req, res) => {
//     res.render("home", {
//       locals: {},
//       ...layout,
//     });
//   });

//   app.get("/signup", (req, res) => {
//     res.render("signup", {
//       locals: {},
//       ...layout,
//     });
//   });

//   app.post("/signup", async (req, res) => {
//     const { username, password, country, email } = req.body;
//     const hash = bcrypt.hashSync(password, 10);
//     try {
//       const newUser = await User.create({
//         username,
//         hash,
//         country,
//         email,
//       });
//       console.log(newUser);
  
//       res.redirect("/login");
//     } catch (e) {
//       res.send("username is taken");
//     }
//   });

  // app.get("/login", (req, res) => {
  //   res.render("login", {
  //     locals: {},
  //     ...layout,
  //   });
  // });
  
  // app.post("/login", async (req, res) => {
  //   const { username, password } = req.body;
  
  //   const user = await User.findOne({
  //     where: {
  //       username,
  //     },
  //   });
  //   if (user) {
  //     const isValid = bcrypt.compareSync(password, user.hash);
  //     if (isValid) {
  //       req.session.user = {
  //         username: user.username,
  //         id: user.id,
  //       };
  //       req.session.save(() => {
  //         res.redirect("/private");
  //       });
  //     } else {
  //       res.send("Wrong password. Try again.");
  //     }
  //   } else {
  //     res.send("Username not found");
  //   }
  // });

server.listen(PORT, HOST, () => {
    console.log('Server running at localhost, port 5555');
})