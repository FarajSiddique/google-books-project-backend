const express = require("express");
const router = express.Router();
const User = require("./user");

router.post("/signup", async (req, res) => {
	try {
		const { username, email } = req.body;

		if (!username || !email) {
			return res
				.status(400)
				.json({ message: "Username and email are required" });
		}

		const newUser = new User({ username, email });
		await newUser.save();
		res.status(201).json({ message: "User created successfully" });
	} catch (err) {
		console.error(err); // Log the error for debugging

		if (err.code === 11000) {
			// This is the error code for a duplicate key error
			return res
				.status(400)
				.json({ message: "Username or email already exists" });
		}

		res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
