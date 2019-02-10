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
