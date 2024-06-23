import { Transform } from "node:stream";

// pumpify, parallel-transform 모듈을 살펴볼 것

export class LimitedParallelStream extends Transform {
  constructor(concurrency, userTransform, options) {
    super({
      ...options,
      objectMode: true,
    });
    this.concurrency = concurrency;
    this.running = 0;
    this.userTransform = userTransform;
    this.continueCb = null;
    this.terminateCb = null;
  }

  _transform(chunk, encoding, done) {
    this.running++;
    this.userTransform(chunk, encoding, this.push.bind(this), this._onComplete.bind(this));

    if (this.running < this.concurrency) {
      done();
    } else {
      this.continueCb = done;
    }
  }

  _flush(done) {
    if (this.running > 0) {
      this.terminateCb = done;
    } else {
      done();
    }
  }

  _onComplete(err) {
    this.running--;

    if (err) {
      return this.emit("error", err);
    }

    this.continueCb?.();
    this.continueCb = null;

    if (this.running === 0) {
      this.terminateCb?.();
    }
  }
}
