const Tweet = require("../models/Tweet");
const User = require("../models/User");

async function create(req, res) {
	try {
		const user = await User.findById(req.user.sub);
		const tweet = new Tweet({
			content: req.body.content,
			date: Date.now(),
			author: user,
			likes: 0,
		});
		const newTweet = await tweet.save();
		await User.findByIdAndUpdate(newTweet.author._id, {
			$push: { tweets: newTweet },
			$inc: { tweetCount: 1 },
		});
		res.status(200).json(newTweet);
	} catch {
		res.status(400);
	}
}

async function destroy(req, res) {
	await Tweet.findByIdAndRemove(req.body._id);
	res.status(200).json({ ok: "Ok delete" });
}

async function like(req, res) {
	const user = await User.findById(req.user.sub);
	if (!user.tweetsLiked.some((item) => item.toString() === req.params.id)) {
		await Tweet.findByIdAndUpdate(req.params.id, {
			$inc: { likes: 1 },
		});
		await User.findByIdAndUpdate(req.user.sub, {
			$push: { tweetsLiked: req.params.id },
		});
	} else {
		await Tweet.findByIdAndUpdate(req.params.id, {
			$inc: { likes: -1 },
		});
		await User.findByIdAndUpdate(req.user.sub, {
			$pull: { tweetsLiked: req.params.id },
		});
	}
	const userEdited = await User.findById(req.user.sub);
	res.status(200).json(userEdited.tweetsLiked);
}

module.exports = {
	create,
	destroy,
	like,
	// unlike,
};
