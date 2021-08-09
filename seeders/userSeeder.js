const User = require("../models/User");
const faker = require("faker");
const config = require("./config");

module.exports = async () => {
	const _ = require("lodash");
	let imgPrueba = ["img_avatar.png", "img_avatar2.png"];
	let imgFondo = ["home-bg.jpg", "post-bg.jpg", "contact-bg.jpg", "about-bg.jpg"];
	const users = [];
	for (let i = 1; i < config.SEEDER_USERS; i++) {
		const user = {
			firstname: faker.name.firstName(),
			lastname: faker.name.lastName(),
			username: `user${i}`,
			email: faker.internet.email(),
			description: faker.lorem.sentence(),
			photo: `assets/images/${_.sample(imgPrueba)}`,
			backgroundPhoto: `assets/images/${_.sample(imgFondo)}`,
			password: "password",
		};
		users.push(user);
	}
	await User.insertMany(users);
	console.log("[Database] Se corrió el seeder de User.");
};
