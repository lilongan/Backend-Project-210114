const bcrypt = require("bcryptjs");
const { layout } = require("../layout");
const { User } = require("../models");

const signUp = (req, res) => {
	res.render("signup", {
		locals: {
			title: "Sign Up",
			errormsg: "",
		},
		...layout,
	});
};

const processSignUp = async (req, res) => {
	const { username, password, country, email } = req.body;

	const hash = bcrypt.hashSync(password, 10);

	try {
		const newUser = await User.create({
			username,
			hash,
			country,
			email,
		});
		res.redirect(`/login`);
	} catch (e) {
		if (e.name === "SequelizeUniqueConstraintError") {
			res.render("signup", {
				locals: {
					title: "Sign Up",
					errormsg: "This username is already taken.",
				},
				...layout,
			});
		}
	}
};

const login = (req, res) => {
	res.render("login", {
		locals: {
			title: "Login",
			errormsg: "",
		},
		...layout,
	});
};

const processLogin = async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({
		where: {
			username,
		},
	});
	if (user && bcrypt.compareSync(password, user.hash)) {
		console.log("=====LOGIN SUCCESS=====");
		req.session.user = {
			username: user.username,
			id: user.id,
		};
		req.session.save(() => {
			res.redirect("/private");
		});
	} else {
		res.render("login", {
			...layout,
			locals: {
				title: "Log In",
				errormsg: "The username or password is incorrect.",
			},
		});
	}
};

const requireLogin = (req, res, next) => {
	if (req.session.user) {
		next();
	} else {
		res.redirect("/login");
	}
};

const logout = (req, res) => {
	req.session.destroy(() => {
		res.redirect("/login");
	});
};

module.exports = {
	signUp,
	processSignUp,
	login,
	processLogin,
	logout,
	requireLogin,
};