import { TaskQueuePC } from './11-asyncawait-web-spider-v4/TaskQueuePC.js';

/**
 * ### 프라미스와 동시성 제한을 지원하는 Array.map() 의 비동기 병렬 버전을 구현하기
 * - 소개된 패턴은 사용해도 되지만, TaskQueue, TaskQueuePC 를 직접적으로 보완하지 않아야 함.
 * 
 * @param {Iterable<any>} iterable 이터러블
 * @param {(item) => Promise<any>} callback 이터러블의 각 아이템을 입력으로 받고 프라미스와 간단한 값을 반환하는 콜백
 * @param {number} concurrency 이터러블에서 얼마나 많은 아이템이 벙렬로 처리될 수 있는지 정의하는 동시성
 */
async function mapAsync(iterable, callback, concurrency) {
  const result = [];
  const taskQueue = new TaskQueuePC(concurrency);

  const arrayFromIter = [...iterable];

  await arrayFromIter.reduce(async (acc, item) => {
    try {
      const value = await taskQueue.runTask(() => callback(item))
      await acc;
      return result.push(value);
    } catch (err) {
      throw err;
    }
  }, Promise.resolve());

  return result;
}



// ---------- TEST ----------------------------------------

const testIter = function* () {
  for (let i = 1; i <= 5; i++) {
    yield i;
  }
};
const callbackAsync = async ele => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(ele * 2)
    }, ele%2 === 0 ? 100 : 200)
  })
};

// 항상 [ 2, 4, 6, 8, 10 ] 로, callback 실행 순서와 관계없이 요소들의 순서는 보존되어야함.
// concurrency 가 2 일떄 500ms, 3 일때 400ms, 4 일떄 300ms, 5일때 200ms 가 걸림.

console.time('mapAsync-2_expect: 500ms');
console.log(await mapAsync(testIter(), callbackAsync, 2));
console.timeEnd('mapAsync-2_expect: 500ms');

console.time('mapAsync-3_expect: 400ms');
console.log(await mapAsync(testIter(), callbackAsync, 3));
console.timeEnd('mapAsync-3_expect: 400ms');

console.time('mapAsync-4_expect: 300ms');
console.log(await mapAsync(testIter(), callbackAsync, 4));
console.timeEnd('mapAsync-4_expect: 300ms');

console.time('mapAsync-5_expect: 200ms');
console.log(await mapAsync(testIter(), callbackAsync, 5));
console.timeEnd('mapAsync-5_expect: 200ms');