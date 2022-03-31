import express from "express";
import cors from "cors";
import shortid from "shortid";
import mongoose from "mongoose";
import Message from "./models/message.js";
import env from "dotenv";

env.config();
const port = 5000;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ extended: true, limit: "1mb" }));

app.get("/", (req, res) => res.json("pesanKu"));

app.get("/:msgId", async (req, res) => {
	try {
		const { msgId } = req.params;
		const data = await Message.find({ shorId: msgId });
		console.log(data);

		res.json(data[0]);
	} catch (err) {
		console.log(err.message);
	}
});

app.post("/create", async (req, res) => {
	const { emot, messages } = req.body;

	try {
		const shortId = shortid.generate();
		const newMessage = new Message({ messages, emot, shortId });

		const result = await newMessage.save();

		res.json({ link: `https://pesanku.netlify.app/${shortId}` });
	} catch (e) {
		res.json({ err: e.message });
	}
});

app.get("*", (req, res) => {
	res.status(404).json("NOT FOUND!");
});

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => app.listen(port, () => console.log(`Server running on port: ${port}`)))
	.catch(error => console.log(error));
