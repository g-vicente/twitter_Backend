const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");
const passport = require("passport");

module.exports = (app) => {
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(
		new LocalStrategy(
			// { usernameField: "email", passwordField: "password" },
			async function (username, password, done) {
				const user = await User.findOne({
					$or: [{ email: username }, { username: username }],
				});
				if (!user) {
					return done(null, false, { message: "Incorrect credentials." });
				}
				if (!(await user.validPassword(password))) {
					// if (!(await validPassword(password))) {
					return done(null, false, { message: "Incorrect credentials." });
				}
				return done(null, user);
			}
		)
	);

	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id)
			.then((user) => {
				done(null, user);
			})
			.catch((error) => {
				done(error, user);
			});
	});
};
