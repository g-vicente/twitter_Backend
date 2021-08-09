const Tweet = require("../models/Tweet");
const User = require("../models/User");
const config = require("./config");

module.exports = async function seederNewUser(user) {
	const _ = require("lodash");
	const users = await User.find({}, "_id");

	for (let i = 0; i < config.SEEDER_NEW_USER; i++) {
		let user1 = user;
		let user2 = _.sample(users);
		const users1 = await User.findById(user1);
		if (users1.following.some((item) => item.toString() === user2._id.toString())) {
			continue;
		} else {
			await User.findByIdAndUpdate(user1, {
				$push: { following: user2 },
				$inc: { followingCount: 1 },
			});

			await User.findByIdAndUpdate(user2, {
				$push: { followers: user1 },
				$inc: { followersCount: 1 },
			});
		}
	}
	console.log("[Database] Se corrió el seeder de New User.");
};
