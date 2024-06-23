import { Transform } from "node:stream";

export class ReplaceStream extends Transform {
  constructor(searchString, replaceString, options) {
    super({ ...options });
    this.searchString = searchString;
    this.replaceString = replaceString;
    this.tail = "";
  }

  _transform(chunk, encoding, cb) {
    console.log(this.tail);
    const pieces = (this.tail + chunk).split(this.searchString); // [Hello W]
    console.log("pieces", pieces);
    const lastPiece = pieces[pieces.length - 1]; // W
    const tailLen = this.searchString.length - 1; // 4
    this.tail = lastPiece.slice(-tailLen); //
    pieces[pieces.length - 1] = lastPiece.slice(0, -tailLen);
    console.log("pieces", pieces);
    this.push(pieces.join(this.replaceString));
    console.log("pieces.join(this.replaceString)", pieces.join(this.replaceString));
    cb();
  }
}

const replaceStream = new ReplaceStream("World", "Node.js");

replaceStream.on("data", (chunk) => {
  console.log(chunk.toString());
});

replaceStream.write("Hello W");
replaceStream.write("orld!");
replaceStream.end();
