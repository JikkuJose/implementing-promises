class MyPromise {
  constructor(executor) {
    this.resolutionQueue = []
    executor(this._resolve.bind(this))
  }

  _resolve(value) {
    while (this.resolutionQueue.length > 0) {
      let handler = this.resolutionQueue.shift()
      handler(value)
    }
  }

  then(resolutionHandler) {
    console.log(resolutionHandler)
    this.resolutionQueue.push(resolutionHandler)
    console.log(this.resolutionQueue)
  }
}

module.exports = MyPromise
