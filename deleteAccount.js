const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("./schemas/user"); // Import your User model
const Bookshelf = require("./schemas/bookshelf"); // Import your Bookshelf model
const deleteAccount = require("./deleteAccount");

router.delete("/delete-user/:firebaseUid", async (req, res) => {
	if (!req.params.firebaseUid) {
		return res.status(400).json({ message: "Firebase UID is required" });
	}

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		console.log(
			`Attempting to delete user with UID: ${req.params.firebaseUid}`
		);
		const user = await User.findOne({
			firebaseUid: req.params.firebaseUid,
		}).session(session);

		if (!user) {
			console.log(`User not found with UID: ${req.params.firebaseUid}`);
			return res.status(404).json({ message: "User not found" });
		}

		await Bookshelf.deleteOne({ _id: user.bookshelf }).session(session);
		await User.deleteOne({ _id: user._id }).session(session);

		await session.commitTransaction();
		console.log(`User deleted successfully: ${req.params.firebaseUid}`);
		res.status(200).json({ message: "User deleted successfully" });
	} catch (error) {
		console.error(`Error during user deletion: ${error}`);
		await session.abortTransaction();
		res
			.status(500)
			.json({ message: "Failed to delete user", error: error.message });
	} finally {
		session.endSession();
	}
});

module.exports = router;
