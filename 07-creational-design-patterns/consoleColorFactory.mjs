class ColorConsole {
  log() {}
}

class RedConsole extends ColorConsole {
  log(text) {
    console.log(`\x1b[31m${text}\x1b[0m`);
  }
}

class BlueConsole extends ColorConsole {
  log(text) {
    console.log(`\x1b[34m${text}\x1b[0m`);
  }
}

class GreenConsole extends ColorConsole {
  log(text) {
    console.log(`\x1b[32m${text}\x1b[0m`);
  }
}

export function consoleColorFactory(color) {
  switch (color) {
    case 'red':
      return new RedConsole();
    case 'blue':
      return new BlueConsole();
    case 'green':
      return new GreenConsole();
    default:
      throw new Error(`Invalid color: "${color}"`);
  }
}