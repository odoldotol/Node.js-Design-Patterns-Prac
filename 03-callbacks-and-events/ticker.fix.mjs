import { EventEmitter } from 'events';

/**
 * @param {number} number 
 * @param {(n:number)=>any} callback 
 */
function ticker(
  number,
  callback
) {
  const emitter = new EventEmitter();
  let tick_count = 0;

  let ticker50 = () => {
    setTimeout(() => {
      if (ticker50 !== null) {
        emitter.emit('tick');
        tick_count++;
        ticker50();
      }
    }, 50);
  };

  setTimeout(() => {
    ticker50 = null;
    callback(tick_count);
  }, number);

  ticker50();

  return emitter;
};

const runningTicker = ticker(1000, (tick_count) => {
  console.log(tick_count);
});

runningTicker.on('tick', () => console.log('tick'));