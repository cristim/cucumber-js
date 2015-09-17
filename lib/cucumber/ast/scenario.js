function Scenario(data) {
  var Cucumber = require('../../cucumber');

  var self = {
    getKeyword: function getKeyword() {
      return data.keyword;
    },

    getName: function getName() {
      return data.name;
    },

    getDescription: function getDescription() {
      return data.description;
    },

    getUri: function getUri() {
      return data.uri;
    },

    getLine: function getLine() {
      return data.line;
    },

    getBackground: function getBackground() {
      return data.background;
    },

    getSteps: function getSteps() {
      return data.steps;
    },

    getTags: function getTags() {
      return self.getOwnTags().concat(data.inheritedTags);
    },

    getOwnTags: function getOwnTags() {
      return data.tags;
    },

    acceptVisitor: function acceptVisitor(visitor, callback) {
      self.instructVisitorToVisitBackgroundSteps(visitor, function () {
        self.instructVisitorToVisitScenarioSteps(visitor, callback);
      });
    },

    instructVisitorToVisitBackgroundSteps: function instructVisitorToVisitBackgroundSteps(visitor, callback) {
      var background = self.getBackground();
      if (typeof(background) !== 'undefined') {
        var steps = background.getSteps();
        self.instructVisitorToVisitSteps(visitor, steps, callback);
      } else {
        callback();
      }
    },

    instructVisitorToVisitScenarioSteps: function instructVisitorToVisitScenarioSteps(visitor, callback) {
      self.instructVisitorToVisitSteps(visitor, steps, callback);
    },

    instructVisitorToVisitSteps: function instructVisitorToVisitSteps(visitor, steps, callback) {
      steps.forEach(function (step, iterate) {
        visitor.visitStep(step, iterate);
      }, callback);
    }
  };
  return self;
}

module.exports = Scenario;
