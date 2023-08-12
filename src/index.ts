// alt1 base libs, provides all the commonly used methods for image matching and capture
// also gives your editor info about the window.alt1 api
import * as a1lib from "alt1";
import BuffReader, { Buff } from "alt1/buffs";
import { webpackImages, ImgRef } from "alt1/base";
// tell webpack that this file relies index.html, appconfig.json and icon.png, this makes webpack
// add these files to the output directory
// this works because in /webpack.config.js we told webpack to treat all html, json and imageimports
// as assets
import "./index.html";
import "./appconfig.json";
import "./icon.png";

var output = document.getElementById("output");

// loads all images as raw pixel data async, images have to be saved as *.data.png
// this also takes care of metadata headers in the image that make browser load the image
// with slightly wrong colors
// this function is async, so you cant acccess the images instantly but generally takes <20ms
// use `await imgs.promise` if you want to use the images as soon as they are loaded

var imgs = webpackImages({
	necrosis12: require("./necrosis12.data.png"),
	soul3: require("./souls.data.png"),
	spec: require("./spec.data.png")
});

let toggle = false;

export function toggleNecrosisAlertOn() {
	if (!window.alt1) {
		output.insertAdjacentHTML("beforeend", `<div>You need to run this page in alt1 to capture the screen</div>`);
		return;
	}
	if (!alt1.permissionPixel) {
		output.insertAdjacentHTML("beforeend", `<div>Page is not installed as app or capture permission is not enabled</div>`);
		return;
	}
	toggle === true ? toggle = false : toggle = true;	
}


async function findNecrosisStacks(img)
{
	let loc = img.findSubimage(imgs.necrosis12);
	for (let match of loc) {

		//output.insertAdjacentHTML("beforeend", `<div>match at: ${match.x}, ${match.y}</div>`);

		//get the pixel data around the matched area and show them in the output
		//let pixels = img.toData(match.x - 20, match.y - 20, imgs.necrosis12.width + 40, imgs.necrosis12.height + 40);
		//output.insertAdjacentElement("beforeend", pixels.toImage());
		//alt1.overLayRect(a1lib.mixColor(0, 255, 0), match.x, match.y, imgs.necrosis12.width, imgs.necrosis12.height, 100, 3);
		alert(img, match.x, match.y, imgs.necrosis12.width, imgs.necrosis12.height)
	}
}
async function findSoulStacks(img)
{
	let loc = img.findSubimage(imgs.soul3);
	for (let match of loc) {
		alert(img, match.x, match.y, imgs.soul3.width, imgs.soul3.height)
		//alt1.overLayRect(a1lib.mixColor(0, 255, 0), match.x, match.y, imgs.soul3.width, imgs.soul3.height, 100, 3);
	}
}
function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function alert(img, x, y, w, h)
{
	alt1.overLayRect(a1lib.mixColor(0, 255, 0), x, y, w, h, 100, 3);
}
//check if we are running inside alt1 by checking if the alt1 global exists
if (window.alt1) {
	alt1.identifyAppUrl("./appconfig.json");

	setInterval(() => {			
		var img = a1lib.captureHoldFullRs();
		findNecrosisStacks(img)
		findSoulStacks(img)
	}, 100);	

		//also the worst possible example of how to use global exposed exports as described in webpack.config.js
	output.insertAdjacentHTML("beforeend", `
	<button onclick='TestApp.toggleNecrosisAlertOn()'>Click to toggle on the necrosis stack tracker</button>`
	);

} else {
	let addappurl = `alt1://addapp/${new URL("./appconfig.json", document.location.href).href}`;
	output.insertAdjacentHTML("beforeend", `
		Alt1 not detected, click <a href='${addappurl}'>here</a> to add this app to Alt1
	`);
}

