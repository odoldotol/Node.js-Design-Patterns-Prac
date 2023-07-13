export class TaskQueuePC {
  constructor (concurrency) {
    this.taskQueue = []
    this.consumerQueue = []

    // spawn consumers
    for (let i = 0; i < concurrency; i++) {
      this.consumer()
    }
  }

  /**
   * ### async/await 문법의 사용을 없에고 프로미스만을 사용하기
   * - 비동기적인 재귀가 되도록 하기
   * - 재귀적 프로미스 해결의 메모리 누수 버그 없어야함
   */
  consumer () {
    return new Promise(resolve => {
      this.getNextTask()
      .then(task => task())
      .catch(err => console.error(err))
      .finally(() => { // getNextTask 와 task 가 실패하든 성공하든 이 함수는 재귀적으로 실행되어야함.
        // resolve(this.consumer()) 는 무한 재귀 프로미스 해결 체인의 메모리 누수 버그를 일으킬 것임.
        this.consumer()
        resolve()
      });
    });
  }

  getNextTask () {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        return resolve(this.taskQueue.shift())
      }

      this.consumerQueue.push(resolve)
    })
  }

  runTask (task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task()
        taskPromise.then(resolve, reject)
        return taskPromise
      }

      if (this.consumerQueue.length !== 0) {
        // there is a sleeping consumer available, use it to run our task
        const consumer = this.consumerQueue.shift()
        consumer(taskWrapper)
      } else {
        // all consumers are busy, enqueue the task
        this.taskQueue.push(taskWrapper)
      }
    })
  }
}
