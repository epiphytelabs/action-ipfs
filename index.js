const core = require("@actions/core");
const { create, globSource } = require("ipfs-http-client");

const ipfs = create({ host: core.getInput("host"), port: core.getInput("port"), protocol: core.getInput("protocol") });

async function main() {
	try {
		const path = core.getInput("path");
		const files = globSource(path, { recursive: true });
		const result = await ipfs.add(files, { pin: true });
		const cid = result.cid.toString();

		core.setOutput("cid", cid);

		console.log("Published", cid);
	} catch (error) {
		core.setFailed(error.message);
		throw error;
	}
}

main();
