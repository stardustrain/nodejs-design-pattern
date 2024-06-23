import { Readable } from "node:stream";
import Chance from "chance";

const chance = new Chance();

// 상속 후 _read 메서드 오버라이드
export class RandomStream extends Readable {
  constructor(options) {
    super(options);
    this.emittedBytes = 0;
  }

  _read(size) {
    const chunk = chance.string({ length: size });
    // 내부 버퍼 채우기
    this.push(chunk, "utf8");
    this.emittedBytes += chunk.length;

    if (chance.bool({ likelihood: 5 })) {
      // 스트림 종료를 알리는 값
      this.push(null);
    }
  }
}

// 직접 초기화 후 read 메서드 구현
const randomStream = new Readable({
  highWaterMark: 10,
  read(size) {
    const chunk = chance.string({ length: size });
    this.push(chunk, "utf8");
    this.emittedBytes += chunk.length;

    if (chance.bool({ likelihood: 5 })) {
      this.push(null);
    }
  },
});

const rs = new RandomStream({
  highWaterMark: 10, // 내부 버퍼 상한선
});

randomStream
  .on("data", (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.: ${chunk.toString()}`);
  })
  .on("end", () => {
    console.log(`Data generation complete. ${rs.emittedBytes} bytes emitted.`);
  });
