import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
	messages: [{ type: String }],
	emot: String,
	shortId: String,
	image: String,
	sender: String,
	createdAt: Date
});

export default mongoose.model("Message", messageSchema);
