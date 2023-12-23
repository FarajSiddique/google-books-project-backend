const express = require("express");
const router = express.Router();
const User = require("./schemas/user");
const Bookshelf = require("./schemas/bookshelf");

router.post("/signup", async (req, res) => {
	try {
		const { username, email, firebaseUid } = req.body;

		if (!username || !email || !firebaseUid) {
			return res
				.status(400)
				.json({ message: "Username, email, and Firebase UID are required" });
		}

		// Check if a user with the provided Firebase UID already exists
		const existingUser = await User.findOne({ firebaseUid });
		if (existingUser) {
			return res.status(400).json({ message: "User already exists" });
		}

		// Create a new Bookshelf document for the user
		const newBookshelf = new Bookshelf();
		await newBookshelf.save();

		// Create and save the new User with the associated Bookshelf
		const newUser = new User({
			username,
			email,
			firebaseUid,
			bookshelf: newBookshelf._id, // associate the new Bookshelf with the new User
		});
		await newUser.save();

		res
			.status(201)
			.json({ message: "User created successfully", userId: newUser._id });
	} catch (err) {
		console.error(err); // Log the error for debugging

		if (err.code === 11000 || err.keyPattern) {
			// Check for duplicate key error
			// This is the error code for a duplicate key error
			return res
				.status(400)
				.json({ message: "Username or email already exists" });
		}

		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		// Use an object as a filter in findOne()
		const user = await User.findOne({ firebaseUid: userId }).populate(
			"bookshelf"
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.status(200).json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
