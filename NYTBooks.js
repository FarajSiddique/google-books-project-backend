const express = require("express");
const router = express.Router();
const axios = require("axios");

const NYT_BOOKS_API_URL = "https://api.nytimes.com/svc/books/v3";
const API_KEY = process.env.REACT_APP_NYT_BOOKS_API_KEY;

router.get("/fetch-top-5-books-fiction", async (req, res) => {
	try {
		const response = await axios.get(
			`${NYT_BOOKS_API_URL}/lists/current/hardcover-fiction.json?api-key=${API_KEY}`
		);

		const top5Books = response.data.results.books.slice(0, 5);
		res.json(top5Books);
	} catch (error) {
		console.error("Error fetching top 5 books", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.get("/fetch-top-5-books-non-fiction", async (req, res) => {
	try {
		const response = await axios.get(
			`${NYT_BOOKS_API_URL}/lists/current/hardcover-nonfiction.json?api-key=${API_KEY}`
		);

		const top5Books = response.data.results.books.slice(0, 5);
		res.json(top5Books);
	} catch (error) {
		console.error("Error fetching top 5 books", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
