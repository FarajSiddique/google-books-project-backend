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
		if (!query) {
			return res.status(400).json({ message: "Query parameter is required" });
		}
		const page = parseInt(req.query.page) || 1;
		const limit = parseInt(req.query.limit) || 40;
		const startIndex = (page - 1) * limit;
		const response = await axios.get(
			`${GOOGLE_BOOKS_API_URL}/volumes?q=${query}&key=${API_KEY}&startIndex=${startIndex}&maxResults=${limit}&printType=books&orderBy=relevance`
		);
		const booksData = response.data.items;
		if (booksData) {
			booksData.forEach((book) => {
				if (book.id) {
					book.volumeInfo.imageLinks = book.volumeInfo.imageLinks || {};
					book.volumeInfo.imageLinks.coverImage = `https://books.google.com/books/content?id=${book.id}&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api`;
				}
			});
		}
		res.json(response.data);
	} catch (error) {
		console.error("Error fetching books", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

router.get("/:bookId", async (req, res) => {
	try {
		const bookId = req.params.bookId;
		const response = await axios.get(
			`${GOOGLE_BOOKS_API_URL}/volumes/${bookId}?key=${API_KEY}`
		);
		const bookData = response.data;
		if (bookData.id) {
			bookData.volumeInfo.imageLinks = bookData.volumeInfo.imageLinks || {};
			bookData.volumeInfo.imageLinks.coverImage = `https://books.google.com/books/content?id=${bookData.id}&printsec=frontcover&img=1&zoom=2&edge=curl&source=gbs_api`;
		}
		res.json(bookData);
	} catch (error) {
		console.error("Error fetching book details", error);
		res.status(500).json({ message: "Internal Server Error" });
	}
});

module.exports = router;
