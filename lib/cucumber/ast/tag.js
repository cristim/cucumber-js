function Tag(data) {
  var self = {
    getName: function getName() {
      return data.name;
    },

    getUri: function getUri() {
      return data.uri;
    },

    getLine: function getLine() {
      return data.line;
    }
  };
  return self;
}

module.exports = Tag;
