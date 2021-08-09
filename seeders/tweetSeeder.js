const Tweet = require("../models/Tweet");
const faker = require("faker");
const User = require("../models/User");
const config = require("./config");
module.exports = async () => {
	const _ = require("lodash");
	const users = await User.find({}, "_id");

	for (let i = 0; i < config.SEEDER_TWEETS; i++) {
		const tweet = new Tweet({
			content: faker.lorem.sentence(),
			author: _.sample(users),
			date: faker.date.past(),
		});
		await tweet.save();

		await User.findByIdAndUpdate(tweet.author._id, {
			$push: { tweets: tweet },
			$inc: { tweetCount: 1 },
		});
	}

	console.log("[Database] Se corrió el seeder de Tweet.");
};
