#!/usr/bin/env node
import fs from "fs-extra";
import path from "path";

const rojoJSON = path.resolve(process.cwd(), "rojo.json");

interface Rojo4Partition {
	target: string;
	path: string;
}

interface Rojo4File {
	name: string;
	servePort?: number;
	partitions: { [name: string]: Rojo4Partition };
}

interface Rojo5TreeProperty {
	Type: string;
	Value: any;
}

interface Rojo5TreeMetadata {
	$className?: string;
	$path?: string;
	$properties?: Array<Rojo5TreeProperty>;
	$ignoreUnknownInstances?: boolean;
}

interface Rojo5Tree {
	[name: string]: Rojo5Tree & Rojo5TreeMetadata;
}

interface Rojo5File {
	name: string;
	tree: Rojo5Tree & Rojo5TreeMetadata;
}

interface PartitionInfo {
	service: string;
	relativePath: string[];
}

function getPartition(st: string): PartitionInfo {
	const result = st.split(".");
	return {
		service: result[0],
		relativePath: result.splice(1),
	};
}

function convertService(
	partition: PartitionInfo,
	file: Rojo5File,
	path: string,
) {
	if (!file.tree[partition.service]) {
		const subTree: Rojo5TreeMetadata & Rojo5Tree = {};
		subTree.$className = partition.service;
		file.tree[partition.service] = subTree;

		if (partition.relativePath.length == 0) {
			subTree.$path = path;
		}
	} else {
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
		console.log(out);
	});
} else {
	console.error(`Failed to find ${rojoJSON}`);
}
