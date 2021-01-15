const { layout } = require("../layout");
const { User, Comment, Post } = require("../models");
const UPLOAD_URL = "/uploads/media/";

const chatHome = async (req, res) => {
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
    for (let p of posts) {
      p.User = await User.findByPk(p.userid);
    }  
    res.render("chat", {
      locals: {
        title: "ANGO Chat",
        username,
        posts,
        id
      },
      ...layout,
    });
  };

const createPost = (req, res) => {
    res.render("createPost", {
        locals: {
        title: "Make a Post"
        },
        ...layout,
    });
    };

const postPost = async (req, res) => {
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
    console.log(content)
    res.redirect("/private/chat");
}

const profilePage = async (req, res) => {
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
};

const createComment = async (req, res) => {
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
};

const postComment = async (req, res) => {
    const post = req.params.id;
    const { content } = req.body;
    const { id } = req.session.user;

    const comment = await Comment.create({
        content,
        userid: id,
        postid: post,
    });
    res.redirect("/private/chat");
};

const editPost = async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByPk(id);
    res.render("editPost", {
        locals: {
        title: "Edit Post",
        post,
        },
        ...layout,
    });
};

const postEditPost = async (req, res) => {
    const { id } = req.params;
    const { file } = req;
    const { title, content } = req.body;

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

    res.redirect("/private/chat");
};

const deletePost = async (req, res) => {
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
};

const postDeletePost = async (req, res) => {
    const { id } = req.params;
    const deletedPost = await Post.destroy({
        where: {
        id,
        userid: req.session.user.id,
        },
    });
    res.redirect("/private/chat");
};

const editComment = async (req, res) => {
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
};

const postEditComment = async (req, res) => {
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

    res.redirect("/private/chat");
};

const deleteComment = async (req, res) => {
    const { id } = req.params;
    const comment = await Comment.findByPk(id);
    res.render("deleteComment", {
        locals: {
        title: "Delete Comment",
        comment,
        },
        ...layout,
    });
};

const postDeleteComment = async (req, res) => {
    const { id } = req.params;
    const deletedComment = await Comment.destroy({
        where: {
        id,
        userid: req.session.user.id,
        },
    });
    res.redirect("/private/chat");
};

module.exports = {
  chatHome,
  createPost,
  postPost,
  profilePage,
  createComment,
  postComment,
  editPost,
  postEditPost,
  deletePost,
  postDeletePost,
  editComment,
  postEditComment,
  deleteComment,
  postDeleteComment,
};





