import { Writable } from "node:stream";
import { promises as fs } from "node:fs";
import path from "node:path";

const data = {
	path: path.resolve(process.cwd(), "file.txt"),
	content: "Hello, world!",
};

export class ToFileStream extends Writable {
	constructor(options) {
		super({
			...options,
			/**
			 * 문자열이나 버퍼가 아니라 객체를 전달받아야 함
			 */
			objectMode: true,
		});
	}

	/**
	 *
	 * @param {*} chunk
	 * @param {*} encoding
	 * @param {*} cb 작업 완료시 호출할 콜백
	 */
	_write(chunk, encoding, cb) {
		fs.writeFile(chunk.path, chunk.content)
			.then(() => cb())
			.catch(cb);
	}
}

const tfs = new ToFileStream();
tfs.write(data);
tfs.end((args) => console.log("Done:", args));
