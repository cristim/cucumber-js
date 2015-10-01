function StepDefinition(pattern, code) {
  var Cucumber = require('../../cucumber');

  var self = {
    getPatternRegexp: function getPatternRegexp() {
      var regexp;
      if (pattern.replace) {
        var regexpString = pattern
          .replace(StepDefinition.UNSAFE_STRING_CHARACTERS_REGEXP, StepDefinition.PREVIOUS_REGEXP_MATCH)
          .replace(StepDefinition.QUOTED_DOLLAR_PARAMETER_REGEXP, StepDefinition.QUOTED_DOLLAR_PARAMETER_SUBSTITUTION)
          .replace(StepDefinition.DOLLAR_PARAMETER_REGEXP, StepDefinition.DOLLAR_PARAMETER_SUBSTITUTION);
        regexpString =
          StepDefinition.STRING_PATTERN_REGEXP_PREFIX +
          regexpString +
          StepDefinition.STRING_PATTERN_REGEXP_SUFFIX;
        regexp = new RegExp(regexpString);
      }
      else
        regexp = pattern;
      return regexp;
    },

    matchesStepName: function matchesStepName(stepName) {
      var regexp = self.getPatternRegexp();
      return regexp.test(stepName);
    },

    invoke: function invoke(step, world, scenario, callback) {
      function time() {
        if (typeof process !== 'undefined' && process.hrtime) {
          return process.hrtime();
        }
        else {
          return new Date().getTime();
        }
      }

      var durationInNanoseconds = function durationInNanoseconds(start) {
        if (typeof process !== 'undefined' && process.hrtime) {
          var duration = process.hrtime(start);
          return duration[0] * 1e9 + duration[1];
        }
        else {
          return (new Date().getTime() - start) * 1e6;
        }
      };

      if (!code || typeof(code) === 'string') {
        var stepResultData = {
          step: step,
          attachments: scenario.getAttachments()
        };

        if(typeof(code) === 'string') {
          stepResultData.pendingReason = code;
        }

        var stepResult = Cucumber.Runtime.PendingStepResult(stepResultData);
        callback(stepResult);
        return;
      }

      var runner = Cucumber.SupportCode.Runner();
      var parameters = self.buildInvocationParameters(step);

      var start = time();
      var codeCallback = self.buildCodeCallback(function (error) {
        var stepResultData = {
          step: step,
          duration: durationInNanoseconds(start),
          attachments: scenario.getAttachments()
        };

        var stepResult;
        if (error) {
          stepResultData.failureException = error;
          stepResult = Cucumber.Runtime.FailedStepResult(stepResultData);
        } else {
          stepResult = Cucumber.Runtime.SuccessfulStepResult(stepResultData);
        }

        callback(stepResult);
      });

      runner.run(code, world, parameters, codeCallback)
    },

    buildCodeCallback: function buildCodeCallback(callback) {
      return callback;
    },

    buildInvocationParameters: function buildInvocationParameters(step) {
      var stepName      = step.getName();
      var patternRegexp = self.getPatternRegexp();
      var parameters    = patternRegexp.exec(stepName);
      parameters.shift();
      if (step.hasAttachment()) {
        var attachmentContents = step.getAttachmentContents();
        parameters.push(attachmentContents);
      }
      return parameters;
    }
  };
  return self;
}

StepDefinition.DOLLAR_PARAMETER_REGEXP              = /\$[a-zA-Z_-]+/g;
StepDefinition.DOLLAR_PARAMETER_SUBSTITUTION        = '(.*)';
StepDefinition.PREVIOUS_REGEXP_MATCH                = '\\$&';
StepDefinition.QUOTED_DOLLAR_PARAMETER_REGEXP       = /"\$[a-zA-Z_-]+"/g;
StepDefinition.QUOTED_DOLLAR_PARAMETER_SUBSTITUTION = '"([^"]*)"';
StepDefinition.STRING_PATTERN_REGEXP_PREFIX         = '^';
StepDefinition.STRING_PATTERN_REGEXP_SUFFIX         = '$';
StepDefinition.UNSAFE_STRING_CHARACTERS_REGEXP      = /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\|]/g;

module.exports = StepDefinition;
