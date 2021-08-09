const mongoose = require("mongoose");
const userSeeder = require("./userSeeder");
const tweetSeeder = require("./tweetSeeder");
const followSeeder = require("./followSeeder");
const connection = require("../dbConnection");

module.exports = async function dbCreate() {
	// await mongoose.connection.dropDatabase();
	// await userSeeder();
	// await tweetSeeder();
	// await followSeeder();
};
