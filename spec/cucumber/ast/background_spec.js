require('../../support/spec_helper');

describe("Cucumber.Ast.Background", function () {
  var Cucumber = requireLib('cucumber');
  var background, description, keyword, name, line, step1, step1Data, step2, step2Data, uri;

  beforeEach(function () {
    description = createSpy("description");
    keyword     = createSpy("keyword");
    name        = createSpy("name");
    line        = createSpy("line");
    step1       = createSpyWithStubs('step1', {setPreviousStep: true});
    step1Data   = createSpy("step1 data");
    step2       = createSpyWithStubs('step2', {setPreviousStep: true});
    step2Data   = createSpy("step2 data");
    uri         = createSpy("uri");
    var data = {
      description: description,
      keyword: keyword,
      location: {line: line},
      name: name,
      steps: [step1Data, step2Data]
    };
    spyOn(Cucumber.Ast, 'Step').andCallFake(function(data) {
      if (data === step1Data)
        return step1;
      else if (data === step2Data)
        return step2;
    });
    background = Cucumber.Ast.Background(data, uri);
  });

  describe("constructor", function () {
    it("creates steps", function () {
      expect(Cucumber.Ast.Step).toHaveBeenCalledWith(step1Data, uri);
      expect(Cucumber.Ast.Step).toHaveBeenCalledWith(step2Data, uri);
    });

    it("sets previous steps", function () {
      expect(step1.setPreviousStep).toHaveBeenCalledWith(undefined);
      expect(step2.setPreviousStep).toHaveBeenCalledWith(step1);
    });
  });

  describe("getKeyword()", function () {
    it("returns the keyword", function () {
      expect(background.getKeyword()).toBe(keyword);
    });
  });

  describe("getName()", function () {
    it("returns the name", function () {
      expect(background.getName()).toBe(name);
    });
  });

  describe("getDescription()", function () {
    it("returns the description", function () {
      expect(background.getDescription()).toBe(description);
    });
  });

  describe("getUri()", function () {
    it("returns the URI", function () {
      expect(background.getUri()).toBe(uri);
    });
  });

  describe("getLine()", function () {
    it("returns the line", function () {
      expect(background.getLine()).toBe(line);
    });
  });

  describe("getSteps()", function () {
    it("returns the steps as a Cucumber.Type.Collection", function () {
      var result = background.getSteps();
      expect(result.length()).toBe(2);
      expect(result.getAtIndex(0)).toBe(step1);
      expect(result.getAtIndex(1)).toBe(step2);
    });
  });
});
