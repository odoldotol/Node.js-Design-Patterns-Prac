import { EventEmitter } from 'events'
import { readFile } from 'fs'

class FindRegex extends EventEmitter {
  constructor (regex) {
    super()
    this.regex = regex
    this.files = []
  }

  addFile (file) {
    this.files.push(file)
    return this
  }

  find () {
    console.log('find')

    process.nextTick(() => console.log("nextTick emit", this.emit('nextTick_start', this.files)));

    Promise.resolve().then(() => {
      console.log("promise emit", this.emit('promise_start', this.files));
    });

    new Promise((resolve, reject) => {
      resolve();
    }).then(() => console.log("new promise emit", this.emit('new_promise_start', this.files)));

    for (const file of this.files) {
      readFile(file, 'utf8', (err, content) => {
        if (err) {
          return this.emit('error', err)
        }

        this.emit('fileread', file)

        const match = content.match(this.regex)
        if (match) {
          match.forEach(elem => this.emit('found', file, elem))
        }
      })
    }
    return this
  }
}

const findRegexInstance = new FindRegex(/hello \w+/)
findRegexInstance
  .addFile('fileA.txt')
  .addFile('fileB.json')
  .find()
  .on('found', (file, match) => console.log(`Matched "${match}" in file ${file}`))
  .on('error', err => console.error(`Error emitted ${err.message}`))
  .on('nextTick_start', files => console.log(`(nextTick) Started find in ${files}`))
  .on('new_promise_start', files => console.log(`(new_promise) Started find in ${files}`))
  .on('promise_start', files => console.log(`(promise) Started find in ${files}`));