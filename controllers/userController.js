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
  await User.findByIdAndRemove(req.user.sub);
  res.status(200).json("User deleted");
}

async function update(req, res) {
  console.log(req.data);
  try {
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
      await User.findByIdAndUpdate(req.user.sub, {
        photo: "/assets/images/" + photoName,
        backgroundPhoto: "/assets/images/" + backgroundPhotoName,
        firstname: fields.firstname,
        lastname: fields.lastname,
        description: fields.description,
      });
      /* }); */
      const user = await User.findById(req.user.sub); // Con findByIdAndUpdate retorna el user antes del cambio.
      res.status(200).json(user);
      res.status(400);
    });
  } catch {
    ("Err");
  }
}

async function follow(req, res) {
  const user = await User.findById(req.user.sub);
  if (!user.following.some((following) => req.params.id === following.toString())) {
    await User.findByIdAndUpdate(req.params.id, {
      $push: { followers: req.user.sub },
      $inc: { followersCount: 1 },
    });
    await User.findByIdAndUpdate(req.user.sub, {
      $push: { following: req.params.id },
      $inc: { followingCount: 1 },
    });
    const userEdited = await User.findById(req.user.sub);
    res.status(200).json(userEdited.following);
  } else {
    await User.findByIdAndUpdate(req.params.id, {
      $pull: { followers: req.user.sub },
      $inc: { followersCount: -1 },
    });
    await User.findByIdAndUpdate(req.user.sub, {
      $pull: { following: req.params.id },
      $inc: { followingCount: -1 },
    });
    const userEdited = await User.findById(req.user.sub);
    res.status(200).json(userEdited.following);
  }
}

async function profile(req, res) {
  const user = await User.findOne({ username: req.params.username });
  const tweets = await Tweet.find({ author: user._id })
    .populate("author")
    .limit(20)
    .sort({ date: -1 });
  res.json({ user, tweets });
}

module.exports = {
  create,
  destroy,
  update,
  follow,
  profile,
};
