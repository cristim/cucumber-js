function Background(data) {
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

 	  getSteps: function getSteps() {
      return data.steps;
 	  }
  };
  return self;
}

module.exports = Background;
