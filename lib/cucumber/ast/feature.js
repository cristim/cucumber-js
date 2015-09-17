function Feature(data) {
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

    hasBackground: function hasBackground() {
      return (typeof(self.getBackground()) !== 'undefined');
    },

    getScenarios: function getScenarios() {
      return data.featureElements;
    },

    hasScenarios: function hasFeatureElements() {
      return self.hasScenarios().length() > 0;
    },

    getTags: function getTags() {
      return tags;
    },

    acceptVisitor: function acceptVisitor(visitor, callback) {
      self.instructVisitorToVisitBackground(visitor, function () {
        self.instructVisitorToVisitScenarios(visitor, callback);
      });
    },

    instructVisitorToVisitBackground: function instructVisitorToVisitBackground(visitor, callback) {
      if (self.hasBackground()) {
        var background = self.getBackground();
        visitor.visitBackground(background, callback);
      } else {
        callback();
      }
    },

    instructVisitorToVisitScenarios: function instructVisitorToVisitScenarios(visitor, callback) {
      self.getScenarios().forEach(function (scenario, iterate) {
        visitor.visitScenario(scenario, iterate);
      }, callback);
    }
  };
  return self;
}

module.exports = Feature;
