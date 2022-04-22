import sharp from "sharp";

const compressImage = async (filepath, filename) => {
	await sharp(filepath).resize(500).jpeg({ quality: 75 }).toFile(`${filepath}small.jpg`);

	return filename + "small.jpg";
};

export default compressImage;
