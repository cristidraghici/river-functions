'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var _arguments = arguments;

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _lodash = require('lodash');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var log = function log() {
    console.log(_arguments);
};

/**
 * Convert an object to an array
 */
var obj2array = function obj2array(obj) {
    var out = [],
        keys = Object.keys(obj),
        i,
        len = keys.length;

    keys.sort();

    for (i = 0; i < len; i++) {
        out.push(obj[keys[i]]);
    }

    return out;
};

var exec = function exec(tasks, callback) {
    var len = (0, _lodash.size)(tasks);
    var done = 0;
    var status = true;
    var results = {};
    var errors = {};

    var complete = function complete() {
        done = done + 1;

        if (done === len) {
            callback.call(undefined, status, obj2array(results), obj2array(errors));
        }
    };

    var yes = function yes(task_id, output) {
        // Store the output
        results[task_id] = output;
        errors[task_id] = false;

        // Check if all tasks are done
        complete.call(undefined);
    };

    var no = function no(task_id, error) {
        // Store the error
        errors[task_id] = error;
        // Change the status of the whole execution to false
        status = false;

        // Check if all tasks are done
        complete.call(undefined);
    };

    var defaultCallback = function defaultCallback(status, results, errors) {
        if ((0, _lodash.size)(results) > 0) {
            log(_chalk2.default.green('>>> Results (' + (0, _lodash.size)(results) + ') >>> '), results, _chalk2.default.green('>>> END of results.'));
        }
        if ((0, _lodash.size)(errors) > 0) {
            log(_chalk2.default.red('>>> Errors (' + (0, _lodash.size)(errors) + ') >>> '), results, _chalk2.default.red('>>> END of errors.'));
        }
    };

    // Add a callback, if none specified on main function call
    if (!callback) {
        var _callback = defaultCallback;
    }

    // Go through each task
    (0, _lodash.each)(tasks, function (task, task_id) {
        task.call(undefined, function (err, data) {
            if (err) {
                return no.call(undefined, task_id, err);
            }

            yes.call(undefined, task_id, data);
        });
    });
};

exports.default = exec;