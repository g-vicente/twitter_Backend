const mongoose = require("mongoose"),
	Schema = mongoose.Schema,
	bcrypt = require("bcrypt"),
	SALT_WORK_FACTOR = 10;

// const Schema = mongoose.Schema;
const schema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		createIndexes: true,
		dropDups: true,
	},
	password: { type: String, required: true },
	firstname: String,
	lastname: String,
	email: {
		type: String,
		required: true,
		createIndexes: { unique: true },
	},
	description: String,
	backgroundPhoto: String,
	photo: String,
	tweets: [
		{
			type: Schema.Types.ObjectId,
			ref: "Tweet",
		},
	],
	tweetsLiked: [
		{
			type: Schema.Types.ObjectId,
			ref: "Tweet",
		},
	],
	tweetCount: {
		type: Number,
		default: 0,
	},
	followers: [{ type: Schema.ObjectId, ref: "User" }],
	followersCount: {
		type: Number,
		default: 0,
	},
	following: [{ type: Schema.ObjectId, ref: "User" }],
	followingCount: {
		type: Number,
		default: 0,
	},
	token: { type: String },
});

schema.pre("validate", async function save(next) {
	if (!this.isModified("password")) return next();
	try {
		const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		this.password = await bcrypt.hash(this.password, salt);
		return next();
	} catch (err) {
		return next(err);
	}
});

schema.methods.validPassword = async function (candidatePassword, next) {
	return await bcrypt.compare(candidatePassword, this.password);
};

const Model = mongoose.model("User", schema);
module.exports = Model;
