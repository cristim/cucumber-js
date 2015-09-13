function DocString(payload, uri) {
  var self = {
    getContents: function getContents() {
      return payload.content;
    },

    getContentType: function getContentType() {
      return payload.contentType;
    },

    getUri: function getUri() {
      return uri;
    },

    getLine: function getLine() {
      return payload.location.line;
    }
  };
  return self;
}

module.exports = DocString;
