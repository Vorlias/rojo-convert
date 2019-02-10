#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";

const rojoJSON = path.resolve(process.cwd(), "rojo.json");

if (fs.existsSync(rojoJSON)) {
} else {
	console.error(`Failed to find ${rojoJSON}`);
}
