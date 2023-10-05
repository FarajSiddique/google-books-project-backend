require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const googleBooksRoutes = require("./GoogleBooks");
const NYTBooksRoute = require("./NYTBooks");
const userRoutes = require("./userRoutes");
const bookshelfRoutes = require("./bookshelfRoutes");
const app = express();
const PORT = 5000;
const mongoDBPassword = process.env.MONGO_DB_PASSWORD;
const uri = `mongodb+srv://BookBuddyDB:${mongoDBPassword}@bookbuddy.8quxc4g.mongodb.net/?retryWrites=true&w=majority`;

app.use(cors());
app.use(express.json());
app.use("/api/book", googleBooksRoutes);
app.use("/dashboard", NYTBooksRoute);
app.use("/api/users", userRoutes);
app.use("/api/bookshelf", bookshelfRoutes);

mongoose
	.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		console.log("MongoDB Connected…");
	})
	.catch((err) => console.log(err));

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
