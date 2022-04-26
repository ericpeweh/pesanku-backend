import express from "express";
import cors from "cors";
import shortid from "shortid";
import mongoose from "mongoose";
import Message from "./models/message.js";
import env from "dotenv";
import multer from "multer";
import compressImage from "./utils/compressImage.js";
import fs from "fs";
import { uploadFile } from "./utils/cloudinary.js";
const upload = multer({ dest: "uploads/" });

env.config();
const port = 5000;
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "15mb" }));
app.use(express.json({ extended: true, limit: "15mb" }));

app.get("/", (req, res) => res.json("pesanKu"));

app.get("/:msgId", async (req, res) => {
	try {
		const { msgId } = req.params;
		const data = await Message.findOne({ shortId: msgId });

		if (data) {
			res.json(data);
		} else {
			res.json({});
		}
	} catch (err) {
		console.log(err.message);
	}
});

app.post("/create", upload.single("image"), async (req, res) => {
	const { emot, messages, sender = "" } = req.body;
	const image = req.file;
	let imageUrl;

	if (image) {
		const result = await compressImage(image.path, image.filename);
		if (result) {
			imageUrl = await uploadFile(result);
			fs.unlink(`uploads/${result}`, err => console.log(err));
			fs.unlink(image.path, err => console.log(err));
		}
	}

	try {
		const shortId = shortid.generate();
		const newMessage = new Message({
			messages,
			emot,
			shortId,
			sender,
			image: imageUrl?.secure_url || "",
			createdAt: new Date()
		});

		await newMessage.save();

		res.json({ link: `https://pesanku.netlify.app/${shortId}` });
		// res.json({ link: `http://localhost:3000/${shortId}` });
	} catch (e) {
		res.json({ err: e.message });
	}
});

app.get("*", (req, res) => {
	res.status(404).json("NOT ROUTE FOUND!");
});

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() =>
		app.listen(process.env.PORT || port, () => console.log(`Server running on port: ${port}`))
	)
	.catch(error => console.log(error));
