const User = require("../models/User");
const Tweet = require("../models/Tweet");
const formidable = require("formidable");
const seederNewUser = require("../seeders/seederNewUser");
const jwt = require("jsonwebtoken");

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
		const newUser = await User.findById(user.id);

		const token = jwt.sign(
			{ sub: newUser._id, username: newUser.username },
			process.env.TOKEN_KEY
		);
		newUser.token = token;
		res.status(200).json(newUser);
	} catch {
		res.status(400);
	}
}

async function destroy(req, res) {
	await User.findByIdAndRemove(req.params.id);
	res.status(200).json("User deleted");
}

async function update(req, res) {
	try {
		/* const form = formidable({
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
      } */
		await User.findByIdAndUpdate(req.user.sub, {
			/*  photo: "/assets/images/" + photoName,
        backgroundPhoto: "/assets/images/" + backgroundPhotoName, */
			firstname: req.body.firstname,
			lastname: req.body.lastname,
			description: req.body.description,
		});
		/* }); */
		const user = await User.findById(req.user.sub); // Con findByIdAndUpdate retorna el user antes del cambio.
		res.status(200).json(user);
	} catch {
		res.status(400);
	}
}

async function follow(req, res) {
	if (!req.body.following.some((following) => req.params.id === following.toString())) {
		await User.findByIdAndUpdate(req.params.id, {
			$push: { followers: req.body.id },
			$inc: { followersCount: 1 },
		});
		const user = await User.findByIdAndUpdate(req.body.id, {
			$push: { following: req.params.id },
			$inc: { followingCount: 1 },
		});
		res.status(200).json(user.following);
		// res.redirect(req.get("referer"));
	} else {
		res.status(400);
	}
	// res.redirect("/");
}
// }

async function unfollow(req, res) {
	if (req.body.following.some((following) => req.params.id === following.toString())) {
		await User.findByIdAndUpdate(req.params.id, {
			$pull: { followers: req.body.id },
			$inc: { followersCount: -1 },
		});
		const user = await User.findByIdAndUpdate(req.body.id, {
			$pull: { following: req.params.id },
			$inc: { followingCount: -1 },
		});
		res.status(200).json(user.following);
		// res.redirect(req.get("referer"));
	} else {
		res.status(400);
	}
}

async function profile(req, res) {
	if (req.path !== "/favicon.ico") {
		const user = await User.findOne({ username: req.params.username });
		const tweets = await Tweet.find({ author: user._id })
			.populate("author")
			.limit(20)
			.sort({ date: -1 });
		// res.render("profile", { user, tweets, moment });
		res.json({ user, tweets });
	}
}

module.exports = {
	create,
	destroy,
	update,
	follow,
	unfollow,
	profile,
};
