// based heavily on https://github.com/Reactive-Extensions/rx-node/blob/eccf93fa643954ad4009e1bbc1f4895091b397ba/index.js

const Rx = require('rxjs/Rx');

module.exports = writeToStream;

function writeToStream(observable, stream, encoding) {
  observable.subscribe(
  function next(x) {
    stream.write(x);
  },
  function error(err) {
    stream.emit('error', err);
  },
  function complete() {
    stream.end();
  });
}
