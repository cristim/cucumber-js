function Runner () {
  var self = {
    run: function (code, context, parameters, callback) {
      var callbackInterface = code.length === (parameters.length + 1);
      var asynchronousFinish = function (error) {
        process.removeListener('uncaughtException', asynchronousFinish);
        callback(error);
      };

      if (callbackInterface) {
        parameters = parameters.concat([asynchronousFinish]);
      }

      var result;
      try {
        result = code.apply(context, parameters);
      } catch (exception) {
        return callback(exception);
      }

      var promiseInterface = result && typeof result.then === 'function';

      if (callbackInterface || promiseInterface) {
        process.on('uncaughtException', asynchronousFinish);

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
