export class TaskQueue {
  constructor (concurrency) {
    this.concurrency = concurrency
    this.running = 0
    this.queue = []
  }

  /**
   * @param {() => Promise<any>} task 
   */
  runTask (task) {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          resolve(await task())
        } catch (error) {
          reject(error)
        }
      })
      process.nextTick(this.next.bind(this))
    })
  }

  async next () {
    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift()
      this.running++
      try {
        await task();
      } finally {
        this.running--
        this.next();
      }
    }
  }
}
