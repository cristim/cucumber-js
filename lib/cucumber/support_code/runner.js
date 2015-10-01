function Runner () {
  var self = {
    run: function (code, context, parameters, callback) {
      var callbackInterface = code.length === (parameters.length + 1);
      var onAsynchronousFinish = function (error) {
        Cucumber.Util.Exception.unregisterUncaughtExceptionHandler(onAsynchronousFinish);
        callback(error);
      };

      if (callbackInterface) {
        parameters = parameters.concat([onAsynchronousFinish]);
      }

      var result;
      try {
        result = code.apply(context, parameters);
      } catch (exception) {
        return callback(exception);
      }

      var promiseInterface = result && typeof result.then === 'function';

      if (callbackInterface || promiseInterface) {
        Cucumber.Util.Exception.registerUncaughtExceptionHandler(onAsynchronousFinish);

        if (promiseInterface) {
          var onResolve = callback;
          var onReject = function(error) {
            callback(error || new Error('promise rejected without an error'));
          };
          result.then(onResolve, onReject);
        }
      } else {
        callback();
      }
    }
  };

  return self;
}

module.exports = Runner;
