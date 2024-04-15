import { consoleColorFactory } from "./consoleColorFactory.mjs";

((colors) => {
  for (let color of colors) {
    try {
      consoleColorFactory(color).log(`Hello, ${color}!`);
    } catch(e) {
      console.log(e.message);
    }
  }
})(['red', 'blue', 'green', 'invalid', ,]);