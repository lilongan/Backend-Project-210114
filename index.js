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



const logger = morgan('tiny');
const PORT = 5555
const HOST = '127.0.0.1';

const homeRoutes = require("./routers/home")
const userRoutes = require("./routers/user")

// stuff we'll probably move with routers/controllers
// const bcrypt = require("bcryptjs");
const { User, Comment, Post } = require("./models");
const UPLOAD_URL = "/uploads/media/";
const multer = require("multer");
const upload = multer({ dest: "public" + UPLOAD_URL });
const { layout } = require("./layout");

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

app.use("/", homeRoutes)
app.use("/user", userRoutes )

const requireLogin = (req, res, next) => {
	if (req.session.user) {
		next();
	} else {
		res.redirect("/login");
	}
};

app.get("/private", requireLogin, async (req, res) => {
  const { username, id } = req.session.user;

  console.log(req.session.user);

  const posts = await Post.findAll({
    order: [["createdAt", "desc"]],
    include: [
      {
        model: Comment,
        attributes: ["content", "createdAt"],
        include: User,
      }]
    });
  for (let p of posts) {
    p.User = await User.findByPk(p.userid);
  }  
  res.render("private", {
    locals: {
      username,
      posts,
      id
    },
    ...layout,
  });
});
        

server.listen(PORT, HOST, () => {
    console.log('Server running at localhost, port 5555');
})