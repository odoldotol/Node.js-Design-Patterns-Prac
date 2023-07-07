/**
 * ### Promise.all 구현
 * - Promise, async/await 두 가지 모두 보완할 수 있어야함
 * - 기능적으로 Promise.all() 과 동일해야함
 * @param {Iterable< T | PromiseLike<T> >} promises
 * @returns {Promise<Array<T>>}
 */
function promiseAll(promises) {
  return new Promise(async (resolve, reject) => {
    const result = [];
    let length = 0;
    let completed = 0;
    for (const p of promises) {
      length++;
      process.nextTick(async () => {
        try {
          result.push(await p);
          completed++;
          if (completed === length) {
            resolve(result);
          };
        } catch (error) {
          reject(error);
        };
      });
    };
  });
}

console.log("------- Promise.all() -------");
console.log(await Promise.all(
  [1, "a", Promise.resolve(3), new Promise(r => setTimeout(() => r(4), 1000)), new Promise(r => setTimeout(() => r(5), 1000))][Symbol.iterator]()
).catch((error) => (console.error(error), null)));

console.log("------- promiseAll() -------");
console.log(await promiseAll(
  [1, "a", Promise.resolve(3), new Promise(r => setTimeout(() => r(4), 1000)), new Promise(r => setTimeout(() => r(5), 1000))][Symbol.iterator]()
).catch((error) => (console.error(error), null)));