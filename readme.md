# async subscribe

Emit lifecycle events from an asynchronous function call.


## install

    npm install async-subscribe


## example

```js
var subscribe = require('async-subscribe');
var EE = require('events').EventEmitter;
var emitter = new EE();
var assert = require('assert');

emitter.on('myEvent', function (resp) {
    console.log('emits my event', resp);
});

emitter.on('asyncStart', function () {
    console.log('emits async start event');
});

emitter.on('asyncEnd', function () {
    console.log('emits async end event');
});

function callAPI (opts, cb) {
    assert.deepEqual(opts, { args: 'example' },
        'should pass along args'
    );
    process.nextTick(cb.bind(null, null, { test: 'response' }));
}

function myCallback (err, resp) {
    console.log('calls my callback', err, resp);
}

var callAndEmit = subscribe(emitter, 'myEvent', callAPI);

// call this the same way as the original function, but now we emit
// events too
callAndEmit({ args: 'example' }, myCallback);
```
