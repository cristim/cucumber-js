function Row(data) {
  var self = {
    raw: function raw() {
      return data.cells.map(function (cell) {
        return cell.value;
      });
    },

    getLine: function getLine() {
      return data.location.line;
    }
  };
  return self;
}

module.exports = Row;
