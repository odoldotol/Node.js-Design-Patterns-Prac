
setTimeout(async () => {
  console.log("1");
  Promise.resolve("promise 2").then(console.log);
  setImmediate(() => console.log("setImmediate 3"));
  process.nextTick(() => console.log("nextTick 4"));
  console.log("5");
  console.log("6");
}, 0);

setTimeout(async () => {
  console.log("--------------------------");
}, 100);


setTimeout(async () => {
  console.log("1");
  Promise.resolve("promise 2").then(console.log);
  setImmediate(() => console.log("setImmediate 3"));
  process.nextTick(() => console.log("nextTick 4"));
  console.log(await "await 5");
  console.log("6");
}, 200);