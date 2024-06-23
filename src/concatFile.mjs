import { createReadStream, createWriteStream } from "node:fs";
import { Readable, Transform } from "node:stream";

export const concatFiles = (files, dest) => {
  return new Promise((resolve, reject) => {
    const destStream = createWriteStream(dest);

    Readable.from(files)
      .pipe(
        new Transform({
          objectMode: true,
          transform(filename, encoding, done) {
            const src = createReadStream(filename);
            src.pipe(destStream, { end: false });
            src.on("error", done);
            src.on("end", done);
          },
        }),
      )
      .on("error", (error) => {
        reject(error);
      })
      .on("finish", () => {
        destStream.end();
        resolve();
      });
  });
};
