self.onmessage = function(event) {
  var array = event.data.array;
  var sum = 0;
  for (var i = 0; i < array.length; i++) {
    sum += array[i];
  }
  self.postMessage({ sum: sum });
};
