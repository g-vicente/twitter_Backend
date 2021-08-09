const Tweet = require("../models/Tweet");
const User = require("../models/User");

async function create(req, res) {
	const tweet = new Tweet({
		content: req.body.content,
		date: Date.now(),
		author: req.user,
		likes: 0,
	});
	const newTweet = await tweet.save();

	await User.findByIdAndUpdate(newTweet.author._id, {
		$push: { tweets: newTweet },
		$inc: { tweetCount: 1 },
	});
	res.redirect("/");
}

async function destroy(req, res) {
	await Tweet.findByIdAndRemove(req.params.id);
	res.redirect(req.get("referer"));
}

async function like(req, res) {
	await Tweet.findByIdAndUpdate(req.params.id, {
		$inc: { likes: 1 },
	});

	await User.findByIdAndUpdate(req.user.id, {
		$push: { tweetsLiked: req.params.id },
	});
	res.redirect(req.get("referer"));
}

async function unlike(req, res) {
	await Tweet.findByIdAndUpdate(req.params.id, {
		$inc: { likes: -1 },
	});
	await User.findByIdAndUpdate(req.user.id, {
		$pull: { tweetsLiked: req.params.id },
	});
	res.redirect(req.get("referer"));
}

// Otros handlers...
// ...

module.exports = {
	create,
	destroy,
	like,
	unlike,
};
