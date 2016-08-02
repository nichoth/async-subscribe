var test = require('tape');
var EE = require('events').EventEmitter;
var subscribe = require('../');
var emitter = new EE();
var errorEmitter = new EE();

test('events', function (t) {
    t.plan(5);

    function originalFn (opts, cb) {
        t.deepEqual(opts, { args: 'example' },
            'should pass along args'
        );
        process.nextTick(cb.bind(null, null, { test: 'response' }));
    }

    function errorFn (opts, cb) {
        process.nextTick(cb.bind(null, 'error'));
    }

    function myCallback (err, resp) {
        t.deepEqual(resp, { test: 'response' },
            'should call the callback'
        );
    }

    emitter.on('test', function (resp) {
        t.deepEqual(resp, { test: 'response' },
            'should emit the event and response'
        );
    });

    errorEmitter.on('error', function (err) {
        t.equal(err, 'error', 'should emit the error event');
    });

    emitter.on('asyncStart', function () {
        t.pass('should emit async start event');
    });

    var newFn = subscribe(emitter, 'test', originalFn);
    newFn({ args: 'example' }, myCallback);

    var errorTest = subscribe(errorEmitter, 'x', errorFn);
    errorTest();
});

