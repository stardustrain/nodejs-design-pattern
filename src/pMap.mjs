const sites = [
  "https://google.com",
  "https://avajs.dev",
  "https://github.com",
  "https://google.com1",
  "https://avajs.dev1",
  "https://github.com1",
  "https://google.com2",
  "https://avajs.dev2",
  "https://github.com2",
  "https://google.com3",
  "https://avajs.dev3",
  "https://github.com3",
  "https://google.com4",
  "https://avajs.dev4",
  "https://github.com4",
  "https://google.com5",
  "https://avajs.dev5",
  "https://github.com5",
];

const mapper = (site) => Promise.resolve(site);

async function mapAsync(iterable, callback, concurrency) {
  const iterator = iterable[Symbol.iterator]();
  let pending = 0;
  const result = [];

  const upPending = () => {
    pending++;
  };

  const downPending = () => {
    pending--;
  };

  const next = async () => {
    const queue = [];

    while (iterable.length > 0 && pending < concurrency) {
      const { value, done } = iterator.next();

      if (done) {
        break;
      }

      upPending();

      queue.push(
        callback(value).finally(() => {
          downPending();
        }),
      );
    }

    const res = await Promise.all(queue);
    result.push(...res);
  };

  const callCount = iterable.length < concurrency ? 1 : iterable.length / concurrency;

  for (let i = 0; i < callCount; i++) {
    await next();
  }

  return result;
}

const result = (async () => await mapAsync(sites, mapper, 2))();

result.then(console.log);
