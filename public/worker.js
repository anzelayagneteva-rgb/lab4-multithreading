self.onmessage = function (event) {
  const array = event.data.array;
  let sum = 0;

  for (let i = 0; i < array.length; i++) {
    sum += array[i];
  }

  self.postMessage({ sum });
};
