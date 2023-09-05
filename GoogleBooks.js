const express = require("express");
const router = express.Router();
const axios = require("axios");

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1";
const API_KEY = process.env.REACT_APP_GOOGLE_BOOKS_API_KEY;

router.get("/book-details-by-isbn", async (req, res) => {
	try {
		const isbn = req.query.isbn;
		const response = await axios.get(
			`${GOOGLE_BOOKS_API_URL}/volumes?q=isbn:${isbn}&key=${API_KEY}`
		);
		res.json(response.data);
	} catch (error) {
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.get("/search", async (req, res) => {
	try {
		const query = req.query.q;
		const response = await axios.get(
			`${GOOGLE_BOOKS_API_URL}/volumes?q=${query}&key=${API_KEY}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching books", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.get("/:bookId", async (req, res) => {
	try {
		const bookId = req.query.bookId;
		const response = await axios.get(
			`${GOOGLE_BOOKS_API_URL}/volumes/${bookId}?key=${API_KEY}`
		);
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching book details", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
