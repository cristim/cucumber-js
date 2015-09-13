function DocString(data, uri) {
  var self = {
    getContents: function getContents() {
      return data.content;
    },

    getContentType: function getContentType() {
      return data.contentType;
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

module.exports = DocString;
