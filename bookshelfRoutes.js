const express = require("express");
const router = express.Router();
const User = require("./schemas/user"); // Import your User model
const Bookshelf = require("./schemas/bookshelf"); // Import your Bookshelf model

// Route to add a book to a user's bookshelf
router.post("/add", async (req, res) => {
	try {
		const { userId, isbn } = req.body;

		// Validate request body
		if (!userId || !isbn) {
			return res.status(400).json({ message: "Missing required fields" });
		}

		// Find the user by their Firebase UID
		const user = await User.findOne({ firebaseUid: userId });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Retrieve the user's bookshelf using the ObjectId
		const userBookshelf = await Bookshelf.findById(user.bookshelf);
		if (!userBookshelf) {
			return res.status(404).json({ message: "Bookshelf not found" });
		}

		// Check if book already exists in bookshelf
		if (userBookshelf.books.some((book) => book.isbn === isbn)) {
			return res
				.status(400)
				.json({ message: "Book already exists in bookshelf" });
		}

		// Add the book to the user's bookshelf
		userBookshelf.books.push({ isbn });
		await userBookshelf.save();

		res.status(201).json({ message: "Book added to bookshelf successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

// Route to get all books from a user's bookshelf
router.get("/:userId", async (req, res) => {
	try {
		const { userId } = req.params;

		// Find the user by their Firebase UID
		const user = await User.findOne({ firebaseUid: userId }).populate(
			"bookshelf"
		);
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Respond with the user's bookshelf
		res.status(200).json(user.bookshelf);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
