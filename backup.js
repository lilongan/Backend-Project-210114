// app.get("/", (req, res) => {
//     res.render("home", {
//       locals: {
//         title: "home",
//       },
//       ...layout,
//     });
//   });

//   app.get("/signup", (req, res) => {
//     res.render("signup", {
//       locals: {
//         title: "sign up",
//         errormsg: ""
//       },
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

  app.get("/private", requireLogin, async (req, res) => {
    const { username, id } = req.session.user;
  
    console.log(req.session.user);
  
    const posts = await Post.findAll({
      order: [["createdAt", "desc"]],
      include: [
        {
          model: Comment,
          attributes: ["content", "createdAt", "id"],
          include: User,
        }]
      });
    console.log(posts[3].Comments)
    for (let p of posts) {
      p.User = await User.findByPk(p.userid);
    }  
    res.render("private", {
      locals: {
        title: "ANGO",
        username,
        posts,
        id
      },
      ...layout,
    });
  });
  
  app.get("/private/create", requireLogin, (req, res) => {
    res.render("createPost", {
      locals: {
        title: "Make a Post"
      },
      ...layout,
    });
  });
  app.post(
    "/private/create",
    requireLogin,
    upload.single("media"),
    async (req, res) => {
      const { id, username } = req.session.user;
      const { file } = req;
      const { title, content } = req.body;
      let mediaPic = file ? UPLOAD_URL + file.filename : "";
      const post = await Post.create({
        userid: id,
        username,
        title,
        media: mediaPic,
        content,
      });
      res.redirect("/private");
    }
  );
  
  app.get("/private/profile/:id", requireLogin, async (req, res) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
  
    console.log("Error Before FindAll");
    const member = await Post.findAll({
      where: {
        userid: id,
      },
      order: [["createdAt", "desc"]],
      include: [
        {
          model: Comment,
          attributes: ["content", "createdAt"],
          include: User,
        },
        // {
        //   model: User,
        // },
      ],
    });
    console.log(JSON.stringify(member, null, 4));
    res.render("profile", {
      locals: {
        title: "Profile Page",
        member,
        user,
      },
      ...layout,
    });
  });
  
  app.get("/post/:id/comment", requireLogin, async (req, res) => {
    const { id } = req.params;
  
    const post = await Post.findByPk(id);
    const users = await User.findAll({
      order: [["username", "asc"]],
    });
  
    res.render("createComment", {
      locals: {
        title: "Add Comment",
        post,
        users,
      },
      ...layout,
    });
  });
  
  app.post("/post/:id/comment", requireLogin, async (req, res) => {
    const post = req.params.id;
    const { content } = req.body;
    const { id } = req.session.user;
  
    const comment = await Comment.create({
      content,
      userid: id,
      postid: post,
    });
    res.redirect("/private");
  });
  
  app.get("/post/:id/edit", requireLogin, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    res.render("editPost", {
      locals: {
        title: "Edit Post",
        post,
      },
      ...layout,
    });
  });
  
  app.post(
    "/post/:id/edit",
    requireLogin,
    upload.single("media"),
    async (req, res) => {
      const { id } = req.params;
      const { file } = req;
      console.log(id);
      const { title, content } = req.body;
      console.log(title);
      console.log(content);
  
      let data = {
        title,
        content,
      };
  
      if (file) {
        data["media"] = UPLOAD_URL + file.filename;
      }
      const updatedPost = await Post.update(data, {
        where: {
          id,
          userid: req.session.user.id,
        },
      });
  
      res.redirect("/private");
    }
  );
  
  app.get("/post/:id/delete", requireLogin, async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    res.render("deletePost", {
      locals: {
        title: "Delete Post",
        name: "Delete Post",
        post,
      },
      ...layout,
    });
  });
  
  app.post("/post/:id/delete", requireLogin, async (req, res) => {
    const { id } = req.params;
    const deletedPost = await Post.destroy({
      where: {
        id,
        userid: req.session.user.id,
      },
    });
    res.redirect("/private");
  });
  
  app.get("/comment/:id/edit", requireLogin, async (req, res) => {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    const post = await Post.findByPk(comment.postid);
    const user = await User.findByPk(comment.userid);
    res.render("editComment", {
      locals: {
        title: "Edit Comment",
        comment,
        post,
        user,
      },
      ...layout,
    });
  });
  
  app.post("/comment/:id/edit", requireLogin, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const updatedComment = await Comment.update(
      {
        content,
      },
      {
        where: {
          id,
          userid: req.session.user.id,
        },
      }
    );
  
    res.redirect("/private");
  });
  
  app.get("/comment/:id/delete", requireLogin, async (req, res) => {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    res.render("deleteComment", {
      locals: {
        title: "Delete Comment",
        comment,
      },
      ...layout,
    });
  });
  
  app.post("/comment/:id/delete", requireLogin, async (req, res) => {
    const { id } = req.params;
    const deletedComment = await Comment.destroy({
      where: {
        id,
        userid: req.session.user.id,
      },
    });
    res.redirect("/private");
  });

  // stuff we'll probably move with routers/controllers
// const bcrypt = require("bcryptjs");
const { User, Comment, Post } = require("./models");
const UPLOAD_URL = "/uploads/media/";
const multer = require("multer");
const upload = multer({ dest: "public" + UPLOAD_URL });
const { layout } = require("./layout");