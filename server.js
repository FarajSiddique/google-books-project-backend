require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const googleBooksRoutes = require("./GoogleBooks");
const NYTBooksRoute = require("./NYTBooks");
const userRoutes = require("./userRoutes");
const bookshelfRoutes = require("./bookshelfRoutes");
const deleteAccount = require("./deleteAccount");
const app = express();
const PORT = 5000;
const mongoDBPassword = process.env.MONGO_DB_PASSWORD;
const uri = `mongodb://BookBuddyDB:${mongoDBPassword}@ac-rcndxgn-shard-00-00.8quxc4g.mongodb.net:27017,ac-rcndxgn-shard-00-01.8quxc4g.mongodb.net:27017,ac-rcndxgn-shard-00-02.8quxc4g.mongodb.net:27017/?ssl=true&replicaSet=atlas-zzu1en-shard-0&authSource=admin&retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());
app.use("/api/book", googleBooksRoutes);
app.use("/dashboard", NYTBooksRoute);
app.use("/api/users", userRoutes);
app.use("/api/bookshelf", bookshelfRoutes);
app.use(deleteAccount);

mongoose
	.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("MongoDB Connected…");
	})
	.catch((err) => console.log(err));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
