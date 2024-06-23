import { EventEmitter } from "node:events";

const ticker = (n, cb) => {
  let tickCount = 0;
  const eventEmitter = new EventEmitter();
  eventEmitter.emit("tick");

  const interval = setInterval(() => {
    if (Date.now() % 5 === 0) {
      eventEmitter.emit("error", new Error("tick error"));
      cb(new Error("tick error"), tickCount);
    }
    eventEmitter.emit("tick");
    tickCount++;
  }, 50);

  const timeout = setTimeout(() => {
    clearInterval(interval);
    clearTimeout(timeout);
    cb(null, tickCount);
  }, n);

  return eventEmitter;
};

ticker(1000, (err, tickCount) => {
  if (err) {
    console.error(err);
  } else {
    console.log(tickCount);
  }
}).on("error", () => {});
