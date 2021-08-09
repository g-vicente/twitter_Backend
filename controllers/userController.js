const User = require("../models/User");
const Tweet = require("../models/Tweet");
const moment = require("moment");
const passport = require("passport");
const formidable = require("formidable");
const seederNewUser = require("../seeders/seederNewUser");

async function create(req, res) {
	try {
		const user = new User({
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			username: req.body.username,
			email: req.body.email,
			password: req.body.password,
			photo: "assets/images/img_avatar.png",
		});

		await user.save();

		if (req.body.newUserSeeder) {
			await seederNewUser(user);
		}
		req.login(user, () => res.redirect("/"));
	} catch {
		const error = "Incorrect Credentials";
		res.render("signUp", {
			registroFail: true,
			error,
		});
	}
}

async function destroy(req, res) {
	await User.findByIdAndRemove(req.params.id);
	res.redirect("/login");
}

async function updateUserView(req, res) {
	const user = await User.findById(req.params.id);
	res.render("userUpdate", { user });
}

async function update(req, res) {
	const form = formidable({
		multiples: true,
		uploadDir: __dirname + "/../public/assets/images",
		keepExtensions: true,
	});
	form.parse(req, async (err, fields, files) => {
		const path = require("path");
		const photoName = path.basename(files.photo.path);
		if (files.photo.name === "") {
			const fs = require("fs");
			fs.unlink(files.photo.path, () => {});
		}
		const backgroundPhotoName = path.basename(files.backgroundPhoto.path);
		if (files.backgroundPhoto.name === "") {
			const fs = require("fs");
			fs.unlink(files.backgroundPhoto.path, () => {});
		}
		const user = await User.findByIdAndUpdate(req.user.id, {
			photo: "/assets/images/" + photoName,
			backgroundPhoto: "/assets/images/" + backgroundPhotoName,
			firstname: fields.firstname,
			lastname: fields.lastname,
			description: fields.description,
		});
	});

	res.redirect("/");
}

async function follow(req, res) {
	if (!req.user.following.some((following) => req.params.id === following.toString())) {
		await User.findByIdAndUpdate(req.params.id, {
			$push: { followers: req.user.id },
			$inc: { followersCount: 1 },
		});
		await User.findByIdAndUpdate(req.user.id, {
			$push: { following: req.params.id },
			$inc: { followingCount: 1 },
		});
		res.redirect(req.get("referer"));
	} else {
		res.redirect("/");
	}
}

async function unfollow(req, res) {
	if (req.user.following.some((following) => req.params.id === following.toString())) {
		await User.findByIdAndUpdate(req.params.id, {
			$pull: { followers: req.user.id },
			$inc: { followersCount: -1 },
		});
		await User.findByIdAndUpdate(req.user.id, {
			$pull: { following: req.params.id },
			$inc: { followingCount: -1 },
		});
		res.redirect(req.get("referer"));
	} else {
		res.redirect("/");
	}
}

async function profile(req, res) {
	if (req.path !== "/favicon.ico") {
		const user = await User.findOne({ username: req.params.username });
		const tweets = await Tweet.find({ author: user._id })
			.populate("author")
			.limit(20)
			.sort({ date: -1 });
		res.render("profile", { user, tweets, moment });
	}
}

module.exports = {
	create,
	destroy,
	update,
	updateUserView,
	follow,
	unfollow,
	profile,
};
