const Tweet = require("../models/Tweet");

module.exports = {
	isAuthor: async (req, res, next) => {
		const tweet = await Tweet.findById(req.params.id);
		if (req.user.id === tweet.author._id.toString()) {
			next();
		} else {
			res.send("You don't have the necessary credentials.");
		}
	},
};
