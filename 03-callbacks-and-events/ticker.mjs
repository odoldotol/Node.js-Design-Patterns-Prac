import { EventEmitter } from 'events';

/**
 * 
 * @param {number} number 
 * @param {(n:number)=>any} callback 
 */
function ticker(number, callback) {
  const emitter = new EventEmitter();
  let tick_count = 0;

  setTimeout(() => callback(tick_count), number);

  const ticker50 = () => {
    process.nextTick(() => {
      const t = new Date();
      if (t%5 === 0) {
        emitter.emit('error', new Error('tick error'));
      } else {
        emitter.emit('tick', t);
        tick_count++;
      };
    });
    setTimeout(() => {
      ticker50();
    }, 50);
  };

  ticker50();

  return emitter;
}

const runningTicker = ticker(1000, (tick_count) => {
  console.log(tick_count);
});

runningTicker
  .on('tick', (t) => console.log(t))
  .on('error', (err) => console.error(err.message));