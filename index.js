const axios = require('axios');
const imagejs = require('imagejs');
const colorlib = require("./colorlib");

let config = require('./config');

axios.get(config.url).then((result) => {
	createImages(result.data);
}).catch((error) => {
	console.log("Error: " + error);
});

function createImages(images) {
	colorlib.init_hsv();
	images.forEach((image) => {
		saveImage(image);
	});
}

function saveImage(image) {
	let small = new imagejs.Bitmap({width: 8, height: 8, data: new Buffer(4*8*8)});
	let pixel = 0;
	let color, interpolated, timestamp;

	for (let iy=0; iy < 8; iy++) {
		for (let ix=0; ix < 8; ix++) {
			if (iy > 0) {
				pixel = (iy * 8) + ix;
			}
			else {
				pixel = ix;
			}
			color = colorlib.single2rgb24((image.reading.points[pixel]-19)*1700);
			small.setPixel(ix, iy, color[0], color[1], color[2], 1);
			interpolated = small.resize({ width:64, height:64, algorithm: "bilinearInterpolation" });
			timestamp = createTimestamp(image.created_at);
			interpolated.writeFile(`maps/heatmap_${timestamp}.jpg`, { quality: 100});
		}
	}
}

function createTimestamp(value)
{
	return value.replace(/ /g,"_");
}
