function DocString(data) {
  var self = {
    getContents: function getContents() {
      return data.contents;
    },

    getContentType: function getContentType() {
      return data.contentType;
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

module.exports = DocString;
