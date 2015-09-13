function Parser(featureSources, astFilter) {
  var Gherkin  = require('gherkin');
  var Cucumber = require('../cucumber');

  var parser   = new Gherkin.Parser();

  var self = {
    parse: function parse() {
      var features = Cucumber.Type.Collection();

      featureSources.forEach(function (featureSource) {
        var uri    = featureSource[Parser.FEATURE_NAME_SOURCE_PAIR_URI_INDEX];
        var source = featureSource[Parser.FEATURE_NAME_SOURCE_PAIR_SOURCE_INDEX].toString();

        try {
          var featureData = parser.parse(source);
        } catch(e) {
          e.message += '\npath: ' + uri;
          throw e;
        }

        features.add(Cucumber.Ast.Feature(featureData, uri));
      });

      return features;
    }
  };
  return self;
}

Parser.FEATURE_NAME_SOURCE_PAIR_URI_INDEX = 0;
Parser.FEATURE_NAME_SOURCE_PAIR_SOURCE_INDEX = 1;

module.exports = Parser;
