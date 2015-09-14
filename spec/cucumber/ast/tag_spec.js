require('../../support/spec_helper');

describe("Cucumber.Ast.Tag", function () {
  var Cucumber = requireLib('cucumber');

  var line, name, tag, uri;

  beforeEach(function () {
    line = createSpy("line");
    name = createSpy("name");
    uri  = createSpy("uri");
    var data = {
      name: name,
      location: {line: line}
    };
    tag = Cucumber.Ast.Tag(data, uri);
  });

  describe("getName()", function () {
    it("returns the name of the tag", function () {
      expect(tag.getName()).toBe(name);
    });
  });

  describe("getUri()", function () {
    it("returns the URI on which the background starts", function () {
      expect(tag.getUri()).toBe(uri);
    });
  });

  describe("getLine()", function () {
    it("returns the line on which the DocString starts", function () {
      expect(tag.getLine()).toBe(line);
    });
  });
});
