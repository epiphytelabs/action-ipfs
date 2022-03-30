const core = require("@actions/core");
const { create, globSource } = require("ipfs-http-client");

async function main() {
	try {
		let options = {
			host: core.getInput("host"),
			port: core.getInput("port"),
			protocol: core.getInput("protocol"),
		};

		const auth = core.getInput("auth");

		if (auth !== "") {
			options.headers = {
				authorization: "Basic " + Buffer.from(auth).toString("base64"),
			};
		}

		const ipfs = create(options);

		const path = core.getInput("path");
		const files = globSource(path, { recursive: true });
		const result = await ipfs.add(files, { pin: true }).error((error) => console.log("error", error));
		console.log("result", result);
		const cid = result.cid.toString();

		console.log("Published", cid);
		core.setOutput("cid", cid);
	} catch (error) {
		core.setFailed(error.message);
		throw error;
	}
}

main();
