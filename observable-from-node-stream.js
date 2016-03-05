// based heavily on https://github.com/Reactive-Extensions/rx-node/blob/eccf93fa643954ad4009e1bbc1f4895091b397ba/index.js

const Rx = require('rxjs/Rx');

module.exports = fromStream;

function fromStream(stream, finishEventName, dataEventName) {
  stream.pause();

  finishEventName || (finishEventName = 'end');
  dataEventName || (dataEventName = 'data');

  return Rx.Observable.create(function (observer) {
    function dataHandler (data) {
      observer.next(data);
    }

    function errorHandler (err) {
      observer.error(err);
    }

    function endHandler () {
      observer.complete();
    }

    stream.addListener(dataEventName, dataHandler);
    stream.addListener('error', errorHandler);
    stream.addListener(finishEventName, endHandler);

    stream.resume();

    return function () {
      stream.removeListener(dataEventName, dataHandler);
      stream.removeListener('error', errorHandler);
      stream.removeListener(finishEventName, endHandler);
    };
  }).publish().refCount();
}

