
setTimeout(async () => {
  console.log("1");
  Promise.resolve("promise 2").then(console.log);
  setImmediate(() => console.log("setImmediate 3"));
  console.log("4");
  process.nextTick(() => console.log("nextTick 5"));
  console.log("6");
}, 0);

setTimeout(async () => {
  console.log("--------------------------");
}, 100);


setTimeout(async () => {
  console.log("1");
  Promise.resolve("promise 2").then(console.log);
  setImmediate(() => console.log("setImmediate 3"));
  console.log(await "await 4");
  process.nextTick(() => console.log("nextTick 5"));
  console.log("6");
}, 200);