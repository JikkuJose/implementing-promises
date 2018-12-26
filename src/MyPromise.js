class MyPromise {
  constructor(executor) {
    this.resolutionQueue = []
    executor(this._resolve.bind(this))
  }

  _resolve() {
    this.resolutionQueue.forEach(r => r())
    this.resolutionQueue = []
  }

  then(resolutionHandler) {
    this.resolutionQueue.push(resolutionHandler)
  }
}

module.exports = MyPromise
