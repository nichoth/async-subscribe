module.exports = function Emit (emitter, name, fn) {
    return function () {
        var args = [].slice.call(arguments);
        var cb = args.pop();
        if (!(typeof cb === 'function')) {
            args.push(cb);
            cb = function () {};
        }

        emitter.emit('asyncStart');
        fn.apply(null, args.concat(onResp));

        function onResp (err, resp) {
            if (err) {
                emitter.emit('error', err);
                return cb(err);
            }
            emitter.emit(name, resp);
            cb(null, resp);
        }
    };
}
