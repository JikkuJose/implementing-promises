const MyPromise = require("./MyPromise.js")
// jest.setTimeout(30000)

describe("MyPromise", () => {
  it("executor function is called immediately", () => {
    let string

    new MyPromise(function() {
      string = "foo"
    })

    expect(string).toBe("foo")
  })

  it("resolution handler is called when promise is resolved", function(done) {
    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, 1000)
    })

    const callBack = jest.fn().mockName("Unicorn")

    promise.then(callBack)

    setTimeout(function() {
      expect(callBack).toBeCalled()
    }, 10)

    done()
  })

  xit("promise supports many resolution handlers", function(t) {
    let testString = "foo"

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve(testString)
      }, 100)
    })

    promise.then(function(string) {
      expect(string).toBe(testString)
    })

    promise.then(function(string) {
      expect(string).toBe(testString)
    })
  })

  xit("resolution handlers can be chained", function(t) {
    let testString = "foo"

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, 100)
    })

    promise
      .then(function() {
        return new MyPromise(function(resolve) {
          setTimeout(function() {
            resolve(testString)
          }, 100)
        })
      })
      .then(function(string) {
        expect(string).toBe(testString)
      })
  })

  xit("chaining works with non-promise return values", function(t) {
    let testString = "foo"

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, 100)
    })

    promise
      .then(function() {
        return testString
      })
      .then(function(string) {
        expect(string).toBe(testString)
      })
  })

  xit("resolution handlers can be attached when promise is resolved", function(
    t
  ) {
    let testString = "foo"

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve(testString)
      }, 100)
    })

    promise.then(function() {
      setTimeout(function() {
        promise.then(function(value) {
          expect(value).toBe(testString)
        })
      }, 100)
    })
  })

  xit("calling resolve second time has no effect", function(t) {
    let testString = "foo"
    let testString2 = "bar"

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve(testString)
        resolve(testString2)
      }, 100)
    })

    promise.then(function(value) {
      expect(value).toBe(testString)

      setTimeout(function() {
        promise.then(function(value) {
          expect(value).toBe(testString)
        })
      }, 100)
    })
  })

  xit("rejection handler is called when promise is rejected", function(t) {
    let testError = new Error("Something went wrong")

    let promise = new MyPromise(function(resolve, reject) {
      setTimeout(function() {
        reject(testError)
      }, 100)
    })

    promise.catch(function(value) {
      expect(value).toBe(testError)
    })
  })

  xit("rejections are passed downstream", function(t) {
    let testError = new Error("Something went wrong")

    let promise = new MyPromise(function(resolve, reject) {
      setTimeout(function() {
        reject(testError)
      }, 100)
    })

    promise
      .then(function() {
        return new MyPromise(function(resolve) {
          setTimeout(function() {
            resolve(testError)
          }, 100)
        })
      })
      .catch(function(value) {
        expect(value).toBe(testError)
      })
  })

  xit("rejecting promises returned from resolution handlers are caught properly", function(
    t
  ) {
    let testError = new Error("Something went wrong")

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, 100)
    })

    promise
      .then(function() {
        return new MyPromise(function(resolve, reject) {
          setTimeout(function() {
            reject(testError)
          }, 100)
        })
      })
      .catch(function(value) {
        expect(value).toBe(testError)
      })
  })

  xit("rejection handlers catch synchronous errors in resolution handlers", function(
    t
  ) {
    let testError = new Error("Something went wrong")

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, 100)
    })

    promise
      .then(function() {
        throw testError
      })
      .catch(function(value) {
        expect(value).toBe(testError)
      })
  })

  xit("rejection handlers catch synchronous errors in the executor function", function(
    t
  ) {
    let testError = new Error("Something went wrong")

    let promise = new MyPromise(function() {
      throw testError
    })

    promise
      .then(function() {
        return new MyPromise(function(resolve) {
          setTimeout(function() {
            resolve(testError)
          }, 100)
        })
      })
      .catch(function(value) {
        expect(value).toBe(testError)
      })
  })

  xit("rejection handlers catch synchronous erros", function(t) {
    let testError = new Error("Something went wrong")

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, 100)
    })

    promise
      .then(function() {
        throw new Error("some Error")
      })
      .catch(function() {
        throw testError
      })
      .catch(function(value) {
        expect(value).toBe(testError)
      })
  })

  xit('chaining works after "catch"', function(t) {
    let testString = "foo"

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, 100)
    })

    promise
      .then(function() {
        throw new Error("some Error")
      })
      .catch(function() {
        return new MyPromise(function(resolve) {
          setTimeout(function() {
            resolve(testString)
          }, 100)
        })
      })
      .then(function(value) {
        expect(value).toBe(testString)
      })
  })

  xit("rejecting promises returned from rejection handlers are caught properly", function(
    t
  ) {
    let testError = new Error("Something went wrong")

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, 100)
    })

    promise
      .then(function() {
        throw new Error("some Error")
      })
      .catch(function() {
        return new MyPromise(function(resolve, reject) {
          setTimeout(function() {
            reject(testError)
          }, 100)
        })
      })
      .catch(function(value) {
        expect(value).toBe(testError)
      })
  })

  xit("second argument in then is treated as a rejection handler", function(t) {
    let testError = new Error("Something went wrong")

    let promise = new MyPromise(function(resolve, reject) {
      setTimeout(function() {
        reject(testError)
      }, 100)
    })

    promise.then(
      function() {},
      function(error) {
        expect(error).toBe(testError)
      }
    )
  })

  xit("second argument in then is attached to the promise then is called on", function(
    t
  ) {
    let testError = new Error("Something went wrong")
    let didRun = false

    let promise = new MyPromise(function(resolve) {
      setTimeout(function() {
        resolve()
      }, 100)
    })

    promise
      .then(
        function() {
          return new MyPromise(function(resolve, reject) {
            setTimeout(function() {
              reject(testError)
            }, 100)
          })
        },
        function() {
          didRun = true
        }
      )
      .catch(function(error) {
        expect(error).toBe(testError)
        expect(didRun).toBe(false)
      })
  })
})
