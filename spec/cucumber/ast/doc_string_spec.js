require('../../support/spec_helper');

describe("Cucumber.Ast.DocString", function () {
  var Cucumber = requireLib('cucumber');
  var docString, content, uri, line, contentType;

  beforeEach(function () {
    contentType = createSpy("content type");
    content     = createSpy("content");
    uri         = createSpy("uri");
    line        = createSpy("line");
    var data = {
      content: content,
      contentType: contentType,
      location: {line: line}
    };
    docString   = Cucumber.Ast.DocString(data, uri);
  });

  describe("getContents()", function () {
    it("returns the contents of the DocString", function () {
      expect(docString.getContents()).toBe(content);
    });
  });

  describe("getContentType()", function () {
    it("returns the doc type of the DocString", function () {
      expect(docString.getContentType()).toBe(contentType);
    });
  });

  describe("getUri()", function () {
    it("returns the URI on which the background starts", function () {
      expect(docString.getUri()).toBe(uri);
    });
  });

  describe("getLine()", function () {
    it("returns the line on which the DocString starts", function () {
      expect(docString.getLine()).toBe(line);
    });
  });
});
