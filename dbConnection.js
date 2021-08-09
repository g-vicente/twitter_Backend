const mongoose = require("mongoose");

module.exports = async () => {
	//Conecto MongoDB
	mongoose.set("useFindAndModify", false);
	mongoose.connect(process.env.DB_DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	mongoose.connection
		.once("open", () => console.log("¡Conexión con la base de datos establecida!"))
		.on("error", (error) => console.log(error));
};
