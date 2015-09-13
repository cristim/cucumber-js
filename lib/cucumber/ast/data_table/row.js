function Row(data, uri) {
  var raw = data.cells.map(function (cell) {
    return cell.value;
  });

  var self = {
    raw: function raw() {
      return raw;
    },

    getLine: function getLine() {
      return data.location.line;
    }
  };
  return self;
}

module.exports = Row;
