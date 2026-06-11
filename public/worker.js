// Web Worker для вычисления суммы части массива
self.onmessage = function (e) {
  const { array, startIndex, endIndex, workerId } = e.data;
  
  let sum = 0;
  for (let i = startIndex; i < endIndex; i++) {
    sum += array[i];
  }
  
  self.postMessage({ sum, workerId });
};
