const express = require("express")
const router = express.Router()
const multer = require("multer");
const UPLOAD_URL = "/uploads/media/";
const upload = multer({ dest: "public" + UPLOAD_URL });


const { userController } = require("../controllers")
const { privateController } = require("../controllers")

router
    .get("/chat", userController.requireLogin, privateController.chatHome)

    .get("/chat/create", userController.requireLogin, privateController.createPost)
    .post("/chat/create",userController.requireLogin, upload.single("media"), privateController.postPost)

    .get("/chat/profile/:id", userController.requireLogin, privateController.profilePage)

    .get("/post/:id/comment", userController.requireLogin, privateController.createComment)
    .post("/post/:id/comment", userController.requireLogin, upload.single("media"), privateController.postComment)

    .get("/post/:id/edit", userController.requireLogin, privateController.editPost)
    .post("/post/:id/edit", userController.requireLogin, upload.single("media"), privateController.postEditPost)

    .get("/post/:id/delete", userController.requireLogin, privateController.deletePost)
    .post("/post/:id/delete", userController.requireLogin, privateController.postDeletePost)

    .get("/comment/:id/edit", userController.requireLogin, privateController.editComment)
    .post("/comment/:id/edit", userController.requireLogin, privateController.postEditComment)

    .get("/comment/:id/delete", userController.requireLogin, privateController.deleteComment)
    .post("/comment/:id/delete", userController.requireLogin, privateController.postDeleteComment)

module.exports = router