import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
	messages: [{ type: String }],
	emot: String,
	shortId: String
});

export default mongoose.model("Message", messageSchema);
