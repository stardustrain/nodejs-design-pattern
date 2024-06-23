import { createReadStream } from "node:fs";
import { Transform, pipeline } from "node:stream";
import { resolve } from "node:path";
import { stdout } from "node:process";

class CSVParseStream extends Transform {
  constructor(options) {
    super({ readableObjectMode: true, writableObjectMode: true, highWaterMark: 10, ...options });
  }

  _transform(chunk, _, done) {
    const stringifiedChunk = chunk.toString();
    // lsoa_code, borough, major_category, minor_category, value, year, month;
    for (const line of stringifiedChunk.split("\n")) {
      if (line === "") continue;
      const [id, borough, majorCategory, minorCategory, value, year, month] = line.split(",");
      this.push({
        id,
        borough,
        majorCategory,
        minorCategory,
        value,
        year,
        month,
      });
    }
    done();
  }
}

class CrimeCountStream extends Transform {
  constructor(options) {
    super({ readableObjectMode: true, writableObjectMode: true, ...options });
    this.crimeCount = {};
  }

  _transform(chunk, _, done) {
    if (chunk.year === undefined) {
      return done();
    }
    if (chunk.year === "1") {
      console.log(chunk.id);
    }
    if (!Object.hasOwn(this.crimeCount, chunk.year)) {
      this.crimeCount[chunk.year] = 1;
      return done();
    }

    this.crimeCount[chunk.year] = this.crimeCount[chunk.year] + 1;
    done();
  }

  _flush(done) {
    this.push(JSON.stringify(this.crimeCount));
    done();
  }
}

const csvStream = pipeline(createReadStream(resolve("./data.csv")), new CSVParseStream(), (err) => {
  console.error(err);
});

csvStream.pipe(new CrimeCountStream()).pipe(stdout);
