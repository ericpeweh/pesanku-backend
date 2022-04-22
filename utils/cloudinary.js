import cloudinary from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.v2.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
	secure: true
});

const uploadFile = async filename => {
	try {
		const res = await cloudinary.v2.uploader.upload(`uploads/${filename}`, { folder: "pesanku" });
		return res;
	} catch (error) {
		console.log("CLOUDINARY ERROR:", error);
	}
};

export { uploadFile };
