const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
	isbn: {
		type: String,
		required: true,
		unique: true,
	},
});

const bookshelfSchema = new Schema({
	books: [bookSchema],
});

const Bookshelf = mongoose.model("Bookshelf", bookshelfSchema);

module.exports = Bookshelf;
