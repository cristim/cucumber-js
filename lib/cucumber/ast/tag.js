function Tag(data, uri) {
  var self = {
    getName: function getName() {
      return data.name;
    },

    getUri: function getUri() {
      return uri;
    },

    getLine: function getLine() {
      return data.location.line;
    }
  };
  return self;
}

module.exports = Tag;
