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