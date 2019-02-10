#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";

const rojoJSON = path.resolve(process.cwd(), "rojo.json");

function getPartition(st: string): PartitionInfo {
	const result = st.split(".");
	return {
		service: result[0],
		relativePath: result.splice(1),
	};
}

function addSegmentToPath(
	tree: Rojo5Tree & Rojo5TreeMetadata,
	segments: string[],
	path: string,
) {
	if (segments.length == 0) {
		tree.$path = path;
	} else {
		let segment = segments[0];
		let subTree = tree[segment];
		if (!subTree) {
			subTree = {};
			subTree.$className = "Folder";
			tree[segment] = subTree;
			addSegmentToPath(subTree, segments.splice(1), path);
		} else {
			addSegmentToPath(subTree, segments.splice(1), path);
		}
	}
}

function convertService(
	partition: PartitionInfo,
	file: Rojo5File,
	path: string,
) {
	let subTree = file.tree[partition.service];
	if (!subTree) {
		subTree = {};
		subTree.$className = partition.service;
		file.tree[partition.service] = subTree;

		addSegmentToPath(subTree, partition.relativePath, path);
	} else {
		addSegmentToPath(subTree, partition.relativePath, path);
	}
}

function convert(file: Rojo4File): Rojo5File {
	const rojo5: Rojo5File = {
		name: file.name,
		tree: {},
	};

	rojo5.tree.$className = "DataModel";

	for (const partitionName in file.partitions) {
		const partition = file.partitions[partitionName];

		const path = getPartition(partition.target);
		convertService(path, rojo5, partition.path);
	}

	return rojo5;
}

if (fs.existsSync(rojoJSON)) {
	fs.readFile(rojoJSON, "utf8", function(err, data) {
		if (err) throw err;
		const obj: Rojo4File = JSON.parse(data);

		const out = convert(obj);

		fs.writeFileSync(
			path.resolve(process.cwd(), "default.project.json"),
			JSON.stringify(out, null, "\t"),
		);
	});
} else {
	console.error(`Failed to find ${rojoJSON}`);
}
